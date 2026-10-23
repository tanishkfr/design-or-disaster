import { INVESTIGATIONS } from './capabilities.js'

export const STAGES = [
  'FIRST_LOOK',
  'FIRST_JUDGMENT',
  'CONTEXT',
  'SECOND_LOOK',
  'SECOND_JUDGMENT',
  'REFLECTION',
  'COMPLETE',
]
export const VERDICTS = ['strong_design', 'needs_revision', 'design_disaster']
export const CONFIDENCES = [
  'guessing',
  'somewhat_sure',
  'confident',
  'very_confident',
]
const LENSES = ['hierarchy', 'accessibility', 'usability', 'trust', 'delight']
const clone = (value) => JSON.parse(JSON.stringify(value))
const draft = () => ({ verdict: null, confidence: null, writtenRuling: '' })
const requireThat = (condition, message) => {
  if (!condition) throw new Error(message)
}
const validDraft = (value) =>
  value &&
  (value.verdict === null || VERDICTS.includes(value.verdict)) &&
  (value.confidence === null || CONFIDENCES.includes(value.confidence)) &&
  typeof value.writtenRuling === 'string' &&
  value.writtenRuling.length <= 800
function validSnapshot(snapshot, config) {
  return (
    snapshot &&
    typeof snapshot.id === 'string' &&
    Number.isFinite(snapshot.width) &&
    snapshot.width >= 200 &&
    Number.isFinite(snapshot.height) &&
    snapshot.height > 0 &&
    snapshot.exhibitId === config.exhibit.id &&
    config.exhibit.validate(snapshot.exhibit) &&
    (!snapshot.targets ||
      (Array.isArray(snapshot.targets) &&
        snapshot.targets.every(
          (target) =>
            typeof target.label === 'string' &&
            Number.isFinite(target.x) &&
            Number.isFinite(target.y) &&
            target.x >= 0 &&
            target.x <= 100 &&
            target.y >= 0 &&
            target.y <= 100,
        )))
  )
}

export function createInvestigation(caseId, id, now) {
  requireThat(
    Boolean(INVESTIGATIONS[caseId]),
    'This case does not support Second Look.',
  )
  return {
    schemaVersion: 1,
    investigationVersion: INVESTIGATIONS[caseId].version,
    id,
    caseId,
    stage: 'FIRST_LOOK',
    furthest: 0,
    revision: 0,
    createdAt: now,
    updatedAt: now,
    firstLook: {
      marks: [],
      draft: draft(),
      ...(INVESTIGATIONS[caseId].firstLook === 'interactive'
        ? {
            exhibit: INVESTIGATIONS[caseId].exhibit.create(),
            snapshots: {},
            activeSnapshotId: null,
          }
        : {}),
    },
    firstJudgment: null,
    contextRevealed: [],
    secondLook: {
      marks: [],
      draft: draft(),
      exhibit: INVESTIGATIONS[caseId].exhibit.create(),
      snapshots: {},
      activeSnapshotId: null,
    },
    secondJudgment: null,
    reflectionNote: '',
    completedAt: null,
  }
}

export function validMarks(marks, described = false) {
  return (
    Array.isArray(marks) &&
    (!described || marks.length > 0) &&
    marks.every(
      (mark) =>
        typeof mark.id === 'string' &&
        Number.isFinite(mark.x) &&
        Number.isFinite(mark.y) &&
        mark.x >= 0 &&
        mark.x <= 100 &&
        mark.y >= 0 &&
        mark.y <= 100 &&
        (mark.lens == null || LENSES.includes(mark.lens)) &&
        typeof mark.note === 'string' &&
        (!described || Boolean(mark.note.trim())) &&
        ((mark.width == null && mark.height == null) ||
          (Number.isFinite(mark.width) &&
            Number.isFinite(mark.height) &&
            mark.width > 0 &&
            mark.height > 0 &&
            mark.x + mark.width <= 100.001 &&
            mark.y + mark.height <= 100.001)),
    ) &&
    new Set(marks.map((mark) => mark.id)).size === marks.length
  )
}
export const evidenceReady = (marks) => validMarks(marks, true)
export function validJudgment(value) {
  return (
    value &&
    VERDICTS.includes(value.verdict) &&
    CONFIDENCES.includes(value.confidence) &&
    typeof value.writtenRuling === 'string' &&
    Boolean(value.writtenRuling.trim())
  )
}
export function availableStages(record) {
  return STAGES.slice(0, Math.min(record.furthest + 1, 6))
}

