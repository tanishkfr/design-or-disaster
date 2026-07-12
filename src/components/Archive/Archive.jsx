import { useState, useRef } from 'react'
import { useDesignEye } from '../../hooks/useDesignEye'
import { CASES } from '../../data/cases'
import ArchiveCard from './ArchiveCard'
import styles from './Archive.module.css'

function getCaseById(id) {
  return CASES.find(c => c.id === id) ?? null
}

export default function Archive({ onSelectCase, onDesignEye, onAbout, onReset }) {
  const { profile, hasSubmittedCase, getSubmission } = useDesignEye()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const confirmTimer = useRef(null)

  const handleResetClick = () => {
    if (confirmingReset) {
      clearTimeout(confirmTimer.current)
      setConfirmingReset(false)
      onReset()
    } else {
      setConfirmingReset(true)
      confirmTimer.current = setTimeout(() => setConfirmingReset(false), 3000)
    }
  }

  // The archive is organised as four movements. Each movement opens when the
  // previous one closes â€” the investigation escalates rather than browses.
  const byMovement = (m) => CASES.filter(c => c.movement === m)
  const movementComplete = (m) => byMovement(m).every(c => hasSubmittedCase(c.id))

  // Stats
  const totalCases = CASES.length
  const reviewedCount = CASES.filter(c => hasSubmittedCase(c.id)).length

  // Continue â€” in-progress case (set when user enters a case file)
  const inProgressCaseId = profile.inProgressCaseId ?? null
  const inProgressCase = inProgressCaseId ? getCaseById(inProgressCaseId) : null

  const sections = [
    {
      key: 'movement1',
      label: 'MOVEMENT I â€” THE CONSENSUS',
      cases: byMovement(1),
      locked: false,
      lockedLine: null,
    },
    {
      key: 'movement2',
      label: 'MOVEMENT II â€” THE DIVIDE',
      cases: byMovement(2),
      locked: !movementComplete(1),
      lockedLine: 'Opens when Movement I closes. This is where consensus stops being possible â€” and stops being the goal.',
    },
    {
      key: 'movement3',
      label: 'MOVEMENT III â€” THE LANDMARKS',
      cases: byMovement(3),
      locked: !movementComplete(2),
      lockedLine: 'Opens when Movement II closes. Cases with documented public consequences. Confidence is no longer self-reported.',
    },
    {
      key: 'finale',
      label: 'THE SEALED CASE',
      cases: byMovement(4),
      locked: !movementComplete(3),
      lockedLine: 'Opens when Movement III closes. On the final case, no panel verdict is entered.',
    },
  ]

  return (
    <div className={styles.root}>

      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className={styles.header}>
        <span className={styles.wordmark}>D/D</span>
        <div className={styles.headerRight}>
          <span className={styles.headerProgress}>{reviewedCount} / {totalCases}</span>
          <button className={styles.designEyeBtn} onClick={onAbout}>
            About
          </button>
          <button className={styles.designEyeBtn} onClick={onDesignEye}>
            Design Eye â–¸
          </button>
          <button
            className={`${styles.resetBtn} ${confirmingReset ? styles.resetBtnConfirm : ''}`}
            onClick={handleResetClick}
          >
            {confirmingReset ? 'Confirm?' : 'Reset'}
          </button>
        </div>
      </header>

      {/* â”€â”€ Archive intro â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className={styles.intro}>
        <h1 className={styles.archiveTitle}>Investigation Archive</h1>
        <p className={styles.subtitle}>
          Commit to a verdict before the experts disagree.<br />
          The point is not whether you were right. The point is which lens your judgment used.
        </p>
        <p className={styles.stats}>
          {totalCases} Cases in Four Movements
          {' Â· '}{reviewedCount} Closed
        </p>
      </div>

      {/* â”€â”€ Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className={styles.sections}>

        {/* Continue â€” only when Phase 4 sets an in-progress case */}
        {inProgressCase && (
          <section
            className={styles.section}
            style={{ animationDelay: '0ms' }}
          >
            <div className={styles.sectionHeader}>
              <span className={styles.sectionHeaderText}>â”€â”€ CONTINUE</span>
              <div className={styles.sectionHeaderRule} aria-hidden="true" />
            </div>
            <button
              className={styles.continueCard}
              onClick={() => onSelectCase(inProgressCase.id)}
            >
              <span className={styles.caseNumber}>{inProgressCase.number}</span>
              <span className={styles.continuePrompt}>
                Resume where you left off â†’
              </span>
            </button>
          </section>
        )}

        {/* Movement sections */}
        {sections.map(({ key, label, cases, locked, lockedLine }, idx) => {
          // If Continue is showing, stagger offset by 1
          const staggerIndex = inProgressCase ? idx + 1 : idx
          return (
            <section
              key={key}
              className={styles.section}
              style={{ animationDelay: `${staggerIndex * 80}ms` }}
            >
              <div className={styles.sectionHeader}>
                <span className={styles.sectionHeaderText}>â”€â”€ {label}</span>
                <div className={styles.sectionHeaderRule} aria-hidden="true" />
              </div>
              {locked ? (
                <p className={styles.lockedLine}>{lockedLine}</p>
              ) : (
                <div className={styles.cardGrid}>
                  {cases.map(c => (
                    <ArchiveCard
                      key={c.id}
                      caseData={c}
                      isReviewed={hasSubmittedCase(c.id)}
                      submission={getSubmission(c.id)}
                      onClick={() => onSelectCase(c.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}

      </div>

      <footer className={styles.footer}>
        <p className={styles.methodology}>
          <span className={styles.methodologyLabel}>â”€â”€ Methodology</span>
          The five jurors are authored voices, each holding one critical lens; their verdicts
          are one panel's position, not settled fact. No crowd telemetry or correctness score is implied. Screenshots are composites recreating documented
          interface patterns â€” no real product is depicted, and any resemblance is the
          pattern, not the brand.
        </p>
        <a
          href="https://github.com/tanishkfr/design-or-disaster"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          github.com/tanishkfr/design-or-disaster
        </a>
      </footer>

    </div>
  )
}
