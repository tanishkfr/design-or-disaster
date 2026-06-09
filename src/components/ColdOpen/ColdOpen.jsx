import { useState } from 'react'
import styles from './ColdOpen.module.css'
import { CASES } from '../../data/cases'

const VERDICTS = [
  { key: 'strong_design',   label: 'Strong Design',   color: 'var(--clear)',  bg: 'var(--clear-dim)'  },
  { key: 'needs_revision',  label: 'Needs Revision',  color: 'var(--mixed)',  bg: 'var(--mixed-dim)'  },
  { key: 'design_disaster', label: 'Design Disaster', color: 'var(--guilty)', bg: 'var(--guilty-dim)' },
]

export default function ColdOpen({ onComplete }) {
  const [selectedVerdict, setSelectedVerdict] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | fading | interstitial | interstitialOut

  const caseData = CASES[0]

  const handleSubmit = () => {
    if (!selectedVerdict || phase !== 'idle') return

    setPhase('fading')

    // Cards fade out: 200ms
    // Interstitial fades in: 300ms
    // Hold: 2500ms
    // Interstitial fades out: 300ms
    // Complete

    setTimeout(() => setPhase('interstitial'), 200)
    setTimeout(() => setPhase('interstitialOut'), 200 + 300 + 2500)
    setTimeout(
      () => onComplete({ verdict: selectedVerdict, timestamp: Date.now() }),
      200 + 300 + 2500 + 300
    )
  }

  const showCards = phase === 'idle' || phase === 'fading'

  return (
    <div className={styles.root}>
      <div className={styles.screenshotWrap}>
        <img
          src={caseData.screenshot}
          alt="Interface under investigation"
          className={styles.screenshot}
          draggable={false}
        />
        <div className={styles.vignette} />
        <span className={styles.exhibitLabel}>EXHIBIT A</span>
      </div>

      <div className={styles.meta}>
        <span className={styles.caseNumber}>{caseData.number}</span>
        <span className={styles.pendingLabel}>Verdict Pending</span>
      </div>

      <p className={styles.question}>What do you think?</p>

      <div className={`${styles.verdictRow} ${!showCards ? styles.verdictRowGone : ''}`}>
        {VERDICTS.map(({ key, label, color, bg }) => {
          const isSelected = selectedVerdict === key
          return (
            <button
              key={key}
              className={`${styles.verdictCard} ${isSelected ? styles.verdictCardSelected : ''}`}
              style={isSelected ? { '--vc': color, '--vb': bg } : {}}
              onClick={() => setSelectedVerdict(key)}
              aria-pressed={isSelected}
            >
              <span className={styles.verdictCardAccent} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      <button
        className={[
          styles.submitBtn,
          selectedVerdict && phase === 'idle' ? styles.submitBtnActive : '',
          !showCards ? styles.submitBtnGone : '',
        ].join(' ')}
        onClick={handleSubmit}
        disabled={!selectedVerdict || phase !== 'idle'}
      >
        Submit verdict
      </button>

      {(phase === 'interstitial' || phase === 'interstitialOut') && (
        <div
          className={`${styles.interstitial} ${
            phase === 'interstitialOut' ? styles.interstitialOut : styles.interstitialIn
          }`}
          aria-live="polite"
        >
          <p>You are not being tested.</p>
          <p>You are training judgment.</p>
        </div>
      )}
    </div>
  )
}
