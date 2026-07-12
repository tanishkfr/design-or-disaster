import { JUROR_BY_LENS } from '../data/jurors'
import { calculateJurorAlignment } from './scoring'

const HIGH_CONFIDENCE = new Set(['confident', 'very_confident']);

/**
 * Derives which of the five juror lenses the investigator's verdicts echo
 * most and least. This is the report's central mechanic: not a score against
 * a correct answer, but a mirror. The panel was built from five positions
 * that don't reduce to one verdict — this shows which one the investigator
 * already argues from, and which one they consistently miss.
 * Returns null until there's enough data to say anything real (3+ rulings).
 */
export function deriveJurorLean(jurorAlignment) {
  const entries = Object.entries(jurorAlignment || {}).filter(([, v]) => v && v.total >= 3)
  if (entries.length < 2) return null

  const sorted = [...entries].sort((a, b) => b[1].pct - a[1].pct)
  const [strongestLens, strongestData] = sorted[0]
  const [weakestLens, weakestData] = sorted[sorted.length - 1]
  if (strongestLens === weakestLens) return null

  return {
    strongest: { lens: strongestLens, title: JUROR_BY_LENS[strongestLens]?.title ?? strongestLens, pct: strongestData.pct, total: strongestData.total },
    weakest:   { lens: weakestLens,   title: JUROR_BY_LENS[weakestLens]?.title ?? weakestLens,   pct: weakestData.pct,   total: weakestData.total },
    spread: strongestData.pct - weakestData.pct,
  }
}

/**
 * Generates the full body of the Investigation Record report from real profile data.
 * Returns { opening, paragraphs, closingLine, question, total, correctCount, lean, ... }
 * or null if no submissions exist.
 */
