import { useEffect, useRef, useState } from 'react'
import { getCaseById } from '../../data/cases'
import StatusTag from '../Archive/StatusTag'
import EvidencePlate from './EvidencePlate'
import SubmissionPanel from './SubmissionPanel'
import styles from './CaseFile.module.css'

function resolveStatus(caseData) {
  return caseData.caseStatus === 'sealed' ? 'sealed' : 'pending'
}

export default function CaseFile({ caseId, onBack, onSubmit }) {
  const caseData = getCaseById(caseId)
  const [panelExiting, setPanelExiting] = useState(false)
  const [evidencePlate, setEvidencePlate] = useState([])
  const openedAt = useRef(null)
  const submitTimer = useRef(null)

  useEffect(() => {
    openedAt.current = Date.now()
    return () => clearTimeout(submitTimer.current)
  }, [])

  if (!caseData) {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorText}>Case not found.</p>
        <button className={styles.backBtn} onClick={onBack}>← Archive</button>
      </div>
    )
  }

  const plateReady = evidencePlate.length > 0 && evidencePlate.every((mark) => mark.note.trim())

  function handleSubmit({ verdict, confidence, writtenRuling }) {
    setPanelExiting(true)
    const elapsedMs = openedAt.current ? Date.now() - openedAt.current : 0
    submitTimer.current = setTimeout(() => {
      onSubmit({
        caseId,
        verdict,
        evidencePlate,
        evidenceTags: [...new Set(evidencePlate.map((mark) => mark.lens))],
        confidence,
        confidenceInferred: false,
        elapsedMs,
        writtenRuling,
      })
    }, 300)
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Return to archive">← Archive</button>
        <span className={styles.headerCaseNumber}>{caseData.number}</span>
        <StatusTag status={resolveStatus(caseData)} />
      </header>

      <div className={styles.body}>
        <div className={styles.left}>
          <EvidencePlate
            src={caseData.screenshot}
            aspectRatio={caseData.screenshotAspect ?? '4/3'}
            objectPosition={caseData.screenshotPosition ?? 'top center'}
            description={caseData.screenshotDescription}
            evidenceTargets={caseData.evidenceTargets}
            marks={evidencePlate}
            onChange={setEvidencePlate}
          />
          <div className={styles.caseIdentity}>
            <h1 className={styles.caseTitle}>{caseData.title}</h1>
            <p className={styles.caseContext}>{caseData.context}</p>
          </div>
        </div>

        <div className={styles.right}>
          <SubmissionPanel
            exiting={panelExiting}
            onSubmit={handleSubmit}
            plateReady={plateReady}
            plateCount={evidencePlate.length}
          />
        </div>
      </div>
    </div>
  )
}
