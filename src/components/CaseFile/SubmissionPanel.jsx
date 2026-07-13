import { useState } from 'react'
import styles from './SubmissionPanel.module.css'

const VERDICT_OPTIONS = [
  { key: 'strong_design', label: 'Strong Design', color: 'var(--clear)', bg: 'var(--clear-dim)' },
  { key: 'needs_revision', label: 'Needs Revision', color: 'var(--mixed)', bg: 'var(--mixed-dim)' },
  { key: 'design_disaster', label: 'Design Disaster', color: 'var(--guilty)', bg: 'var(--guilty-dim)' },
]

const CONFIDENCE_OPTIONS = [
  { key: 'guessing', label: 'With reservation.' },
  { key: 'somewhat_sure', label: 'On balance.' },
  { key: 'confident', label: 'I stand by this.' },
  { key: 'very_confident', label: 'Without reservation.' },
]

const VERDICT_PHRASE = { strong_design: 'sound', needs_revision: 'flawed', design_disaster: 'a failure' }
const CONFIDENCE_PHRASE = {
  guessing: 'With reservation.',
  somewhat_sure: 'On balance.',
  confident: 'I stand by this.',
  very_confident: 'Without reservation.',
}

function buildFinding(verdict, confidence) {
  const position = VERDICT_PHRASE[verdict] ?? verdict
  return confidence ? `I read this as ${position}. ${CONFIDENCE_PHRASE[confidence]}` : `I read this as ${position}.`
}

export default function SubmissionPanel({ exiting, onSubmit, plateReady, plateCount }) {
  const [verdict, setVerdict] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const [writtenRuling, setWrittenRuling] = useState('')
  const rulingComplete = writtenRuling.trim().length > 0
  const isComplete = plateReady && verdict !== null && rulingComplete && confidence !== null

  function submit() {
    if (!isComplete || exiting) return
    onSubmit({ verdict, confidence, writtenRuling: writtenRuling.trim() })
  }

  return (
    <div className={`${styles.panel} ${exiting ? styles.exiting : ''}`}>
      <div className={styles.rulingSection}>
        <span className={styles.rulingLabel}>—— Evidence plate</span>
        <p className={styles.inferredNote}>
          {plateReady
            ? `Plate 00 is ready with ${plateCount} spatial finding${plateCount === 1 ? '' : 's'}.`
            : plateCount === 0
              ? 'File at least one mark on Exhibit A before ruling.'
              : 'Name what every mark makes you notice.'}
        </p>
      </div>

      <div className={styles.verdictList} role="group" aria-label="Your position on this design">
        {VERDICT_OPTIONS.map(({ key, label, color, bg }) => {
          const selected = verdict === key
          const dimmed = verdict !== null && !selected
          return (
            <button
              key={key}
              className={`${styles.verdictCard} ${selected ? styles.verdictCardSelected : ''} ${dimmed ? styles.verdictCardDimmed : ''}`}
              style={selected ? { '--vc': color, '--vb': bg } : {}}
              onClick={() => setVerdict(key)}
              aria-pressed={selected}
            >
              <span className={styles.verdictAccent} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      <div className={styles.rulingSection}>
        <label className={styles.rulingLabel} htmlFor="written-ruling">—— Your ruling</label>
        <textarea
          id="written-ruling"
          className={styles.rulingInput}
          value={writtenRuling}
          onChange={(event) => setWrittenRuling(event.target.value)}
          placeholder="State what your plate proves in one sentence."
          maxLength={180}
          rows={3}
          spellCheck
        />
      </div>

      <div className={styles.confidenceBlock}>
        <p className={styles.inferredNote}>Confidence is yours to report. Take the time you need.</p>
        <div className={styles.confidenceColumn} role="group" aria-label="Confidence level">
          {CONFIDENCE_OPTIONS.map(({ key, label }) => (
            <button key={key} className={`${styles.confidenceOption} ${confidence === key ? styles.confidenceSelected : ''}`} onClick={() => setConfidence(key)} aria-pressed={confidence === key}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.findingSection}>
        <div className={styles.findingRule} aria-hidden="true" />
        <p className={`${styles.findingStatement} ${verdict && !isComplete ? styles.findingPartial : ''} ${isComplete ? styles.findingComplete : ''}`} aria-live="polite">
          {verdict ? buildFinding(verdict, confidence) : ''}
        </p>
        <button className={`${styles.recordAction} ${isComplete && !exiting ? styles.recordActionReady : ''}`} onClick={submit} disabled={!isComplete || exiting}>
          Seal Plate 00 →
        </button>
      </div>
    </div>
  )
}
