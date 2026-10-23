import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  createInvestigation,
  transition,
  validateRecord,
  reflectionOutcome,
  toLegacySubmission,
} from '../src/investigation/engine.js'
import {
  INVESTIGATIONS,
  investigationFor,
} from '../src/investigation/capabilities.js'
import {
  changeStore,
  decodeStore,
  emptyStore,
  INVESTIGATION_KEY,
  persistChange,
} from '../src/investigation/storage.js'
import {
  createExhibit,
  updateExhibit,
  DEMO,
} from '../src/investigation/benefitsModel.js'

const point = {
  id: 'p1',
  x: 40,
  y: 30,
  lens: null,
  note: 'The summary draws my attention.',
}
const region = {
  id: 'r1',
  x: 10,
  y: 20,
  width: 70,
  height: 15,
  lens: 'usability',
  note: 'The errors give a route to recovery.',
  frameId: 'form-1',
}
const judgment = {
  verdict: 'needs_revision',
  confidence: 'somewhat_sure',
  writtenRuling: 'The error summary makes the next action visible.',
}
let time = 100
const act = (record, event) => transition(record, event, ++time)
function first() {
  let record = createInvestigation('case-006', 'attempt', time)
  record = act(record, { type: 'FIRST_MARKS', marks: [point] })
  record = act(record, { type: 'NEXT' })
  record = act(record, { type: 'DRAFT', patch: judgment })
  return act(record, { type: 'SUBMIT_FIRST' })
}
function second() {
  let record = first()
  for (const item of INVESTIGATIONS['case-006'].context)
    record = act(record, { type: 'REVEAL', id: item.id })
  record = act(record, { type: 'NEXT' })
  record = act(record, {
    type: 'CAPTURE',
    snapshot: {
      id: 'form-1',
      exhibitId: 'benefits-form-v1',
      width: 680,
      height: 1000,
      label: 'form',
      exhibit: createExhibit(),
    },
  })
  record = act(record, { type: 'SECOND_MARKS', marks: [region] })
  record = act(record, { type: 'NEXT' })
  return act(record, { type: 'DRAFT', patch: judgment })
}
function complete() {
  return act(act(second(), { type: 'SUBMIT_SECOND' }), { type: 'COMPLETE' })
}
const storage = (initial) => {
  let raw = initial ?? null
  return {
    getItem: (key) => (key === INVESTIGATION_KEY ? raw : null),
    setItem: (_key, value) => {
      raw = value
    },
  }
}

