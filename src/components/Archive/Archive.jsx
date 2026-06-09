import { useDesignEye } from '../../hooks/useDesignEye'
import { CASES } from '../../data/cases'
import ArchiveCard from './ArchiveCard'
import styles from './Archive.module.css'

function getCaseById(id) {
  return CASES.find(c => c.id === id) ?? null
}

export default function Archive({ onSelectCase, onDesignEye }) {
  const { profile, hasSubmittedCase } = useDesignEye()

  // Curated section order:
  // Landmark cases are always surfaced first — editorially significant regardless of review state
  // Contested always second — the jury split is permanently interesting
  // Pending — unreviewed cases that are neither landmark nor contested
  // Reviewed — completed cases, muted, screenshot background

  const landmarkCases = CASES.filter(c => c.caseStatus === 'landmark')
  const contestedCases = CASES.filter(c => c.caseStatus === 'contested')
  const pendingCases = CASES.filter(
    c => c.caseStatus !== 'landmark' && c.caseStatus !== 'contested' && !hasSubmittedCase(c.id)
  )
  const reviewedCases = CASES.filter(
    c => c.caseStatus !== 'landmark' && c.caseStatus !== 'contested' && hasSubmittedCase(c.id)
  )

  // Stats
  const totalCases = CASES.length
  const reviewedCount = CASES.filter(c => hasSubmittedCase(c.id)).length
  const contestedCount = CASES.filter(c => c.caseStatus === 'contested').length

  // Continue — in-progress case (set by Phase 4 when user enters a case file)
  const inProgressCaseId = profile.inProgressCaseId ?? null
  const inProgressCase = inProgressCaseId ? getCaseById(inProgressCaseId) : null

  // Build section list — only include non-empty sections
  const sections = [
    landmarkCases.length > 0 && {
      key: 'landmark',
      label: 'LANDMARK CASES',
      cases: landmarkCases,
      grid: 'landmark',
    },
    contestedCases.length > 0 && {
      key: 'contested',
      label: 'CONTESTED',
      cases: contestedCases,
      grid: 'default',
    },
    pendingCases.length > 0 && {
      key: 'pending',
      label: 'PENDING INVESTIGATIONS',
      cases: pendingCases,
      grid: 'default',
    },
    reviewedCases.length > 0 && {
      key: 'reviewed',
      label: 'CLOSED CASES',
      cases: reviewedCases,
      grid: 'default',
    },
  ].filter(Boolean)

  return (
    <div className={styles.root}>

      {/* ── Header ───────────────────────────────────── */}
      <header className={styles.header}>
        <span className={styles.wordmark}>D/D</span>
        <button className={styles.designEyeBtn} onClick={onDesignEye}>
          Design Eye ▸
        </button>
      </header>

      {/* ── Archive intro ─────────────────────────────── */}
      <div className={styles.intro}>
        <h1 className={styles.archiveTitle}>Investigation Archive</h1>
        <p className={styles.subtitle}>
          Design cases drawn from production interfaces.<br />
          Each reviewed by a panel of five jurors.
        </p>
        <p className={styles.stats}>
          {totalCases} {totalCases === 1 ? 'Case' : 'Cases'}
          {' · '}{reviewedCount} Reviewed
          {' · '}{contestedCount} Contested
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

        {/* Curated sections */}
        {sections.map(({ key, label, cases, grid }, idx) => {
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
              <div className={`${styles.cardGrid} ${grid === 'landmark' ? styles.cardGridLandmark : ''}`}>
                {cases.map(c => (
                  <ArchiveCard
                    key={c.id}
                    caseData={c}
                    isReviewed={hasSubmittedCase(c.id)}
                    onClick={() => onSelectCase(c.id)}
                  />
                ))}
              </div>
            </section>
          )
        })}

      </div>
    </div>
  )
}