export function generateFinalReportContent(profile, cases) {
  const subs = profile?.submissions ?? []
  if (subs.length === 0) return null

  const allResults = subs.map(s => {
    const c = cases.find(c => c.id === s.caseId)
    if (!c) return null
    const confRank = { guessing: 1, somewhat_sure: 2, confident: 3, very_confident: 4 }[s.confidence] ?? 0
    return { sub: s, case: c, correct: c.officialVerdict && s.verdict === c.officialVerdict, confRank, sealed: !c.officialVerdict }
  }).filter(Boolean)

  // Sealed cases carry no panel verdict — excluded from the alignment stat entirely
  const sealedResult = allResults.find(r => r.sealed) ?? null
  const results = allResults.filter(r => !r.sealed)
  const total = results.length

  if (total === 0) return null

  const correctCount = results.filter(r => r.correct).length
  const accuracy = Math.round((correctCount / total) * 100)

  const jurorAlignment = calculateJurorAlignment(subs, cases)
  const lean = deriveJurorLean(jurorAlignment)

  const highConf = results.filter(r => r.confRank >= 3)
  const lowConf  = results.filter(r => r.confRank <= 2)
  const highConfCorrect = highConf.filter(r => r.correct).length
  const lowConfCorrect  = lowConf.filter(r => r.correct).length
  const highConfAcc = highConf.length > 0 ? Math.round((highConfCorrect / highConf.length) * 100) : null
  const lowConfAcc  = lowConf.length  > 0 ? Math.round((lowConfCorrect  / lowConf.length)  * 100) : null

  const contested        = results.filter(r => r.case.caseStatus === 'contested')
  const contestedCorrect = contested.filter(r => r.correct).length
  const guiltyCount      = results.filter(r => r.sub.verdict !== 'strong_design').length

  // Confidence-calibration pattern — this is still self-knowledge, not a grade:
  // it says how well your certainty tracked your own agreement with the panel.
  let pattern = 'neutral'
  if      (highConf.length >= 2 && highConfAcc < 50)                                                              pattern = 'overconfident'
  else if (highConf.length >= 2 && highConfAcc >= 80 && lowConfAcc !== null && lowConfAcc < highConfAcc - 15)     pattern = 'calibrated'
  else if (lowConf.length  >= 3 && lowConfAcc  >= 65 && (highConfAcc === null || lowConfAcc > highConfAcc + 10))  pattern = 'underconfident'
  else if (accuracy >= 80 && total >= 5)                                                                           pattern = 'accurate'
  else if (accuracy <= 35 && total >= 5)                                                                           pattern = 'divergent'

  const opening = lean
    ? `Across ${subs.length} ${subs.length === 1 ? 'ruling' : 'rulings'}, your verdicts echo ${lean.strongest.title} most often, and diverge furthest from ${lean.weakest.title}.`
    : `You have filed ${subs.length} ${subs.length === 1 ? 'ruling' : 'rulings'} so far.`

  const paragraphs = []

  // P0 — the lean. This is the headline finding: which lens you already argue
  // from, named plainly, with no claim that it's the correct one.
  if (lean) {
    paragraphs.push(
      `${lean.strongest.title} is the lens your judgment echoes most — ${lean.strongest.pct}% agreement across ${lean.strongest.total} cases. ${lean.weakest.title} is where you diverge furthest, at ${lean.weakest.pct}%. Neither reading is the correct one. The panel was built from five positions that don't reduce to a single verdict — this is which one you already argue from.`
    )
  }

  // P1 — confidence pattern
  if (pattern === 'overconfident') {
    const wrongHighConf = results.filter(r => !r.correct && r.confRank >= 3).sort((a, b) => b.confRank - a.confRank)
    paragraphs.push(
      `The investigation records a consistent pattern. You filed high confidence on ${highConf.length} cases. The panel agreed with you ${highConfCorrect} ${highConfCorrect === 1 ? 'time' : 'times'} — ${highConfAcc}% of the cases you were certain about. On the cases where you filed lower confidence, your agreement rate was ${lowConfAcc !== null ? lowConfAcc + '%' : 'comparable'}. Your confidence was not tracking your alignment with the panel.`
    )
    if (wrongHighConf[0]) {
      paragraphs.push(
        `The clearest example is ${wrongHighConf[0].case.title}. You filed confident or very confident. The panel's majority went the other way. The confidence was not a product of the evidence — it was a position taken before the evidence had been examined fully.`
      )
    }
  } else if (pattern === 'underconfident') {
    paragraphs.push(
      `The gap between what was noticed and what was claimed ran in one direction throughout this investigation. You filed low confidence on ${lowConf.length} cases and agreed with the panel ${lowConfCorrect} times — ${lowConfAcc}% at low conviction. You filed high confidence on ${highConf.length} cases and agreed ${highConfCorrect} times. What was noticed before the ruling appeared was frequently in line with the panel. The certainty attached to it was not.`
    )
    paragraphs.push(
      `This is not an alignment problem. Your reads landed closer to the panel's than the confidence suggested they would. Evidence was found and correctly weighed, and then qualified. The investigation records the qualification without being able to explain it.`
    )
  } else if (pattern === 'calibrated') {
    paragraphs.push(
      `When you committed to a verdict, the panel tended to agree. ${highConfCorrect} of ${highConf.length} high-confidence rulings landed with the panel's read — ${highConfAcc}%. When you were uncertain, the uncertainty was warranted: ${lowConfAcc}% alignment on low-confidence filings. The confidence was tracking the evidence rather than the investigator's comfort.`
    )
    paragraphs.push(
      `This kind of calibration is rarer than it sounds. Most investigators in this archive show a consistent gap in one direction — either filing confidence the alignment doesn't support, or finding evidence and declining to claim it. Neither pattern is present here.`
    )
  } else if (pattern === 'accurate') {
    paragraphs.push(
      `${accuracy}% alignment across ${total} cases is a close read of this panel. Where your verdict diverged from theirs, the divergence was concentrated in the contested cases — the ones where the panel itself was split. Where the panel reached a verdict together, your judgment tracked it closely.`
    )
  } else if (pattern === 'divergent') {
    paragraphs.push(
      `This panel and your verdicts diverged on ${total - correctCount} of ${total} cases. That is not necessarily a failure of judgment — it may be a consistently different perspective. The archive records that the divergence is consistent, and consistent divergence is data about the lens you bring, not an error to correct.`
    )
  } else {
    const confLine = [
      highConfAcc !== null ? `${highConfAcc}% alignment on high-confidence filings` : null,
      lowConfAcc  !== null ? `${lowConfAcc}% on lower-confidence ones`             : null,
    ].filter(Boolean).join(', ')
    paragraphs.push(
      `Across ${total} cases, you filed ${highConf.length} high-confidence verdicts and ${lowConf.length} at lower conviction.${confLine ? ' ' + confLine + '.' : ''} No dominant signal emerged from the confidence distribution.`
    )
  }

  // P2 — contested performance (always included when contested cases were reviewed)
  if (contested.length > 0) {
    const line = contestedCorrect === contested.length
      ? `Your verdict matched the panel's majority on all ${contested.length} contested cases.`
      : contestedCorrect === 0
      ? `Your verdict matched the panel's majority on none of the ${contested.length} contested cases.`
      : `Your verdict matched the panel's majority on ${contestedCorrect} of ${contested.length} contested cases.`

    paragraphs.push(
      `${line} Contested cases are the ones where the panel itself split — where both positions had merit and no consensus was ever reached. They ask you to hold two arguments at once rather than resolve the tension into a clean verdict. ${contestedCorrect >= Math.ceil(contested.length / 2) ? 'You held that tension without flattening it.' : "Your read of the tension differed from the panel's majority — which is exactly the kind of case built to produce that."}`
    )
  }

  // P3 — verdict-leniency lean, only when pronounced
  if (guiltyCount >= total * 0.75) {
    paragraphs.push(
      `You filed ${guiltyCount} critical verdicts out of ${total} — a skeptic's record. The designs that passed your review were in the minority. That's a valid orientation, and a consistent one: the problems you flagged were rarely dismissed by every juror.`
    )
  } else if ((total - guiltyCount) >= total * 0.75) {
    paragraphs.push(
      `You defended ${total - guiltyCount} of ${total} designs — a generous read of the archive. The cases lean toward failure by design; finding merit this often means you're reading past the obvious flaws toward something else.`
    )
  }

  // Closing
  let closingLine = 'The record shows what was found.'
  let question    = 'It does not show what the hesitation was protecting against.'

  if (pattern === 'overconfident') {
    closingLine = 'The confidence was not a product of the evidence.'
    question    = 'What were you protecting when you were certain?'
  } else if (pattern === 'underconfident') {
    closingLine = 'The record shows what was found, and what was hedged.'
    question    = 'What did you already know that you declined to claim?'
  } else if (pattern === 'calibrated') {
    closingLine = 'The record shows what was found, and the confidence placed in it.'
    question    = 'Calibration is the quieter skill. Does it feel like one?'
  } else if (pattern === 'accurate') {
    closingLine = "The record shows close alignment with this panel's read."
    question    = 'Are you aligned because you see clearly, or because you read the room?'
  } else if (pattern === 'divergent') {
    closingLine = 'The record shows a consistent, different read from this panel.'
    question    = 'Consistent divergence is data. The question is what it describes.'
  } else if (contested.length > 0 && contestedCorrect === contested.length) {
    closingLine = 'The record shows what was found on the difficult cases.'
    question    = "You held your position when the panel split. Most don't."
  }

  // Quote-back — the record was listening. Surface one of the investigator's
  // own written rulings, priority: a case where the panel agreed, else any with text.
  const withRuling = results.filter(r => r.sub.writtenRuling && r.sub.writtenRuling.trim())
  const agreedWithRuling = withRuling.filter(r => r.correct)
  const quoteSource = agreedWithRuling[0] ?? withRuling[withRuling.length - 1] ?? null
  const rulingQuote = quoteSource
    ? {
        text: quoteSource.sub.writtenRuling.trim(),
        caseTitle: quoteSource.case.title,
        caseNumber: quoteSource.case.number,
        agreed: quoteSource.correct,
      }
    : null

  // The sealed case — the finale, where their ruling is the only ruling
  const sealedRuling = sealedResult && sealedResult.sub.writtenRuling
    ? {
        text: sealedResult.sub.writtenRuling.trim(),
        caseTitle: sealedResult.case.title,
        caseNumber: sealedResult.case.number,
        verdict: sealedResult.sub.verdict,
      }
    : null

  return { opening, paragraphs, closingLine, question, total, correctCount, rulingQuote, sealedRuling, accuracy, lean }
}



