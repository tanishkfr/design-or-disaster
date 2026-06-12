import { CASES } from '../../data/cases'
import { generateFinalReportContent } from '../../utils/reportInsights'
import styles from './FinalReport.module.css'

const closedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export default function FinalReport({ profile, onRestart, onBack }) {
  const content = profile ? generateFinalReportContent(profile, CASES) : null

  // Fallback prose for zero-submission edge case
  if (!content) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <span className={styles.docLabel}>Design Eye · Investigation Record</span>
            <span className={styles.docMeta}>No cases reviewed</span>
          </header>
          <p className={styles.opening}>No cases have been reviewed yet.</p>
          <section className={`${styles.block} ${styles.closing}`}>
            <p className={styles.closingLine}>The record is empty.</p>
            <p className={styles.question}>Return to the archive to begin an investigation.</p>
          </section>
          <div className={styles.actions}>
            <button className={styles.backBtn} onClick={onBack}>← Archive</button>
          </div>
        </div>
      </div>
    )
  }

  const { opening, paragraphs, closingLine, question, total, correctCount } = content

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <span className={styles.docLabel}>Design Eye · Investigation Record</span>
          <span className={styles.docMeta}>
            {total === 15 ? 'Investigation Complete' : `${total} of 15 Cases`} · {correctCount} correct
          </span>
        </header>

        <p className={styles.opening}>{opening}</p>

        <section className={styles.block}>
          {paragraphs.map((p, i) => (
            <p key={i} className={styles.prose}>{p}</p>
          ))}
        </section>

        <div className={styles.rule} />

        <section className={`${styles.block} ${styles.closing}`}>
          <p className={styles.closingLine}>{closingLine}</p>
          <p className={styles.question}>{question}</p>
        </section>

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Archive
          </button>
          <button className={styles.restartBtn} onClick={onRestart}>
            Restart Investigation
          </button>
        </div>

        <p className={styles.stamp}>
          Investigation closed · {total} {total === 1 ? 'case' : 'cases'} · {closedDate}
        </p>

      </div>
    </div>
  )
}