test('first look has no selected critical lens and incomplete evidence cannot advance', () => {
  const record = createInvestigation('case-006', 'a', 1)
  assert.deepEqual(record.firstLook.marks, [])
  assert.throws(() => act(record, { type: 'NEXT' }), /Describe/)
  assert.throws(
    () => act(record, { type: 'GO', stage: 'SECOND_LOOK' }),
    /not available/,
  )
  assert.throws(() => act(record, { type: 'SUBMIT_SECOND' }), /not allowed/)
})
test('legal transitions include returning to earlier unsealed steps', () => {
  let record = act(createInvestigation('case-006', 'a', 1), {
    type: 'FIRST_MARKS',
    marks: [point],
  })
  record = act(record, { type: 'NEXT' })
  record = act(record, { type: 'GO', stage: 'FIRST_LOOK' })
  assert.equal(record.stage, 'FIRST_LOOK')
  assert.equal(record.firstLook.marks[0].lens, null)
  record = act(record, { type: 'NEXT' })
  assert.equal(record.stage, 'FIRST_JUDGMENT')
})
test('submitting requires self-reported confidence and written reasoning', () => {
  let record = act(createInvestigation('case-006', 'a', 1), {
    type: 'FIRST_MARKS',
    marks: [point],
  })
  record = act(record, { type: 'NEXT' })
  record = act(record, { type: 'DRAFT', patch: { verdict: 'strong_design' } })
  assert.throws(() => act(record, { type: 'SUBMIT_FIRST' }), /confidence/)
})
test('first judgment is an independent snapshot and cannot be silently rewritten', () => {
  const record = first(),
    snapshot = structuredClone(record.firstJudgment)
  const visited = act(record, { type: 'GO', stage: 'FIRST_LOOK' })
  assert.throws(
    () => act(visited, { type: 'FIRST_MARKS', marks: [] }),
    /sealed/,
  )
  const judgmentStep = act(record, { type: 'GO', stage: 'FIRST_JUDGMENT' })
  assert.throws(
    () =>
      act(judgmentStep, {
        type: 'DRAFT',
        patch: { writtenRuling: 'Replace it' },
      }),
    /sealed/,
  )
  assert.deepEqual(record.firstJudgment, snapshot)
  assert.notEqual(record.firstLook.marks, record.firstJudgment.evidenceMap)
})
test('context is explicit, provenance-labeled and cannot be skipped', () => {
  const record = first()
  assert.throws(() => act(record, { type: 'NEXT' }), /context document/)
  assert.throws(
    () => act(record, { type: 'REVEAL', id: 'invented' }),
    /not available/,
  )
  assert.ok(INVESTIGATIONS['case-006'].context.every((item) => item.provenance))
})
test('second judgment preserves independent marks and unchanged verdicts', () => {
  const record = act(second(), { type: 'SUBMIT_SECOND' })
  assert.equal(record.stage, 'REFLECTION')
  assert.equal(record.secondJudgment.verdict, record.firstJudgment.verdict)
  assert.equal(record.firstJudgment.evidenceMap[0].id, 'p1')
  assert.equal(record.secondJudgment.evidenceMap[0].id, 'r1')
  assert.equal(reflectionOutcome(record), 'consistent_reasoning')
})
test('reflection distinguishes changed verdict, changed wording and incomplete records', () => {
  let record = second()
  record = act(record, { type: 'DRAFT', patch: { verdict: 'strong_design' } })
  assert.equal(
    reflectionOutcome(act(record, { type: 'SUBMIT_SECOND' })),
    'changed_verdict',
  )
  record = second()
  record = act(record, {
    type: 'DRAFT',
    patch: { writtenRuling: 'The draft recovery now matters to my judgment.' },
  })
  assert.equal(
    reflectionOutcome(act(record, { type: 'SUBMIT_SECOND' })),
    'new_reasoning',
  )
  assert.equal(reflectionOutcome(first()), 'incomplete')
})
test('second submission and completion are idempotently guarded', () => {
  const record = act(second(), { type: 'SUBMIT_SECOND' })
  assert.throws(() => act(record, { type: 'SUBMIT_SECOND' }), /not allowed/)
  const finished = act(record, { type: 'COMPLETE' })
  assert.throws(() => act(finished, { type: 'COMPLETE' }), /read-only/)
  assert.ok(validateRecord(finished))
})
test('snapshot IDs prevent marks from being applied to an uncaptured exhibit', () => {
  let record = first()
  for (const item of INVESTIGATIONS['case-006'].context)
    record = act(record, { type: 'REVEAL', id: item.id })
  record = act(record, { type: 'NEXT' })
  assert.throws(
    () => act(record, { type: 'SECOND_MARKS', marks: [region] }),
    /captured exhibit/,
  )
})
test('unfinished state and complete records survive JSON persistence', () => {
  for (const record of [first(), second(), complete()]) {
    const store = { ...emptyStore(), records: { 'case-006': record } }
    assert.deepEqual(decodeStore(JSON.stringify(store)), store)
  }
})
test('stale tabs cannot overwrite a newer investigation revision', () => {
  const current = { ...emptyStore(), records: { 'case-006': first() } },
    disk = storage(JSON.stringify(current))
  persistChange(
    disk,
    current,
    'case-006',
    { type: 'REVEAL', id: 'person' },
    { now: 9 },
  )
  const saved = disk.getItem(INVESTIGATION_KEY)
  assert.throws(
    () =>
      persistChange(
        disk,
        current,
        'case-006',
        { type: 'REVEAL', id: 'artifact' },
        { now: 10 },
      ),
    /another tab/,
  )
  assert.equal(disk.getItem(INVESTIGATION_KEY), saved)
})
test('invalid or corrupted storage is rejected without overwriting it', () => {
  assert.throws(() => decodeStore('{bad'))
  const record = first()
  record.firstLook.marks[0].x = 900
  const raw = JSON.stringify({
      ...emptyStore(),
      records: { 'case-006': record },
    }),
    disk = storage(raw)
  assert.throws(() =>
    persistChange(
      disk,
      emptyStore(),
      'case-006',
      { type: 'START' },
      { id: 'new', now: 2 },
    ),
  )
  assert.equal(disk.getItem(INVESTIGATION_KEY), raw)
})
test('restart requires confirmation and preserves completed history', () => {
  const original = complete(),
    store = { ...emptyStore(), records: { 'case-006': original } }
  assert.throws(
    () =>
      changeStore(store, 'case-006', { type: 'RESTART' }, { id: 'b', now: 9 }),
    /Confirm/,
  )
  const next = changeStore(
    store,
    'case-006',
    { type: 'RESTART' },
    { id: 'b', now: 9, confirm: true },
  )
  assert.deepEqual(next.history['case-006'][0], original)
  assert.equal(next.records['case-006'].stage, 'FIRST_LOOK')
  assert.equal(store.records['case-006'].id, 'attempt')
})
test('legacy projection only occurs at completion and never invents a second judgment', () => {
  assert.equal(toLegacySubmission(first()), null)
  const legacy = {
    caseId: 'case-006',
    evidenceMap: [point],
    verdict: 'needs_revision',
  }
  assert.equal(legacy.secondJudgment, undefined)
  const projected = toLegacySubmission(complete())
  assert.equal(projected.caseId, 'case-006')
  assert.equal(projected.confidenceInferred, false)
  assert.equal(projected.investigationId, 'attempt')
})
test('only declared cases opt in; sealed finale is explicitly supported', () => {
  assert.equal(investigationFor({ id: 'case-006', caseStatus: 'sealed' }), null)
  assert.equal(createInvestigation('case-015','sealed',1).caseId,'case-015')
  assert.throws(
    () => createInvestigation('case-004', 'old', 1),
    /does not support/,
  )
})
test('form validation, interruption and recovery preserve fictional work deterministically', () => {
  let exhibit = updateExhibit(createExhibit(), { type: 'SUBMIT' })
  assert.equal(Object.keys(exhibit.errors).length, 5)
  for (const [field, value] of Object.entries(DEMO))
    exhibit = updateExhibit(exhibit, { type: 'FIELD', field, value })
  const values = structuredClone(exhibit.values)
  exhibit = updateExhibit(exhibit, { type: 'INTERRUPT' })
  assert.equal(exhibit.screen, 'interrupted')
  exhibit = updateExhibit(exhibit, { type: 'RECOVER' })
  assert.ok(exhibit.recoveryError)
  exhibit = updateExhibit(exhibit, {
    type: 'RECOVERY_CODE',
    value: 'TEST-1042',
  })
  exhibit = updateExhibit(exhibit, { type: 'RECOVER' })
  assert.deepEqual(exhibit.values, values)
  exhibit = updateExhibit(exhibit, { type: 'SUBMIT' })
  assert.equal(exhibit.screen, 'receipt')
  assert.deepEqual(exhibit.events, [
    'validation-shown',
    'session-interrupted',
    'draft-recovered',
    'task-completed',
  ])
})

