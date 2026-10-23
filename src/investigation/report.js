import { CURATED_IDS } from './capabilities.js'
import { CONFIDENCES, reflectionOutcome } from './engine.js'

export function buildReport(records = {}, legacy = []) {
  const cases = CURATED_IDS.map((caseId) => {
    const record = records[caseId]
    const before = record?.firstJudgment ?? null,
      after = record?.secondJudgment ?? null
    return {
      caseId,
      record: record ?? null,
      status:
        record?.stage === 'COMPLETE'
          ? 'complete'
          : record
            ? 'incomplete'
            : 'unstarted',
      outcome: reflectionOutcome(record ?? {}),
      before,
      after,
      confidenceChange:
        before && after
          ? CONFIDENCES.indexOf(after.confidence) -
            CONFIDENCES.indexOf(before.confidence)
          : null,
    }
  })
  const paired = cases.filter((item) => item.before && item.after)
  const lensCounts = {
    hierarchy: 0,
    accessibility: 0,
    usability: 0,
    trust: 0,
    delight: 0,
  }
  let unclassified = 0
  for (const item of cases)
    for (const look of [item.record?.firstLook, item.record?.secondLook])
      for (const mark of look?.marks ?? []) {
        if (Object.hasOwn(lensCounts, mark.lens)) lensCounts[mark.lens]++
        else unclassified++
      }
  const maximum = Math.max(...Object.values(lensCounts))
  return {
    cases,
    complete: cases.filter((item) => item.status === 'complete').length,
    paired: paired.length,
    outcomes: Object.fromEntries(
      ['changed_verdict', 'new_reasoning', 'consistent_reasoning'].map(
        (key) => [key, paired.filter((item) => item.outcome === key).length],
      ),
    ),
    confidence: {
      higher: paired.filter((item) => item.confidenceChange > 0).length,
      lower: paired.filter((item) => item.confidenceChange < 0).length,
      same: paired.filter((item) => item.confidenceChange === 0).length,
    },
    lensCounts,
    unclassified,
    leadingLenses: maximum
      ? Object.keys(lensCounts).filter((key) => lensCounts[key] === maximum)
      : [],
    legacy: legacy.filter((item) => !item.investigationId),
    methodology:
      'This report counts saved judgments and explicitly classified marks in the current attempts. It does not assess expertise, infer confidence, score improvement, or diagnose a personality. Equal counts remain tied. Unclassified marks remain unclassified. Earlier attempts are available within each investigation; legacy single-look submissions are listed separately and excluded from before/after counts.',
  }
}
