// Maps verdicts to normalised keys for comparison
const VERDICT_KEYS = {
  strong_design:    'strong_design',
  needs_revision:   'needs_revision',
  design_disaster:  'design_disaster',
};

// Maps confidence levels that count as "confident" for calibration
const HIGH_CONFIDENCE = new Set(['confident', 'very_confident']);

/**
 * Returns true if the user's submitted verdict matches the case official verdict.
 */
export function isVerdictCorrect(submittedVerdict, officialVerdict) {
  return VERDICT_KEYS[submittedVerdict] === VERDICT_KEYS[officialVerdict];
}

/**
 * Calculates overall accuracy across all submissions.
 * Returns a number 0–100.
 */
export function calculateAccuracy(submissions, cases) {
  // Sealed cases carry no panel verdict — they are excluded from accuracy entirely
  const scoreable = submissions.filter((sub) => {
    const caseData = cases.find((c) => c.id === sub.caseId);
    return caseData && caseData.officialVerdict;
  });
  if (scoreable.length === 0) return 0;

  const correct = scoreable.filter((sub) => {
    const caseData = cases.find((c) => c.id === sub.caseId);
    return isVerdictCorrect(sub.verdict, caseData.officialVerdict);
  });

  return Math.round((correct.length / scoreable.length) * 100);
}

/**
 * Calculates confidence calibration — the % of high-confidence submissions that were correct.
 * Returns null if the user has never submitted with high confidence.
 */
export function calculateConfidenceCalibration(submissions, cases) {
  const highConfidenceSubs = submissions.filter((sub) => {
    if (!HIGH_CONFIDENCE.has(sub.confidence)) return false;
    const caseData = cases.find((c) => c.id === sub.caseId);
    return caseData && caseData.officialVerdict;
  });

  if (highConfidenceSubs.length === 0) return null;

  const correct = highConfidenceSubs.filter((sub) => {
    const caseData = cases.find((c) => c.id === sub.caseId);
    return isVerdictCorrect(sub.verdict, caseData.officialVerdict);
  });

  return Math.round((correct.length / highConfidenceSubs.length) * 100);
}

/**
 * Calculates per-category accuracy.
 * Returns an object keyed by category name, value 0–100 or null if no submissions in category.
 */
export function calculateCategoryAccuracy(submissions, cases) {
  const byCategory = {};

  for (const sub of submissions) {
    const caseData = cases.find((c) => c.id === sub.caseId);
    if (!caseData || !caseData.officialVerdict) continue;

    const cat = caseData.category;
    if (!byCategory[cat]) {
      byCategory[cat] = { correct: 0, total: 0 };
    }

    byCategory[cat].total += 1;
    if (isVerdictCorrect(sub.verdict, caseData.officialVerdict)) {
      byCategory[cat].correct += 1;
    }
  }

  return Object.fromEntries(
    Object.entries(byCategory).map(([cat, { correct, total }]) => [
      cat,
      Math.round((correct / total) * 100),
    ])
  );
}

/**
 * Returns a proficiency label for a given accuracy percentage.
 */
export function proficiencyLabel(accuracy) {
  if (accuracy >= 90) return 'Excellent';
  if (accuracy >= 75) return 'Strong';
  if (accuracy >= 60) return 'Proficient';
  return 'Developing';
}

/**
 * Returns overconfidence risk level.
 * Compares overall accuracy vs confidence calibration.
 */
export function overconfidenceRisk(accuracy, calibration) {
  if (calibration === null) return null;
  const gap = calibration - accuracy;
  if (gap >= 20) return 'High';
  if (gap >= 10) return 'Moderate';
  return 'Low';
}
