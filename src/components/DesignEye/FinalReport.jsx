import { CASES } from '../../data/cases'
import { generateFinalReportContent } from '../../utils/reportInsights'
import styles from './FinalReport.module.css'

const closedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export default function FinalReport({ profile, onRestart, onBack, isQuickPathComplete = false }) {
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

  const { opening, paragraphs, closingLine, question, total, rulingQuote, sealedRuling, lean } = content

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <span className={styles.docLabel}>Design Eye · Investigation Record</span>
          <span className={styles.docMeta}>
            {isQuickPathComplete ? 'Five-minute version complete' : total >= CASES.length - 1 ? 'Investigation complete' : `${total} rulings filed`} · {closedDate}
          </span>
        </header>

        {/* ── Lean card — the shareable summary. Not a grade: a mirror. ── */}
        <div className={styles.verdictCard}>
          <span className={styles.cardLabel}>Your Design Eye</span>
          {lean ? (
            <>
              <div className={styles.cardFigure}>
                <span className={styles.cardLensName}>{lean.strongest.title}</span>
              </div>
              <p className={styles.cardMeta}>
                {lean.balanced
                  ? `All five lenses entered the record equally across ${total} rulings.`
                  : `You marked ${lean.strongest.title.toLowerCase()} evidence in ${lean.strongest.count} cases. Least visible: ${lean.weakest.title}.`}
              </p>
            </>
          ) : (
            <p className={styles.cardMeta}>Not enough rulings yet to name a lean.</p>
          )}
        </div>

        <p className={styles.opening}>{opening}</p>

        <section className={styles.block}>
          {paragraphs.map((p, i) => (
            <p key={i} className={styles.prose}>{p}</p>
          ))}
        </section>

        {/* ── Quote-back — the record was listening ───────── */}
        {rulingQuote && (
          <>
            <div className={styles.rule} />
            <section className={styles.quoteBack}>
              <span className={styles.quoteLabel}>
                On {rulingQuote.caseNumber}, {rulingQuote.caseTitle}, you wrote
              </span>
              <blockquote className={styles.quote}>"{rulingQuote.text}"</blockquote>
              <p className={styles.quoteOutcome}>
                This is the evidence you chose to make visible.
              </p>
            </section>
          </>
        )}

        {/* ── Sealed ruling — the finale that stands alone ── */}
        {sealedRuling && (
          <>
            <div className={styles.rule} />
            <section className={styles.quoteBack}>
              <span className={styles.quoteLabel}>
                On {sealedRuling.caseNumber}, {sealedRuling.caseTitle}, the panel entered no verdict. You ruled
              </span>
              <blockquote className={styles.quote}>"{sealedRuling.text}"</blockquote>
              <p className={styles.quoteOutcome}>Yours is the only ruling on record.</p>
            </section>
          </>
        )}

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
          {isQuickPathComplete ? 'Quick path complete' : 'Investigation closed'} · {total} rulings filed · {closedDate}
        </p>

      </div>
    </div>
  )
}
