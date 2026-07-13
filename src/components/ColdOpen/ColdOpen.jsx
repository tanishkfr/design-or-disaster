import { useEffect, useRef, useState } from 'react'
import styles from './ColdOpen.module.css'
import { CASES } from '../../data/cases'
import EvidenceMap from '../CaseFile/EvidenceMap'

const VERDICTS = [
  { key: 'strong_design', label: 'Strong Design', color: 'var(--clear)' },
  { key: 'needs_revision', label: 'Needs Revision', color: 'var(--mixed)' },
  { key: 'design_disaster', label: 'Design Disaster', color: 'var(--guilty)' },
]

export default function ColdOpen({ onComplete }) {
  const [marks, setMarks] = useState([])
  const [writtenRuling, setWrittenRuling] = useState('')
  const [selectedVerdict, setSelectedVerdict] = useState(null)
  const [phase, setPhase] = useState('idle')
  const transitionTimers = useRef([])

  useEffect(() => () => transitionTimers.current.forEach(clearTimeout), [])

  const caseData = CASES[0]
  const evidenceReady = marks.length > 0 && marks.every((mark) => mark.note.trim())
  const ready = evidenceReady && writtenRuling.trim() && selectedVerdict && phase === 'idle'

  const handleSubmit = () => {
    if (!ready) return
    setPhase('fading')
    transitionTimers.current = [
      setTimeout(() => setPhase('interstitial'), 200),
      setTimeout(() => setPhase('interstitialOut'), 2600),
      setTimeout(() => onComplete({
        verdict: selectedVerdict,
        evidenceMap: marks,
        evidenceTags: [...new Set(marks.map((mark) => mark.lens))],
        writtenRuling: writtenRuling.trim(),
        timestamp: Date.now(),
      }), 2900),
    ]
  }

  return (
    <div className={styles.root}>
      <span className={styles.wordmark} aria-hidden="true">D/D</span>
      <header className={styles.projectHeader}>
        <span className={styles.projectLabel}>Start with the evidence.</span>
        <span className={styles.projectSub}>Case 001 ? Mark what matters before you decide</span>
      </header>

      <div className={styles.evidenceShell}>
        <EvidenceMap
          src={caseData.screenshot}
          aspectRatio={caseData.screenshotAspect ?? '4/3'}
          objectPosition={caseData.screenshotPosition ?? 'top center'}
          description={caseData.screenshotDescription}
          evidenceTargets={caseData.evidenceTargets}
          marks={marks}
          onChange={setMarks}
        />

        <label className={styles.rulingLabel}>
          <span>Your ruling</span>
          <textarea
            value={writtenRuling}
            onChange={(event) => setWrittenRuling(event.target.value)}
            placeholder="What does your evidence show?"
            maxLength={180}
            spellCheck
            className={styles.rulingInput}
          />
        </label>

        <div className={styles.verdictRow} role="group" aria-label="Verdict">
          {VERDICTS.map(({ key, label, color }) => (
            <button key={key} className={`${styles.verdictCard} ${selectedVerdict === key ? styles.verdictCardSelected : ''}`} style={selectedVerdict === key ? { '--vc': color } : undefined} onClick={() => setSelectedVerdict(key)} aria-pressed={selectedVerdict === key}>
              <span className={styles.verdictCardAccent} aria-hidden="true" />{label}
            </button>
          ))}
        </div>

        {!evidenceReady && <p className={styles.readiness}>Add at least one marker and describe what it shows.</p>}
        <button className={`${styles.submitBtn} ${ready ? styles.submitBtnActive : ''}`} onClick={handleSubmit} disabled={!ready}>Submit your verdict</button>
      </div>

      {(phase === 'interstitial' || phase === 'interstitialOut') && (
        <div className={`${styles.interstitial} ${phase === 'interstitialOut' ? styles.interstitialOut : styles.interstitialIn}`} aria-live="polite">
          <p>Your evidence is saved.</p>
          <p>Now see what the panel noticed.</p>
        </div>
      )}
    </div>
  )
}