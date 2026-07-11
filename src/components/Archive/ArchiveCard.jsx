import StatusTag from './StatusTag'
import styles from './ArchiveCard.module.css'

function resolveStatus(caseData, isReviewed) {
  if (caseData.caseStatus === 'sealed') return 'sealed'
  if (caseData.caseStatus === 'landmark') return 'landmark'
  if (caseData.caseStatus === 'contested') return 'contested'
  if (isReviewed) return 'resolved'
  return 'pending'
}

const VERDICT_SHORT = {
  strong_design:   'You ruled: Strong Design',
  needs_revision:  'You ruled: Needs Revision',
  design_disaster: 'You ruled: Design Disaster',
}

export default function ArchiveCard({ caseData, isReviewed, submission, onClick }) {
  const status = resolveStatus(caseData, isReviewed)
  const ruledLine = isReviewed && submission ? VERDICT_SHORT[submission.verdict] : null

  return (
    <button
      className={[
        styles.card,
        styles[status],
        isReviewed ? styles.reviewed : '',
      ].filter(Boolean).join(' ')}
      style={
        isReviewed && caseData.screenshot
          ? { '--screenshot': `url(${caseData.screenshot})` }
          : undefined
      }
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={styles.caseNumber}>{caseData.number}</span>
        <StatusTag status={status} />
      </div>
      <p className={styles.title}>{caseData.title}</p>
      <p className={styles.context}>{caseData.context}</p>
      {ruledLine && <p className={styles.ruledLine}>{ruledLine}</p>}
    </button>
  )
}