/**
 * Converts category accuracy data into 1–3 authored prose observations.
 * Returns an array of sentence strings — no headers, no bars, no labels.
 */
export function deriveCategoryObservations(accuracyByCategory, submissions, cases) {
  const entries = Object.entries(accuracyByCategory || {});
  const observations = [];

  if (entries.length === 0) return observations;

  // Single category — note it briefly with count context
  if (entries.length === 1) {
    const [cat, acc] = entries[0];
    const caseCount = (submissions || []).filter(s => {
      const c = cases.find(c => c.id === s.caseId);
      return c && c.category === cat;
    }).length;
    observations.push(
      `${formatCategoryLabel(cat)} is the only category assessed so far — ${caseCount} ${caseCount === 1 ? 'case' : 'cases'}, ${acc}% alignment with the panel.`
    );
    return observations;
  }

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const [strongestCat, strongestAcc] = sorted[0];
  const [weakestCat, weakestAcc] = sorted[sorted.length - 1];
  const spread = strongestAcc - weakestAcc;

  // Wide spread — lead with the inconsistency observation
  if (spread >= 30) {
    observations.push(
      `${formatCategoryLabel(strongestCat)} reads clearly to you. ${formatCategoryLabel(weakestCat)} is still developing.`
    );
  } else if (entries.every(([, acc]) => acc >= 70)) {
    observations.push('Your judgment is consistent across the categories reviewed.');
  } else if (entries.every(([, acc]) => acc <= 50)) {
    observations.push('The categories covered so far are pushing back consistently.');
  } else {
    // Mixed — note the strongest without overclaiming
    observations.push(
      `${formatCategoryLabel(strongestCat)} is your clearest category so far.`
    );
  }

  // Reckoning case: find the case the user was most confidently divided from the panel on
  const highConfDiverged = (submissions || []).filter(s => {
    if (!HIGH_CONFIDENCE.has(s.confidence)) return false;
    const c = cases.find(c => c.id === s.caseId);
    return c && c.officialVerdict && s.verdict !== c.officialVerdict;
  });

  if (highConfDiverged.length > 0) {
    const reckoningCase = cases.find(c => c.id === highConfDiverged[0].caseId);
    if (reckoningCase) {
      observations.push(
        `You were most confident on ${reckoningCase.title}. The panel's majority went the other way.`
      );
    }
  }

  return observations;
}

