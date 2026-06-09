import StatusTag from './StatusTag'
import styles from './ArchiveCard.module.css'

function resolveStatus(caseData, isReviewed) {
  if (caseData.caseStatus === 'landmark') return 'landmark'
  if (caseData.caseStatus === 'contested') return 'contested'
  if (isReviewed) return 'resolved'
  return 'pending'
}

export default function ArchiveCard({ caseData, isReviewed, onClick }) {
  const status = resolveStatus(caseData, isReviewed)

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
    </button>
  )
}
