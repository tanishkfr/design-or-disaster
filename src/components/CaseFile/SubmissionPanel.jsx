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

const CONFIDENCE_OPTIONS = [
  { key: 'guessing',       label: 'Guessing' },
  { key: 'somewhat_sure',  label: 'Somewhat Sure' },
  { key: 'confident',      label: 'Confident' },
  { key: 'very_confident', label: 'Very Confident' },
]

export default function SubmissionPanel({ exiting, onSubmit }) {
  const [verdict, setVerdict] = useState(null)
  const [evidenceTags, setEvidenceTags] = useState([])
  const [confidence, setConfidence] = useState(null)
  const [tagsPulsing, setTagsPulsing] = useState(false)

  const isComplete = verdict !== null && evidenceTags.length >= 1 && confidence !== null

  const handleTagToggle = (tag) => {
    if (evidenceTags.includes(tag)) {
      setEvidenceTags(evidenceTags.filter(t => t !== tag))
    } else if (evidenceTags.length < 3) {
      setEvidenceTags([...evidenceTags, tag])
    } else {
      // 4th selection attempt — pulse all unselected chips once
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

      {/* ── Position — three verdict options ─────────── */}
      <div className={styles.verdictList} role="group" aria-label="Your position on this design">
        {VERDICT_OPTIONS.map(({ key, label, color, bg }) => {
          const selected = verdict === key
          return (
            <button
              key={key}
              className={`${styles.verdictCard} ${selected ? styles.verdictCardSelected : ''}`}
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

      <div className={styles.rule} aria-hidden="true" />

      {/* ── Evidence — which principles did you identify ─ */}
      <div
        className={styles.tagCloud}
        role="group"
        aria-label="Evidence — select 1 to 3 design principles"
      >
        {EVIDENCE_TAGS.map(tag => {
          const selected = evidenceTags.includes(tag)
          const shouldPulse = tagsPulsing && !selected
          return (
            <button
              key={tag}
              className={[
                styles.tag,
                selected ? styles.tagSelected : '',
                shouldPulse ? styles.tagPulse : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleTagToggle(tag)}
              aria-pressed={selected}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <div className={styles.rule} aria-hidden="true" />

      {/* ── Confidence — how certain are you ─────────── */}
      <div
        className={styles.confidenceRow}
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

      {/* ── Submit ────────────────────────────────────── */}
      <button
        className={`${styles.submitBtn} ${isComplete && !exiting ? styles.submitBtnActive : ''}`}
        onClick={handleSubmit}
        disabled={!isComplete || exiting}
        aria-label="File your verdict"
      >
        File verdict
      </button>

    </div>
  )
}