const CATEGORY_DISPLAY = {
  'Visual Hierarchy': 'Hierarchy',
  'Accessibility': 'Accessibility',
  'Navigation': 'Navigation',
  'Information Architecture': 'Information Arch.',
  'Forms & Inputs': 'Forms & Inputs',
  'Delight vs Usability Tradeoffs': 'Delight vs Usability',
  'Wildcard / Controversial': 'Wildcard',
};

export function formatCategoryLabel(cat) {
  return CATEGORY_DISPLAY[cat] || cat;
}

/**
 * Derives the most interesting lead insight to open the report with.
 * Priority: lean > overconfidence > good calibration > category spread >
 * alignment extremes > default. The lean is checked first because it's the
 * report's core claim — which lens you already argue from — not a score.
 * Returns { type, headline, body }
 */
export function deriveLeadInsight(profile, cases) {
  const { submissions, overallAccuracy, accuracyByCategory, jurorAlignment } = profile;

  if (!submissions || submissions.length === 0) {
    return {
      type: 'empty',
      headline: 'No rulings filed yet.',
      body: 'Begin an investigation to start building your Design Eye.',
    };
  }

  const highConfSubs = submissions.filter(s => HIGH_CONFIDENCE.has(s.confidence));
  const highConfCorrect = highConfSubs.filter(s => {
    const c = cases.find(c => c.id === s.caseId);
    return c && c.officialVerdict && s.verdict === c.officialVerdict;
  }).length;

  // 1. Lean — which lens your judgment echoes, and which it diverges from
  const lean = deriveJurorLean(jurorAlignment);
  if (lean && lean.spread >= 25) {
    return {
      type: 'lean',
      headline: `You think like ${lean.strongest.title}.`,
      body: `Your verdicts echo ${lean.strongest.title} ${lean.strongest.pct}% of the time. ${lean.weakest.title} is where you diverge most — ${lean.weakest.pct}%.`,
    };
  }

  // 2. Overconfidence — confident but the panel disagreed more often than not
  if (highConfSubs.length >= 2) {
    const highConfRate = Math.round((highConfCorrect / highConfSubs.length) * 100);

    if (highConfRate < 50) {
      return {
        type: 'overconfident',
        headline: 'Your certainty outpaced your alignment.',
        body: `You were confident ${highConfSubs.length} ${highConfSubs.length === 1 ? 'time' : 'times'}. The panel agreed with you ${highConfCorrect === 1 ? 'once' : `${highConfCorrect} times`}.`,
      };
    }

    // 3. Well calibrated — the panel agreed when you committed
    if (highConfRate >= 80) {
      return {
        type: 'calibrated',
        headline: 'You commit when the panel would too.',
        body: highConfCorrect === highConfSubs.length
          ? `The panel agreed with you every time you were confident.`
          : `When you committed to a verdict, the panel agreed ${highConfCorrect === 1 ? 'once' : `${highConfCorrect} times`} out of ${highConfSubs.length}.`,
      };
    }
  }

  // 4. Category inconsistency — wide spread between strongest and weakest domain
  const categoryEntries = Object.entries(accuracyByCategory || {});
  if (categoryEntries.length >= 2) {
    const sorted = [...categoryEntries].sort((a, b) => b[1] - a[1]);
    const [strongestCat, strongestAcc] = sorted[0];
    const [weakestCat, weakestAcc] = sorted[sorted.length - 1];
    const spread = strongestAcc - weakestAcc;

    if (spread >= 30) {
      return {
        type: 'category_inconsistency',
        headline: 'Your eye is uneven across domains.',
        body: `${formatCategoryLabel(strongestCat)} reads clearly to you. ${formatCategoryLabel(weakestCat)} is still developing.`,
      };
    }
  }

  // 5. Strong alignment with the panel overall
  if (overallAccuracy >= 80 && submissions.length >= 3) {
    return {
      type: 'accuracy_high',
      headline: 'You and this panel read interfaces the same way.',
      body: `Your verdict matched the panel's on ${overallAccuracy}% of cases with a verdict.`,
    };
  }

  // 6. Consistent divergence from the panel
  if (overallAccuracy <= 35 && submissions.length >= 3) {
    return {
      type: 'accuracy_low',
      headline: 'You and this panel are reading different things.',
      body: "That's not a failure — it's a data point about the lens you bring.",
    };
  }

  // 7. Single high-confidence submission — early signal
  if (highConfSubs.length === 1) {
    const wasRight = highConfCorrect === 1;
    return {
      type: 'calibration_early',
      headline: wasRight ? 'The panel agreed, and you were confident.' : 'You were confident, and the panel disagreed.',
      body: wasRight
        ? 'One data point. Worth watching as the investigation continues.'
        : "One case doesn't define your eye — but it's worth noting.",
    };
  }

  // 8. Default — patterns still forming
  return {
    type: 'forming',
    headline: 'Your Design Eye is forming.',
    body: `${submissions.length} ${submissions.length === 1 ? 'ruling' : 'rulings'} filed. Keep going — the lean shows up after a few more.`,
  };
}
