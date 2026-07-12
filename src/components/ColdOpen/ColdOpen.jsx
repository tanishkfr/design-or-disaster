import { useState } from 'react'
import styles from './ColdOpen.module.css'
import { CASES } from '../../data/cases'
import EvidencePlate from '../CaseFile/EvidencePlate'

const VERDICTS = [
  { key: 'strong_design', label: 'Strong Design' },
  { key: 'needs_revision', label: 'Needs Revision' },
  { key: 'design_disaster', label: 'Design Disaster' },
]

export default function ColdOpen({ onComplete }) {
  const [marks, setMarks] = useState([])
  const [writtenRuling, setWrittenRuling] = useState('')
  const [selectedVerdict, setSelectedVerdict] = useState(null)
  const [phase, setPhase] = useState('idle')
  const caseData = CASES[0]
  const plateReady = marks.length > 0 && marks.every((mark) => mark.note.trim())
  const ready = plateReady && writtenRuling.trim() && selectedVerdict && phase === 'idle'

  const handleSubmit = () => {
    if (!ready) return
    setPhase('fading')
    setTimeout(() => setPhase('interstitial'), 200)
    setTimeout(() => setPhase('interstitialOut'), 2600)
    setTimeout(() => onComplete({
      verdict: selectedVerdict,
      evidencePlate: marks,
      evidenceTags: [...new Set(marks.map((mark) => mark.lens))],
      writtenRuling: writtenRuling.trim(),
      timestamp: Date.now(),
    }), 2900)
  }

  return (
    <div className={styles.root}>
      <span className={styles.wordmark} aria-hidden="true">D/D</span>
      <header className={styles.projectHeader}>
        <span className={styles.projectLabel}>Case 001 begins before the verdict.</span>
        <span className={styles.projectSub}>File the evidence your judgment depends on</span>
      </header>

      <div className={styles.plateShell}>
        <EvidencePlate
          src={caseData.screenshot}
          aspectRatio={caseData.screenshotAspect ?? '4/3'}
          objectPosition={caseData.screenshotPosition ?? 'top center'}
          marks={marks}
          onChange={setMarks}
        />

        <label className={styles.rulingLabel}>
          <span>YOUR RULING · ONE SENTENCE</span>
          <textarea
            value={writtenRuling}
            onChange={(event) => setWrittenRuling(event.target.value)}
            placeholder="What does your plate prove?"
            maxLength={220}
            className={styles.rulingInput}
          />
        </label>

        <div className={styles.verdictRow} role="group" aria-label="Verdict">
          {VERDICTS.map(({ key, label }) => (
            <button key={key} className={`${styles.verdictCard} ${selectedVerdict === key ? styles.verdictCardSelected : ''}`} onClick={() => setSelectedVerdict(key)} aria-pressed={selectedVerdict === key}>
              <span className={styles.verdictCardAccent} aria-hidden="true" />{label}
            </button>
          ))}
        </div>

        {!plateReady && <p className={styles.readiness}>Place at least one mark and name what it makes you notice.</p>}
        <button className={`${styles.submitBtn} ${ready ? styles.submitBtnActive : ''}`} onClick={handleSubmit} disabled={!ready}>Seal Plate 00</button>
      </div>

      {(phase === 'interstitial' || phase === 'interstitialOut') && (
        <div className={`${styles.interstitial} ${phase === 'interstitialOut' ? styles.interstitialOut : styles.interstitialIn}`} aria-live="polite">
          <p>Plate 00 is sealed.</p>
          <p>Now open the evidence you did not see.</p>
        </div>
      )}
    </div>
  )
}