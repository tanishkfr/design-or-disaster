import { useMemo } from 'react';
import styles from './IntermissionReport.module.css';
import { deriveLeadInsight, deriveCategoryObservations } from '../../utils/reportInsights';
import { CASES } from '../../data/cases';

const HIGH_CONFIDENCE = new Set(['confident', 'very_confident']);

export default function IntermissionReport({ profile, onContinue }) {
  const insight = useMemo(() => deriveLeadInsight(profile, CASES), [profile]);

  const secondaryObservation = useMemo(() => {
    const { submissions = [], accuracyByCategory = {} } = profile;

    // Try category observations first
    const catObs = deriveCategoryObservations(accuracyByCategory, submissions, CASES);
    // Use first category observation only if it doesn't duplicate the lead insight
    const catLine = catObs[0];
    const leadCoversCategory =
      insight.type === 'category_inconsistency';

    if (catLine && !leadCoversCategory) return catLine;

    // Fall back to confidence observation if not already the lead
    const leadCoversConfidence =
      insight.type === 'overconfident' ||
      insight.type === 'calibrated' ||
      insight.type === 'calibration_early';

    if (!leadCoversConfidence) {
      const highConfSubs = submissions.filter(s => HIGH_CONFIDENCE.has(s.confidence));
      if (highConfSubs.length > 0) {
        const highConfCorrect = highConfSubs.filter(s => {
          const c = CASES.find(c => c.id === s.caseId);
          return c && s.verdict === c.officialVerdict;
        }).length;
        return `You committed strongly ${highConfSubs.length} ${highConfSubs.length === 1 ? 'time' : 'times'}. You were right ${highConfCorrect === 1 ? 'once' : `${highConfCorrect} times`}.`;
      }
    }

    return null;
  }, [profile, insight]);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>

        <div className={styles.header}>
          <span className={styles.reportLabel}>Design Eye · Note</span>
          <span className={styles.reportSub}>After {profile.casesCompleted} Cases</span>
        </div>

        <div className={styles.leadInsight}>
          <p className={styles.insightHeadline}>{insight.headline}</p>
          <p className={styles.insightBody}>{insight.body}</p>
        </div>

        {secondaryObservation && (
          <p className={styles.observation}>{secondaryObservation}</p>
        )}

        <button className={styles.continueBtn} onClick={onContinue}>
          Continue Investigation →
        </button>

      </div>
    </div>
  );
}