test('missing drafts and malformed exhibit snapshots fail hydration safely', () => {
  const record = first()
  delete record.firstLook.draft
  assert.equal(validateRecord(record), false)
  const other = second()
  other.secondLook.snapshots['form-1'].exhibit.values = null
  assert.equal(validateRecord(other), false)
})
test('a captured exhibit state cannot be replaced under an existing coordinate frame', () => {
  const record = act(second(), { type: 'GO', stage: 'SECOND_LOOK' })
  const snapshot = { ...record.secondLook.snapshots['form-1'], height: 500 }
  assert.throws(
    () => act(record, { type: 'CAPTURE', snapshot }),
    /cannot be replaced/,
  )
})
test('the second judgment also stays sealed when revisiting earlier stages', () => {
  const record = act(second(), { type: 'SUBMIT_SECOND' })
  const earlier = act(record, { type: 'GO', stage: 'SECOND_LOOK' })
  assert.throws(
    () => act(earlier, { type: 'SECOND_MARKS', marks: [] }),
    /sealed/,
  )
  const judgmentStep = act(record, { type: 'GO', stage: 'SECOND_JUDGMENT' })
  assert.throws(
    () =>
      act(judgmentStep, {
        type: 'DRAFT',
        patch: { verdict: 'design_disaster' },
      }),
    /sealed/,
  )
})
