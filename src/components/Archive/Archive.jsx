import { useState, useRef } from 'react'
import { useDesignEye } from '../../hooks/useDesignEye'
import { CASES } from '../../data/cases'
import ArchiveCard from './ArchiveCard'
import styles from './Archive.module.css'

function getCaseById(id) {
  return CASES.find(c => c.id === id) ?? null
}

export default function Archive({ onSelectCase, onDesignEye, onReset }) {
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
  // previous one closes — the investigation escalates rather than browses.
  const byMovement = (m) => CASES.filter(c => c.movement === m)
  const movementComplete = (m) => byMovement(m).every(c => hasSubmittedCase(c.id))

  // Stats
  const totalCases = CASES.length
  const reviewedCount = CASES.filter(c => hasSubmittedCase(c.id)).length

  // Continue — in-progress case (set when user enters a case file)
  const inProgressCaseId = profile.inProgressCaseId ?? null
  const inProgressCase = inProgressCaseId ? getCaseById(inProgressCaseId) : null

  const sections = [
    {
      key: 'movement1',
      label: 'MOVEMENT I — THE CONSENSUS',
      cases: byMovement(1),
      locked: false,
      lockedLine: null,
    },
    {
      key: 'movement2',
      label: 'MOVEMENT II — THE DIVIDE',
      cases: byMovement(2),
      locked: !movementComplete(1),
      lockedLine: 'Opens when Movement I closes. The jury stops agreeing here.',
    },
    {
      key: 'movement3',
      label: 'MOVEMENT III — THE LANDMARKS',
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

      {/* ── Header ───────────────────────────────────── */}
      <header className={styles.header}>
        <span className={styles.wordmark}>D/D</span>
        <div className={styles.headerRight}>
          <span className={styles.headerProgress}>{reviewedCount} / {totalCases}</span>
          <button className={styles.designEyeBtn} onClick={onDesignEye}>
            Design Eye ▸
          </button>
          <button
            className={`${styles.resetBtn} ${confirmingReset ? styles.resetBtnConfirm : ''}`}
            onClick={handleResetClick}
          >
            {confirmingReset ? 'Confirm?' : 'Reset'}
          </button>
        </div>
      </header>

      {/* ── Archive intro ─────────────────────────────── */}
      <div className={styles.intro}>
        <h1 className={styles.archiveTitle}>Investigation Archive</h1>
        <p className={styles.subtitle}>
          Composite cases built from documented interface patterns.<br />
          Each argued by a panel of five jurors.
        </p>
        <p className={styles.stats}>
          {totalCases} Cases in Four Movements
          {' · '}{reviewedCount} Closed
        </p>
      </div>

      {/* ── Sections ──────────────────────────────────── */}
      <div className={styles.sections}>

        {/* Continue — only when Phase 4 sets an in-progress case */}
        {inProgressCase && (
          <section
            className={styles.section}
            style={{ animationDelay: '0ms' }}
          >
            <div className={styles.sectionHeader}>
              <span className={styles.sectionHeaderText}>── CONTINUE</span>
              <div className={styles.sectionHeaderRule} aria-hidden="true" />
            </div>
            <button
              className={styles.continueCard}
              onClick={() => onSelectCase(inProgressCase.id)}
            >
              <span className={styles.caseNumber}>{inProgressCase.number}</span>
              <span className={styles.continuePrompt}>
                Resume where you left off →
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
                <span className={styles.sectionHeaderText}>── {label}</span>
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
          <span className={styles.methodologyLabel}>── Methodology</span>
          The five jurors are authored voices, each holding one critical lens; their verdicts
          are one panel's position, not settled fact. Verdict distributions are seeded
          projections, not live telemetry. Screenshots are composites recreating documented
          interface patterns — no real product is depicted, and any resemblance is the
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
