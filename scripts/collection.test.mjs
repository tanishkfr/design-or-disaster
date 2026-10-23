import { CASES } from '../src/data/cases.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CURATED_IDS,
  INVESTIGATIONS,
} from '../src/investigation/capabilities.js'
import {
  banking,
  portfolio,
  bulletin,
  fashion,
  visibleListings,
} from '../src/investigation/exhibitModels.js'
import {
  createInvestigation,
  transition,
  validateRecord,
} from '../src/investigation/engine.js'
import { buildReport } from '../src/investigation/report.js'
import {
  perspectivesFor,
  spatialPositions,
  perspectiveFrames,
} from '../src/investigation/perspectives.js'
import { wrapLines, textReportHtml } from '../src/investigation/export.js'
import { deriveLeadInsight } from '../src/utils/reportInsights.js'
import { decodeLegacyProfile, saveLegacyProfile, freshProfile } from '../src/utils/legacyStorage.js'
const decision = {
  verdict: 'needs_revision',
  confidence: 'confident',
  writtenRuling: 'The available route works for this fictional task.',
}
test('portable text export escapes saved markup and preserves incomplete and sealed boundaries', () => {
  const record = createInvestigation('case-015')
  record.firstLook.marks = [{ id: 'text', x: 20, y: 30, note: '<img src=x onerror=alert(1)>', lens: null }]
  const html = textReportHtml(buildReport({ 'case-015': record }), id => CASES.find(item => item.id === id), INVESTIGATIONS)
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'))
  assert.ok(!html.includes('<img src=x'))
  assert.ok(html.includes('No submitted judgment.'))
  assert.ok(html.includes('incomplete / sealed finale'))
  assert.ok(!html.includes('The Scanner'))
  assert.ok(!html.includes('<script'))
})
test('legacy frequency summaries do not infer attention order or a personality from counts', () => {
  const insight = deriveLeadInsight({ submissions: [
    { evidenceTags: ['trust'] },
    { evidenceTags: ['hierarchy', 'trust'] },
  ] })
  assert.equal(insight.headline, 'Trust appears most often in your record.')
  const balanced = deriveLeadInsight({ submissions: [{ evidenceTags: ['trust', 'hierarchy', 'accessibility', 'usability', 'delight'] }] })
  assert.equal(balanced.headline, 'All five lenses appear equally often.')
})
test('malformed legacy records cannot crash the archive or be overwritten without a confirmed reset', () => {
  for (const raw of ['{bad json', '{"submissions":{}}', '{"submissions":[null]}', 'null']) {
    const storage = { getItem: () => raw, setItem: () => { throw new Error('must not write') } }
    assert.throws(() => decodeLegacyProfile(raw))
    assert.throws(() => saveLegacyProfile(storage, freshProfile()))
  }
  let value = '{bad json'
  const storage = { getItem: () => value, setItem: (_, next) => { value = next } }
  saveLegacyProfile(storage, freshProfile(), true)
  assert.deepEqual(decodeLegacyProfile(value), freshProfile())
  const point = { caseId: 'case-001', evidenceMap: [{ x: 50, y: 50 }] }
  assert.deepEqual(decodeLegacyProfile(JSON.stringify({ submissions: [point] })).submissions[0], point)
})
function complete(id) {
  let r = createInvestigation(id, id, 1),
    tick = 1
  const act = (e) => (r = transition(r, e, ++tick))
  for (const [index, kind] of ['FIRST', 'SECOND'].entries()) {
    const config = INVESTIGATIONS[id],
      first = index === 0
    const mark = {
      id: kind,
      x: 25,
      y: 35,
      lens: first ? 'usability' : 'trust',
      note: `${kind} evidence stays independent.`,
    }
    if (!first || config.firstLook === 'interactive') {
      const look = first ? r.firstLook : r.secondLook
      act({
        type: 'CAPTURE',
        snapshot: {
          id: kind,
          exhibitId: config.exhibit.id,
          width: 600,
          height: 800,
          label: 'test',
          exhibit: look.exhibit,
          targets: [],
        },
      })
      mark.frameId = kind
    }
    act({ type: `${kind}_MARKS`, marks: [mark] })
    act({ type: 'NEXT' })
    act({ type: 'DRAFT', patch: decision })
    act({ type: `SUBMIT_${kind}` })
    if (first) {
      for (const c of config.context) act({ type: 'REVEAL', id: c.id })
      act({ type: 'NEXT' })
    }
  }
  act({ type: 'COMPLETE' })
  return r
}
test('all five registered cases complete, validate, and preserve independent judgments', () => {
  for (const id of CURATED_IDS) {
    const r = complete(id)
    assert.equal(r.stage, 'COMPLETE')
    assert.equal(validateRecord(r), true)
    assert.notDeepEqual(
      r.firstJudgment.evidenceMap,
      r.secondJudgment.evidenceMap,
    )
    assert.deepEqual(JSON.parse(JSON.stringify(r)), r)
  }
})
test('banking search and transfer model includes validation and return route', () => {
  let s = banking.create()
  s = banking.reduce(s, { type: 'OPEN', screen: 'transactions' })
  s = banking.reduce(s, { type: 'SEARCH', value: 'Northline' })
  assert.equal(s.query, 'Northline')
  s = banking.reduce(s, { type: 'TRANSACTION', id: 'refund' })
  assert.equal(s.transaction, 'refund')
  s = banking.reduce(s, { type: 'TRANSFER' })
  assert.ok(s.error)
  for (const [field, value] of Object.entries({
    recipient: 'Alex Demo',
    amount: '12.40',
  }))
    s = banking.reduce(s, { type: 'FIELD', field, value })
  s = banking.reduce(s, { type: 'TRANSFER' })
  assert.equal(s.screen, 'receipt')
  assert.ok(banking.validate(s))
  s = banking.reduce(s, { type: 'OPEN', screen: 'dashboard' })
  assert.equal(s.screen, 'dashboard')
})
test('portfolio navigation, role, contact and motion are controlled', () => {
  let s = portfolio.create()
  s = portfolio.reduce(s, { type: 'PROJECT', id: 'signal' })
  assert.equal(s.screen, 'work')
  assert.equal(s.project, 'signal')
  s = portfolio.reduce(s, { type: 'MOTION' })
  assert.equal(s.motion, false)
  s = portfolio.reduce(s, { type: 'NAV', screen: 'contact' })
  assert.equal(s.screen, 'contact')
  assert.ok(portfolio.validate(s))
})
test('bulletin filters persist through detail and unique shortlist', () => {
  let s = bulletin.create()
  for (const [field, value] of Object.entries({
    category: 'Furniture',
    budget: '45',
    query: 'desk',
  }))
    s = bulletin.reduce(s, { type: 'FILTER', field, value })
  assert.deepEqual(
    visibleListings(s).map((i) => i.id),
    ['desk'],
  )
  s = bulletin.reduce(s, { type: 'LISTING', id: 'desk' })
  s = bulletin.reduce(s, { type: 'SAVE' })
  s = bulletin.reduce(s, { type: 'SAVE' })
  assert.deepEqual(s.saved, ['desk'])
  s = bulletin.reduce(s, { type: 'BACK' })
  assert.equal(s.query, 'desk')
  assert.ok(bulletin.validate(s))
})
test('fashion requires a valid size and supports bag removal without checkout', () => {
  let s = fashion.create()
  s = fashion.reduce(s, { type: 'PRODUCT', id: 'coat' })
  s = fashion.reduce(s, { type: 'ADD' })
  assert.ok(s.error)
  s = fashion.reduce(s, { type: 'SIZE', value: 'M' })
  s = fashion.reduce(s, { type: 'ADD' })
  assert.equal(s.bag.length, 1)
  s = fashion.reduce(s, { type: 'NAV', screen: 'bag' })
  s = fashion.reduce(s, { type: 'REMOVE', index: 0 })
  assert.equal(s.bag.length, 0)
  assert.ok(fashion.validate(s))
})
test('authored contradictions are curated, spatial regions require a matching captured target, sealed stays empty', () => {
  for (const id of CURATED_IDS.filter((i) => i !== 'case-015')) {
    const p = perspectivesFor(id)
    assert.equal(p.positions.length, 5)
    assert.ok(p.contradictions.length)
    assert.ok(
      p.contradictions.every(
        (c) => c.uncertainty && c.perspectives.length >= 2,
      ),
    )
    assert.ok(
      spatialPositions(id, { targets: [] }).every((p) => p.target === null),
    )
  }
  assert.deepEqual(perspectivesFor('case-015'), {
    positions: [],
    contradictions: [],
  })
  const target = {
    id: 'quick-actions',
    left: 10,
    top: 20,
    width: 40,
    height: 8,
  }
  assert.equal(
    spatialPositions('case-001', { targets: [target] }).find(
      (p) => p.lens === 'hierarchy',
    ).target,
    target,
  )
})
test('report handles empty, legacy-only, partial, full, tied and unclassified records', () => {
  assert.equal(buildReport().complete, 0)
  assert.deepEqual(buildReport().leadingLenses, [])
  const legacy = [
    { caseId: 'case-001', verdict: 'needs_revision' },
    { investigationId: 'projected' },
  ]
  assert.equal(buildReport({}, legacy).legacy.length, 1)
  const records = Object.fromEntries(
    CURATED_IDS.map((id) => [id, complete(id)]),
  )
  const report = buildReport(records, legacy)
  assert.equal(report.complete, 5)
  assert.equal(report.paired, 5)
  assert.equal(report.outcomes.consistent_reasoning, 5)
  assert.deepEqual(report.leadingLenses, ['usability', 'trust'])
  assert.deepEqual(report.confidence, { higher: 0, lower: 0, same: 5 })
  const first = records['case-001']
  first.stage = 'SECOND_LOOK'
  first.secondJudgment = null
  first.firstLook.marks[0].lens = null
  const partial = buildReport(records)
  assert.equal(partial.complete, 4)
  assert.equal(partial.paired, 4)
  assert.equal(partial.unclassified, 1)
  assert.ok(partial.cases.find((item) => item.caseId === 'case-015').record)
})
test('export wraps paragraphs and long uninterrupted words without clipping', () => {
  const ctx = { measureText: (text) => ({ width: text.length * 10 }) }
  const lines = wrapLines(
    ctx,
    'word '.repeat(50) + 'z'.repeat(200) + '\nnext',
    100,
  )
  assert.ok(lines.every((line) => line.length <= 10))
  assert.equal(lines.at(-1), 'next')
  assert.equal(
    lines.join('').replaceAll(' ', ''),
    'word'.repeat(50) + 'z'.repeat(200) + 'next',
  )
})

test('static and interactive comparison frames retain separate geometry', () => {
  for (const id of CURATED_IDS) {
    const r = complete(id),
      c = CASES.find((c) => c.id === id),
      frames = perspectiveFrames(r, c)
    assert.ok(frames.length >= 2)
    assert.ok(frames.every((frame) => frame.marks.length))
    if (id === 'case-006') {
      assert.equal(frames[0].image, c.screenshot)
      assert.ok(spatialPositions(id, frames[0]).every((p) => p.target))
    } else assert.ok(frames.every((frame) => !frame.image))
  }
})
test('interactive first-look schema rejects a missing coordinate frame', () => {
  const r = complete('case-001')
  r.firstLook.activeSnapshotId = 'missing'
  assert.equal(validateRecord(r), false)
})

test('malformed simulation events and impossible detail states are rejected', () => {
  for (const model of [banking, portfolio, bulletin, fashion])
    assert.equal(
      model.validate({ ...model.create(), events: [{ fabricated: true }] }),
      false,
    )
  assert.equal(
    bulletin.validate({
      ...bulletin.create(),
      screen: 'detail',
      listing: null,
    }),
    false,
  )
  assert.equal(
    fashion.validate({ ...fashion.create(), size: 'unknown-size' }),
    false,
  )
})
