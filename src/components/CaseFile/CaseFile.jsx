import { useState, useRef } from 'react'
import { getCaseById } from '../../data/cases'
import StatusTag from '../Archive/StatusTag'
import ScreenshotViewer from './ScreenshotViewer'
import SubmissionPanel from './SubmissionPanel'
import styles from './CaseFile.module.css'

function resolveStatus(caseData) {
  if (caseData.caseStatus === 'landmark') return 'landmark'
  if (caseData.caseStatus === 'contested') return 'contested'
  if (caseData.caseStatus === 'sealed') return 'sealed'
  return 'pending'
}

// Movement III onward: confidence is read from the clock, not self-reported.
// Committing fast is conviction; a long deliberation is its own notation.
function inferConfidenceFromTime(elapsedMs) {
  if (elapsedMs < 30_000)  return 'very_confident'
  if (elapsedMs < 75_000)  return 'confident'
  if (elapsedMs < 180_000) return 'somewhat_sure'
  return 'guessing'
}

export default function CaseFile({ caseId, onBack, onSubmit }) {
  const caseData = getCaseById(caseId)
  const [panelExiting, setPanelExiting] = useState(false)
  const openedAt = useRef(Date.now())

  if (!caseData) {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorText}>Case not found.</p>
        <button className={styles.backBtn} onClick={onBack}>← Archive</button>
      </div>
    )
  }

  const inferConfidence = (caseData?.movement ?? 1) >= 3

  const handleSubmit = ({ verdict, evidenceTags, confidence, writtenRuling }) => {
    setPanelExiting(true)
    const elapsedMs = Date.now() - openedAt.current
    const finalConfidence = inferConfidence ? inferConfidenceFromTime(elapsedMs) : confidence
    // Panel slides out over 300ms, then notify parent
    setTimeout(() => {
      onSubmit({
        caseId,
        verdict,
        evidenceTags,
        confidence: finalConfidence,
        confidenceInferred: inferConfidence,
        elapsedMs,
        writtenRuling,
      })
    }, 300)
  }

  return (
    <div className={styles.root}>

      {/* ── Header ───────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Return to archive">
          ← Archive
        </button>
        <span className={styles.headerCaseNumber}>{caseData.number}</span>
        <StatusTag status={resolveStatus(caseData)} />
      </header>

      {/* ── Two-column body ───────────────────────────── */}
      <div className={styles.body}>

        {/* Left — evidence: screenshot + case identity */}
        <div className={styles.left}>
          <ScreenshotViewer
            src={caseData.screenshot}
            aspectRatio={caseData.screenshotAspect ?? '4/3'}
          />
          <div className={styles.caseIdentity}>
            <h1 className={styles.caseTitle}>{caseData.title}</h1>
            <p className={styles.caseContext}>{caseData.context}</p>
            {/* category intentionally withheld — revealed in verdict chamber */}
          </div>
          {caseData.curatorNote && (
            <div className={styles.curatorNote}>
              <span className={styles.curatorNoteLabel}>── Case Note</span>
              <p className={styles.curatorNoteText}>{caseData.curatorNote}</p>
            </div>
          )}
        </div>

        {/* Right — submission panel, sticky */}
        <div className={styles.right}>
          <SubmissionPanel
            exiting={panelExiting}
            onSubmit={handleSubmit}
            inferConfidence={inferConfidence}
          />
        </div>

      </div>
    </div>
  )
}
