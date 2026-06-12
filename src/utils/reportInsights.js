const HIGH_CONFIDENCE = new Set(['confident', 'very_confident']);

/**
 * Generates the full body of the Investigation Record report from real profile data.
 * Returns { opening, paragraphs, closingLine, question, total, correctCount }
 * or null if no submissions exist.
 */
export function generateFinalReportContent(profile, cases) {
  const subs = profile?.submissions ?? []
  const total = subs.length
  if (total === 0) return null

  const results = subs.map(s => {
    const c = cases.find(c => c.id === s.caseId)
    if (!c) return null
    const confRank = { guessing: 1, somewhat_sure: 2, confident: 3, very_confident: 4 }[s.confidence] ?? 0
    return { sub: s, case: c, correct: s.verdict === c.officialVerdict, confRank }
  }).filter(Boolean)

  const correctCount = results.filter(r => r.correct).length
  const accuracy = Math.round((correctCount / total) * 100)

  const highConf = results.filter(r => r.confRank >= 3)
  const lowConf  = results.filter(r => r.confRank <= 2)
  const highConfCorrect = highConf.filter(r => r.correct).length
  const lowConfCorrect  = lowConf.filter(r => r.correct).length
  const highConfAcc = highConf.length > 0 ? Math.round((highConfCorrect / highConf.length) * 100) : null
  const lowConfAcc  = lowConf.length  > 0 ? Math.round((lowConfCorrect  / lowConf.length)  * 100) : null

  const contested        = results.filter(r => r.case.caseStatus === 'contested')
  const contestedCorrect = contested.filter(r => r.correct).length
  const guiltyCount      = results.filter(r => r.sub.verdict !== 'strong_design').length

  // Primary insight pattern
  let pattern = 'neutral'
  if      (highConf.length >= 2 && highConfAcc < 50)                                                              pattern = 'overconfident'
  else if (highConf.length >= 2 && highConfAcc >= 80 && lowConfAcc !== null && lowConfAcc < highConfAcc - 15)     pattern = 'calibrated'
  else if (lowConf.length  >= 3 && lowConfAcc  >= 65 && (highConfAcc === null || lowConfAcc > highConfAcc + 10))  pattern = 'underconfident'
  else if (accuracy >= 80 && total >= 5)                                                                           pattern = 'accurate'
  else if (accuracy <= 35 && total >= 5)                                                                           pattern = 'divergent'

  const opening = `You called ${correctCount} of ${total} cases correctly — ${accuracy}% alignment with jury consensus.`
  const paragraphs = []

  // P1 — confidence pattern
  if (pattern === 'overconfident') {
    const wrongHighConf = results.filter(r => !r.correct && r.confRank >= 3).sort((a, b) => b.confRank - a.confRank)
    paragraphs.push(
      `The investigation records a consistent pattern. You filed high confidence on ${highConf.length} cases. You were right ${highConfCorrect} ${highConfCorrect === 1 ? 'time' : 'times'} — ${highConfAcc}% of the cases you were certain about. On the cases where you filed lower confidence, your accuracy was ${lowConfAcc !== null ? lowConfAcc + '%' : 'comparable'}. Your confidence was not tracking your accuracy.`
    )
    if (wrongHighConf[0]) {
      paragraphs.push(
        `The clearest example is ${wrongHighConf[0].case.title}. You filed confident or very confident. The jury ruled against you. The confidence was not a product of the evidence — it was a position taken before the evidence had been examined fully.`
      )
    }
  } else if (pattern === 'underconfident') {
    paragraphs.push(
      `The gap between what was noticed and what was claimed ran in one direction throughout this investigation. You filed low confidence on ${lowConf.length} cases and were right ${lowConfCorrect} times — ${lowConfAcc}% accuracy at low conviction. You filed high confidence on ${highConf.length} cases and were right ${highConfCorrect} times. What was noticed before the ruling appeared was frequently correct. The certainty attached to it was not.`
    )
    paragraphs.push(
      `This is not an accuracy problem. The verdicts were right more often than the confidence suggested they would be. Evidence was found and correctly read, and then qualified. The investigation records the qualification without being able to explain it.`
    )
  } else if (pattern === 'calibrated') {
    paragraphs.push(
      `When you committed to a verdict, you were right. ${highConfCorrect} of ${highConf.length} high-confidence rulings aligned with jury consensus — ${highConfAcc}%. When you were uncertain, the uncertainty was warranted: ${lowConfAcc}% accuracy on low-confidence filings. The confidence was tracking the evidence rather than the investigator's comfort.`
    )
    paragraphs.push(
      `This kind of calibration is rarer than it sounds. Most investigators in this archive show a consistent gap in one direction — either filing confidence the accuracy doesn't support, or finding evidence and declining to claim it. Neither pattern is present here.`
    )
  } else if (pattern === 'accurate') {
    paragraphs.push(
      `${accuracy}% accuracy across ${total} cases represents close alignment with expert consensus. On the cases where your verdict diverged from the jury's, the divergence was concentrated in the contested ones — the cases where the jury itself was divided. On the cases where the jury reached consensus, your judgment tracked it closely.`
    )
  } else if (pattern === 'divergent') {
    paragraphs.push(
      `Expert consensus and your verdicts diverged on ${total - correctCount} of ${total} cases. This is not necessarily a failure of judgment — it may be a consistently different perspective. The archive records that the divergence is consistent, and consistent divergence is data.`
    )
  } else {
    const confLine = [
      highConfAcc !== null ? `${highConfAcc}% accuracy on high-confidence filings` : null,
      lowConfAcc  !== null ? `${lowConfAcc}% on lower-confidence ones`             : null,
    ].filter(Boolean).join(', ')
    paragraphs.push(
      `Across ${total} cases, you filed ${highConf.length} high-confidence verdicts and ${lowConf.length} at lower conviction.${confLine ? ' ' + confLine + '.' : ''} No dominant signal emerged from the confidence distribution.`
    )
  }

  // P2 — contested performance (always included when contested cases were reviewed)
  if (contested.length > 0) {
    const line = contestedCorrect === contested.length
      ? `You called all ${contested.length} contested cases correctly.`
      : contestedCorrect === 0
      ? `You called none of the ${contested.length} contested cases correctly.`
      : `You called ${contestedCorrect} of ${contested.length} contested cases correctly.`

    paragraphs.push(
      `${line} Contested cases are the ones where the jury explicitly divided — where both positions had merit and the majority held a considered position, not a consensus. They require holding two arguments simultaneously rather than resolving the tension into a clean verdict. ${contestedCorrect >= Math.ceil(contested.length / 2) ? 'You held that tension and came through.' : 'The tension resolved differently than the jury held it.'}`
    )
  }

  // P3 — lean observation, only when pronounced
  if (guiltyCount >= total * 0.75) {
    paragraphs.push(
      `You filed ${guiltyCount} critical verdicts out of ${total} — a skeptic's record. The designs that passed your review were in the minority. This is a valid orientation, and the accuracy rate suggests it is not reflexive: the problems found were real problems.`
    )
  } else if ((total - guiltyCount) >= total * 0.75) {
    paragraphs.push(
      `You defended ${total - guiltyCount} of ${total} designs — a generous read of the archive. The cases are weighted toward failure; a high clean-verdict rate means you found merit where jury consensus often did not.`
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
    closingLine = 'The record shows close alignment with expert consensus.'
    question    = 'Are you right because you see clearly, or because you read the room?'
  } else if (pattern === 'divergent') {
    closingLine = 'The record shows consistent divergence from expert consensus.'
    question    = 'Consistent divergence is data. The question is what it describes.'
  } else if (contested.length > 0 && contestedCorrect === contested.length) {
    closingLine = 'The record shows what was found on the difficult cases.'
    question    = "You held your position when the jury split. Most don't."
  }

  return { opening, paragraphs, closingLine, question, total, correctCount }
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
      `${formatCategoryLabel(cat)} is the only category assessed so far — ${caseCount} ${caseCount === 1 ? 'case' : 'cases'}, ${acc}% alignment with the jury.`
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

  // Reckoning case: find the case the user was most confidently wrong about
  const highConfWrong = (submissions || []).filter(s => {
    if (!HIGH_CONFIDENCE.has(s.confidence)) return false;
    const c = cases.find(c => c.id === s.caseId);
    return c && s.verdict !== c.officialVerdict;
  });

  if (highConfWrong.length > 0) {
    const reckoningCase = cases.find(c => c.id === highConfWrong[0].caseId);
    if (reckoningCase) {
      observations.push(
        `You were most confident on ${reckoningCase.title}. The jury ruled against you.`
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
 * Priority: overconfidence > good calibration > category spread > accuracy extremes > default.
 * Returns { type, headline, body }
 */
export function deriveLeadInsight(profile, cases) {
  const { submissions, overallAccuracy, accuracyByCategory } = profile;

  if (!submissions || submissions.length === 0) {
    return {
      type: 'empty',
      headline: 'No cases reviewed yet.',
      body: 'Begin an investigation to start building your Design Eye profile.',
    };
  }

  const highConfSubs = submissions.filter(s => HIGH_CONFIDENCE.has(s.confidence));
  const highConfCorrect = highConfSubs.filter(s => {
    const c = cases.find(c => c.id === s.caseId);
    return c && s.verdict === c.officialVerdict;
  }).length;

  // 1. Overconfidence — confident but wrong more often than not
  if (highConfSubs.length >= 2) {
    const highConfRate = Math.round((highConfCorrect / highConfSubs.length) * 100);

    if (highConfRate < 50) {
      return {
        type: 'overconfident',
        headline: 'Your certainty outpaced your accuracy.',
        body: `You were confident ${highConfSubs.length} ${highConfSubs.length === 1 ? 'time' : 'times'}. You were right ${highConfCorrect === 1 ? 'once' : `${highConfCorrect} times`}.`,
      };
    }

    // 2. Well calibrated — right when it counted
    if (highConfRate >= 80) {
      return {
        type: 'calibrated',
        headline: 'You were right when it mattered.',
        body: highConfCorrect === highConfSubs.length
          ? `You were right every time you were confident.`
          : `When you committed to a verdict, you were correct ${highConfCorrect === 1 ? 'once' : `${highConfCorrect} times`} out of ${highConfSubs.length}.`,
      };
    }
  }

  // 3. Category inconsistency — wide spread between strongest and weakest
  const categoryEntries = Object.entries(accuracyByCategory || {});
  if (categoryEntries.length >= 2) {
    const sorted = [...categoryEntries].sort((a, b) => b[1] - a[1]);
    const [strongestCat, strongestAcc] = sorted[0];
    const [weakestCat, weakestAcc] = sorted[sorted.length - 1];
    const spread = strongestAcc - weakestAcc;

    if (spread >= 30) {
      return {
        type: 'category_inconsistency',
        headline: 'Your eye is uneven.',
        body: `${formatCategoryLabel(strongestCat)} reads clearly to you. ${formatCategoryLabel(weakestCat)} is still developing.`,
      };
    }
  }

  // 4. High accuracy
  if (overallAccuracy >= 80 && submissions.length >= 3) {
    return {
      type: 'accuracy_high',
      headline: 'Your judgment aligns closely with expert consensus.',
      body: `You called ${overallAccuracy}% of cases the way the jury ruled.`,
    };
  }

  // 5. Low accuracy — cases pushing back
  if (overallAccuracy <= 35 && submissions.length >= 3) {
    return {
      type: 'accuracy_low',
      headline: 'The cases are pushing back.',
      body: 'Expert consensus differed from your judgment in most of the cases reviewed so far.',
    };
  }

  // 6. Single high-confidence submission — early signal
  if (highConfSubs.length === 1) {
    const wasRight = highConfCorrect === 1;
    return {
      type: 'calibration_early',
      headline: wasRight ? 'You were right when confident.' : 'You were confident, but wrong.',
      body: wasRight
        ? 'One data point. Worth watching as the investigation continues.'
        : "One case doesn't define your eye — but it's worth noting.",
    };
  }

  // 7. Default — patterns still forming
  return {
    type: 'forming',
    headline: 'Your Design Eye is forming.',
    body: `${submissions.length} case${submissions.length === 1 ? '' : 's'} reviewed. Continue to build a clearer picture.`,
  };
}
