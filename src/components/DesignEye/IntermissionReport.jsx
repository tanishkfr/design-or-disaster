import { useMemo } from 'react'
import styles from './IntermissionReport.module.css'
import { deriveLeadInsight } from '../../utils/reportInsights'

export default function IntermissionReport({ profile, onContinue }) {
  const insight = useMemo(() => deriveLeadInsight(profile), [profile])
  const lenses = useMemo(() => new Set((profile.submissions ?? []).flatMap((item) => item.evidenceTags ?? [])).size, [profile])
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.reportLabel}>Design Eye · Plate Note</span>
          <span className={styles.reportSub}>After {profile.casesCompleted} Cases</span>
        </div>
        <div className={styles.leadInsight}>
          <p className={styles.insightHeadline}>{insight.headline}</p>
          <p className={styles.insightBody}>{insight.body}</p>
        </div>
        <p className={styles.observation}>Your record currently uses {lenses} of five evidence lenses. This is a trace of attention, not a grade.</p>
        <button className={styles.continueBtn} onClick={onContinue}>Continue Investigation →</button>
      </div>
    </div>
  )
}