export function transition(record, event, now) {
  requireThat(
    record.stage !== 'COMPLETE',
    'This investigation is complete and read-only. Start a new attempt to investigate again.',
  )
  const config = INVESTIGATIONS[record.caseId]
  requireThat(Boolean(config), 'Unsupported case.')
  const next = clone(record)
  const stage = record.stage
  const advance = (target) => {
    next.stage = target
    next.furthest = Math.max(next.furthest, STAGES.indexOf(target))
  }
  if (event.type === 'GO') {
    requireThat(
      availableStages(record).includes(event.stage),
      'That stage is not available yet.',
    )
    if (event.stage === 'FIRST_JUDGMENT')
      requireThat(
        evidenceReady(record.firstLook.marks),
        'Describe first-look evidence before returning to judgment.',
      )
    if (event.stage === 'SECOND_JUDGMENT')
      requireThat(
        evidenceReady(record.secondLook.marks),
        'Describe second-look evidence before returning to judgment.',
      )
    next.stage = event.stage
  } else if (event.type === 'FIRST_MARKS') {
    requireThat(
      stage === 'FIRST_LOOK' && !record.firstJudgment,
      'The first evidence is sealed.',
    )
    requireThat(
      validMarks(event.marks) &&
        (config.firstLook !== 'interactive' ||
          event.marks.every(
            (mark) => record.firstLook.snapshots[mark.frameId],
          )),
      'Invalid first-look evidence.',
    )
    next.firstLook.marks = clone(event.marks)
  } else if (event.type === 'DRAFT') {
    const first = stage === 'FIRST_JUDGMENT'
    requireThat(
      first || stage === 'SECOND_JUDGMENT',
      'Open the judgment step before editing a ruling.',
    )
    requireThat(
      !(first ? record.firstJudgment : record.secondJudgment),
      'This judgment is already sealed.',
    )
    const fields = ['verdict', 'confidence', 'writtenRuling']
    requireThat(
      Object.keys(event.patch).every((key) => fields.includes(key)),
      'Unknown judgment field.',
    )
    Object.assign(
      first ? next.firstLook.draft : next.secondLook.draft,
      event.patch,
    )
    requireThat(
      validDraft(first ? next.firstLook.draft : next.secondLook.draft),
      'Invalid judgment draft.',
    )
  } else if (event.type === 'NEXT') {
    if (stage === 'FIRST_LOOK') {
      requireThat(
        evidenceReady(record.firstLook.marks),
        'Describe at least one piece of evidence.',
      )
      advance('FIRST_JUDGMENT')
    } else if (stage === 'FIRST_JUDGMENT' && record.firstJudgment)
      advance('CONTEXT')
    else if (stage === 'CONTEXT') {
      requireThat(
        config.context.every((item) =>
          record.contextRevealed.includes(item.id),
        ),
        'Open each context document before your second look.',
      )
      if (record.furthest < 3 && config.firstLook === 'interactive')
        next.secondLook.exhibit = clone(record.firstLook.exhibit)
      advance('SECOND_LOOK')
    } else if (stage === 'SECOND_LOOK') {
      requireThat(
        evidenceReady(record.secondLook.marks),
        'Describe at least one second-look observation.',
      )
      advance('SECOND_JUDGMENT')
    } else if (stage === 'SECOND_JUDGMENT' && record.secondJudgment)
      advance('REFLECTION')
    else throw new Error('This transition needs a submitted judgment.')
  } else if (event.type === 'SUBMIT_FIRST' || event.type === 'SUBMIT_SECOND') {
    const first = event.type === 'SUBMIT_FIRST'
    requireThat(
      stage === (first ? 'FIRST_JUDGMENT' : 'SECOND_JUDGMENT'),
      'Judgment submission is not allowed here.',
    )
    requireThat(
      !(first ? record.firstJudgment : record.secondJudgment),
      'This judgment was already submitted.',
    )
    const look = first ? record.firstLook : record.secondLook
    requireThat(
      evidenceReady(look.marks) && validJudgment(look.draft),
      'Choose a verdict and confidence, describe your evidence and write your reasoning.',
    )
    const snapshot = {
      ...clone(look.draft),
      writtenRuling: look.draft.writtenRuling.trim(),
      evidenceMap: clone(look.marks),
      submittedAt: now,
    }
    if (first) {
      next.firstJudgment = snapshot
      advance('CONTEXT')
    } else {
      next.secondJudgment = snapshot
      advance('REFLECTION')
    }
  } else if (event.type === 'REVEAL') {
    requireThat(
      stage === 'CONTEXT' &&
        config.context.some((item) => item.id === event.id),
      'That context document is not available.',
    )
    next.contextRevealed = [...new Set([...record.contextRevealed, event.id])]
  } else if (['EXHIBIT', 'CAPTURE', 'SELECT_SNAPSHOT'].includes(event.type)) {
    const first = stage === 'FIRST_LOOK'
    requireThat(
      (first && config.firstLook === 'interactive') || stage === 'SECOND_LOOK',
      'This exhibit is not interactive at this stage.',
    )
    const look = first ? next.firstLook : next.secondLook
    requireThat(
      !(first ? record.firstJudgment : record.secondJudgment) ||
        event.type === 'SELECT_SNAPSHOT',
      'The examination is sealed.',
    )
    if (event.type === 'EXHIBIT') {
      look.exhibit = config.exhibit.reduce(look.exhibit, event.action)
      requireThat(
        config.exhibit.validate(look.exhibit),
        'Invalid exhibit action.',
      )
    } else if (event.type === 'CAPTURE') {
      requireThat(
        validSnapshot(event.snapshot, config),
        'The exhibit is not ready to mark.',
      )
      requireThat(
        !look.snapshots[event.snapshot.id] ||
          JSON.stringify(look.snapshots[event.snapshot.id]) ===
            JSON.stringify(event.snapshot),
        'A captured exhibit state cannot be replaced.',
      )
      look.snapshots[event.snapshot.id] = clone(event.snapshot)
      look.activeSnapshotId = event.snapshot.id
    } else {
      requireThat(look.snapshots[event.id], 'Unknown exhibit state.')
      look.activeSnapshotId = event.id
    }
  } else if (event.type === 'SECOND_MARKS') {
    requireThat(
      stage === 'SECOND_LOOK' && !record.secondJudgment,
      'The second evidence is sealed.',
    )
    requireThat(
      validMarks(event.marks) &&
        event.marks.every((mark) => record.secondLook.snapshots[mark.frameId]),
      'Every second-look mark needs its captured exhibit state.',
    )
    next.secondLook.marks = clone(event.marks)
  } else if (event.type === 'REFLECTION_NOTE') {
    requireThat(
      stage === 'REFLECTION' && typeof event.value === 'string',
      'The reflection is not open.',
    )
    next.reflectionNote = event.value.slice(0, 800)
  } else if (event.type === 'COMPLETE') {
    requireThat(
      stage === 'REFLECTION' && record.firstJudgment && record.secondJudgment,
      'Both judgments must be sealed first.',
    )
    next.completedAt = now
    advance('COMPLETE')
  } else throw new Error('Unknown investigation action.')
  next.revision += 1
  next.updatedAt = now
  return next
}

