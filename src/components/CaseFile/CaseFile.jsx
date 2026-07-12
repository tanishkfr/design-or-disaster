import { useEffect, useRef, useState } from 'react'
import { getCaseById } from '../../data/cases'
import StatusTag from '../Archive/StatusTag'
import EvidencePlate from './EvidencePlate'
import SubmissionPanel from './SubmissionPanel'
import styles from './CaseFile.module.css'

function resolveStatus(caseData) {
  if (caseData.caseStatus === 'landmark') return 'landmark'
  if (caseData.caseStatus === 'contested') return 'contested'
  if (caseData.caseStatus === 'sealed') return 'sealed'
  return 'pending'
}

function inferConfidenceFromTime(elapsedMs) {
  if (elapsedMs < 30_000) return 'very_confident'
  if (elapsedMs < 75_000) return 'confident'
  if (elapsedMs < 180_000) return 'somewhat_sure'
  return 'guessing'
}

export default function CaseFile({ caseId, onBack, onSubmit }) {
  const caseData = getCaseById(caseId)
  const [panelExiting, setPanelExiting] = useState(false)
  const [evidencePlate, setEvidencePlate] = useState([])
  const openedAt = useRef(null)

  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  if (!caseData) {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorText}>Case not found.</p>
        <button className={styles.backBtn} onClick={onBack}>← Archive</button>
      </div>
    )
  }

  const inferConfidence = (caseData.movement ?? 1) >= 3
  const plateReady = evidencePlate.length > 0 && evidencePlate.every((mark) => mark.note.trim())

  function handleSubmit({ verdict, confidence, writtenRuling }) {
    setPanelExiting(true)
    const elapsedMs = openedAt.current ? Date.now() - openedAt.current : 0
    const finalConfidence = inferConfidence ? inferConfidenceFromTime(elapsedMs) : confidence
    setTimeout(() => {
      onSubmit({
        caseId,
        verdict,
        evidencePlate,
        evidenceTags: [...new Set(evidencePlate.map((mark) => mark.lens))],
        confidence: finalConfidence,
        confidenceInferred: inferConfidence,
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
            marks={evidencePlate}
            onChange={setEvidencePlate}
          />
          <div className={styles.caseIdentity}>
            <h1 className={styles.caseTitle}>{caseData.title}</h1>
            <p className={styles.caseContext}>{caseData.context}</p>
          </div>
          {caseData.curatorNote && (
            <div className={styles.curatorNote}>
              <span className={styles.curatorNoteLabel}>—— Case note</span>
              <p className={styles.curatorNoteText}>{caseData.curatorNote}</p>
            </div>
          )}
        </div>

        <div className={styles.right}>
          <SubmissionPanel
            exiting={panelExiting}
            onSubmit={handleSubmit}
            inferConfidence={inferConfidence}
            plateReady={plateReady}
            plateCount={evidencePlate.length}
          />
        </div>
      </div>
    </div>
  )
}
