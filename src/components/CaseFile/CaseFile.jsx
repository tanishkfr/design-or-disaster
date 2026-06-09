import { useState } from 'react'
import { getCaseById } from '../../data/cases'
import StatusTag from '../Archive/StatusTag'
import ScreenshotViewer from './ScreenshotViewer'
import SubmissionPanel from './SubmissionPanel'
import styles from './CaseFile.module.css'

function resolveStatus(caseData) {
  if (caseData.caseStatus === 'landmark') return 'landmark'
  if (caseData.caseStatus === 'contested') return 'contested'
  return 'pending'
}

export default function CaseFile({ caseId, onBack, onSubmit }) {
  const caseData = getCaseById(caseId)
  const [panelExiting, setPanelExiting] = useState(false)

  if (!caseData) {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorText}>Case not found.</p>
        <button className={styles.backBtn} onClick={onBack}>← Archive</button>
      </div>
    )
  }

  const handleSubmit = ({ verdict, evidenceTags, confidence }) => {
    setPanelExiting(true)
    // Panel slides out over 300ms, then notify parent
    setTimeout(() => {
      onSubmit({ caseId, verdict, evidenceTags, confidence })
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
          <ScreenshotViewer src={caseData.screenshot} />
          <div className={styles.caseIdentity}>
            <h1 className={styles.caseTitle}>{caseData.title}</h1>
            <p className={styles.caseContext}>{caseData.context}</p>
            {/* category intentionally withheld — revealed in verdict chamber */}
          </div>
        </div>

        {/* Right — submission panel, sticky */}
        <div className={styles.right}>
          <SubmissionPanel
            exiting={panelExiting}
            onSubmit={handleSubmit}
          />
        </div>

      </div>
    </div>
  )
}