export function reflectionOutcome(record) {
  const first = record.firstJudgment,
    second = record.secondJudgment
  if (
    !validJudgment(first) ||
    !validJudgment(second) ||
    !evidenceReady(first.evidenceMap) ||
    !evidenceReady(second.evidenceMap)
  )
    return 'incomplete'
  if (first.verdict !== second.verdict) return 'changed_verdict'
  const normalize = (text) => text.trim().replace(/\s+/g, ' ')
  return normalize(first.writtenRuling) === normalize(second.writtenRuling)
    ? 'consistent_reasoning'
    : 'new_reasoning'
}

export function toLegacySubmission(record) {
  if (record.stage !== 'COMPLETE' || !record.secondJudgment) return null
  const judgment = record.secondJudgment
  return {
    caseId: record.caseId,
    investigationId: record.id,
    investigationVersion: record.investigationVersion,
    verdict: judgment.verdict,
    confidence: judgment.confidence,
    confidenceInferred: false,
    writtenRuling: judgment.writtenRuling,
    evidenceMap: clone(judgment.evidenceMap),
    evidenceTags: [
      ...new Set(judgment.evidenceMap.map((mark) => mark.lens).filter(Boolean)),
    ],
    timestamp: record.completedAt,
  }
}

export function validateRecord(record) {
  try {
    const config = INVESTIGATIONS[record.caseId]
    requireThat(
      record.schemaVersion === 1 &&
        record.investigationVersion === config?.version &&
        typeof record.id === 'string',
      'Unsupported investigation schema.',
    )
    requireThat(
      Number.isFinite(record.createdAt) && Number.isFinite(record.updatedAt),
      'Missing record metadata.',
    )
    requireThat(
      STAGES.includes(record.stage) &&
        Number.isInteger(record.revision) &&
        record.revision >= 0 &&
        Number.isInteger(record.furthest) &&
        record.furthest >= STAGES.indexOf(record.stage) &&
        record.furthest <= 6,
      'Invalid investigation stage.',
    )
    requireThat(
      validMarks(record.firstLook.marks) && validMarks(record.secondLook.marks),
      'Invalid evidence data.',
    )
    requireThat(
      Array.isArray(record.contextRevealed) &&
        record.contextRevealed.every((id) =>
          config.context.some((item) => item.id === id),
        ),
      'Invalid context record.',
    )
    requireThat(
      validDraft(record.firstLook.draft) &&
        validDraft(record.secondLook.draft) &&
        typeof record.reflectionNote === 'string' &&
        config.exhibit.validate(record.secondLook.exhibit) &&
        record.secondLook.snapshots &&
        typeof record.secondLook.snapshots === 'object',
      'Invalid draft data.',
    )
    requireThat(
      Object.entries(record.secondLook.snapshots).every(
        ([id, snapshot]) =>
          snapshot.id === id && validSnapshot(snapshot, config),
      ),
      'Invalid captured exhibit.',
    )
    requireThat(
      record.secondLook.activeSnapshotId === null ||
        record.secondLook.snapshots[record.secondLook.activeSnapshotId],
      'Missing active exhibit snapshot.',
    )
    if (config.firstLook === 'interactive') {
      requireThat(
        config.exhibit.validate(record.firstLook.exhibit) &&
          record.firstLook.snapshots &&
          Object.entries(record.firstLook.snapshots).every(
            ([id, snapshot]) =>
              id === snapshot.id && validSnapshot(snapshot, config),
          ),
        'Invalid first exhibit.',
      )
      requireThat(
        record.firstLook.marks.every(
          (mark) => record.firstLook.snapshots[mark.frameId],
        ),
        'Missing first-look capture.',
      )
      requireThat(
        record.firstLook.activeSnapshotId === null ||
          record.firstLook.snapshots[record.firstLook.activeSnapshotId],
        'Missing active first-look capture.',
      )
    }
    if (record.furthest >= 2)
      requireThat(
        validJudgment(record.firstJudgment) &&
          evidenceReady(record.firstJudgment.evidenceMap) &&
          JSON.stringify(record.firstJudgment.evidenceMap) ===
            JSON.stringify(record.firstLook.marks),
        'Missing or altered first judgment.',
      )
    if (record.furthest >= 3)
      requireThat(
        config.context.every((item) =>
          record.contextRevealed.includes(item.id),
        ),
        'Missing revealed context.',
      )
    if (record.furthest >= 5)
      requireThat(
        validJudgment(record.secondJudgment) &&
          evidenceReady(record.secondJudgment.evidenceMap) &&
          JSON.stringify(record.secondJudgment.evidenceMap) ===
            JSON.stringify(record.secondLook.marks),
        'Missing or altered second judgment.',
      )
    requireThat(
      record.secondLook.marks.every(
        (mark) => record.secondLook.snapshots[mark.frameId],
      ),
      'Missing exhibit snapshot.',
    )
    if (record.stage === 'COMPLETE')
      requireThat(
        Number.isFinite(record.completedAt),
        'Missing completion metadata.',
      )
    return true
  } catch {
    return false
  }
}
