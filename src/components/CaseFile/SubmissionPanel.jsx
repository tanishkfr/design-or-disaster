import { useState } from 'react'
import styles from './SubmissionPanel.module.css'

const VERDICT_OPTIONS = [
  { key: 'strong_design',   label: 'Strong Design',   color: 'var(--clear)',  bg: 'var(--clear-dim)'  },
  { key: 'needs_revision',  label: 'Needs Revision',  color: 'var(--mixed)',  bg: 'var(--mixed-dim)'  },
  { key: 'design_disaster', label: 'Design Disaster', color: 'var(--guilty)', bg: 'var(--guilty-dim)' },
]

const EVIDENCE_TAGS = [
  'Visual Hierarchy',
  'Accessibility',
  'Navigation',
  'Information Architecture',
  'Clarity',
  'Consistency',
  'Feedback',
  'Trust',
  'Cognitive Load',
]

// Confidence as a personal register — italic serif, not a rating scale
const CONFIDENCE_OPTIONS = [
  { key: 'guessing',       label: 'With reservation.'  },
  { key: 'somewhat_sure',  label: 'On balance.'         },
  { key: 'confident',      label: 'I stand by this.'    },
  { key: 'very_confident', label: 'Without reservation.' },
]

const VERDICT_PHRASE = {
  strong_design:   'sound',
  needs_revision:  'flawed',
  design_disaster: 'a failure',
}

const CONFIDENCE_PHRASE = {
  guessing:       'With reservation.',
  somewhat_sure:  'On balance.',
  confident:      'I stand by this.',
  very_confident: 'Without reservation.',
}

function buildFinding(v, c) {
  const vp = VERDICT_PHRASE[v] ?? v
  if (!c) return `I read this as ${vp}.`
  const cp = CONFIDENCE_PHRASE[c] ?? c
  return `I read this as ${vp}. ${cp}`
}

export default function SubmissionPanel({ exiting, onSubmit }) {
  const [verdict, setVerdict] = useState(null)
  const [evidenceTags, setEvidenceTags] = useState([])
  const [confidence, setConfidence] = useState(null)
  const [tagsPulsing, setTagsPulsing] = useState(false)

  const isComplete = verdict !== null && confidence !== null
  const someVerdictSelected = verdict !== null

  const handleTagToggle = (tag) => {
    if (evidenceTags.includes(tag)) {
      setEvidenceTags(evidenceTags.filter(t => t !== tag))
    } else if (evidenceTags.length < 3) {
      setEvidenceTags([...evidenceTags, tag])
    } else {
      setTagsPulsing(true)
      setTimeout(() => setTagsPulsing(false), 500)
    }
  }

  const handleSubmit = () => {
    if (!isComplete || exiting) return
    onSubmit({ verdict, evidenceTags, confidence })
  }

  return (
    <div className={`${styles.panel} ${exiting ? styles.exiting : ''}`}>

      {/* ── Position — rule out until one remains ────── */}
      <div className={styles.verdictList} role="group" aria-label="Your position on this design">
        {VERDICT_OPTIONS.map(({ key, label, color, bg }) => {
          const selected = verdict === key
          const dimmed = someVerdictSelected && !selected
          return (
            <button
              key={key}
              className={[
                styles.verdictCard,
                selected ? styles.verdictCardSelected : '',
                dimmed   ? styles.verdictCardDimmed   : '',
              ].filter(Boolean).join(' ')}
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

      {/* ── Evidence — surface what you identified ────── */}
      <div
        className={styles.tagCloud}
        role="group"
        aria-label="Evidence — optional, select up to 3 design principles"
      >
        {EVIDENCE_TAGS.map(tag => {
          const selected = evidenceTags.includes(tag)
          const shouldPulse = tagsPulsing && !selected
          return (
            <button
              key={tag}
              className={[
                styles.tag,
                selected    ? styles.tagSelected : '',
                shouldPulse ? styles.tagPulse    : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleTagToggle(tag)}
              aria-pressed={selected}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {/* ── Confidence — a personal notation ─────────── */}
      <div
        className={styles.confidenceColumn}
        role="group"
        aria-label="Confidence level"
      >
        {CONFIDENCE_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.confidenceOption} ${confidence === key ? styles.confidenceSelected : ''}`}
            onClick={() => setConfidence(key)}
            aria-pressed={confidence === key}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Finding — the authored record ─────────────── */}
      <div className={styles.findingSection}>
        <div className={styles.findingRule} aria-hidden="true" />
        <p
          className={[
            styles.findingStatement,
            verdict && !confidence ? styles.findingPartial : '',
            verdict && confidence  ? styles.findingComplete : '',
          ].filter(Boolean).join(' ')}
          aria-live="polite"
        >
          {verdict ? buildFinding(verdict, confidence) : ''}
        </p>
        <button
          className={[
            styles.recordAction,
            isComplete && !exiting ? styles.recordActionReady : '',
          ].filter(Boolean).join(' ')}
          onClick={handleSubmit}
          disabled={!isComplete || exiting}
          aria-label="Record your finding"
        >
          Record finding →
        </button>
      </div>

    </div>
  )
}
