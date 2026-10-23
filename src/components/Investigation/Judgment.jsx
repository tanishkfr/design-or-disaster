import {
  CONFIDENCES,
  VERDICTS,
  validJudgment,
} from '../../investigation/engine'
import styles from './Investigation.module.css'

import { VERDICT_LABELS, CONFIDENCE_LABELS } from '../../investigation/labels'

export default function Judgment({
  value,
  onChange,
  onSubmit,
  sealed,
  second = false,
}) {
  return (
    <section
      className={styles.judgment}
      aria-label={second ? 'Second judgment' : 'First judgment'}
    >
      <h2>
        {second
          ? 'Knowing what you know now, where do you stand?'
          : 'What does your evidence support?'}
      </h2>
      <p>
        {sealed
          ? 'This judgment is sealed. Looking back does not change it.'
          : second
            ? 'A different verdict is optional. Both decisions will remain on record.'
            : 'This is your first reading. Sealing it preserves the evidence and reasoning together.'}
      </p>
      <div
        className={styles.verdicts}
        role="group"
        aria-label="Design judgment"
      >
        {VERDICTS.map((key) => (
          <button
            key={key}
            disabled={sealed}
            aria-pressed={value.verdict === key}
            onClick={() => onChange({ verdict: key })}
          >
            {VERDICT_LABELS[key]}
          </button>
        ))}
      </div>
      <label className={styles.written}>
        Your reasoning
        <textarea
          rows={4}
          maxLength={800}
          value={value.writtenRuling}
          readOnly={sealed}
          onChange={(event) => onChange({ writtenRuling: event.target.value })}
          placeholder="What in the exhibit supports your judgment?"
        />
      </label>
      <fieldset className={styles.confidence} disabled={sealed}>
        <legend>How confident are you?</legend>
        <p>Self-reported. There is no preferred level.</p>
        {CONFIDENCES.map((key) => (
          <label key={key}>
            <input
              type="radio"
              name={second ? 'second-confidence' : 'first-confidence'}
              value={key}
              checked={value.confidence === key}
              onChange={() => onChange({ confidence: key })}
            />
            {CONFIDENCE_LABELS[key]}
          </label>
        ))}
      </fieldset>
      <button
        className={styles.primary}
        disabled={!validJudgment(value)}
        onClick={onSubmit}
      >
        {sealed
          ? second
            ? 'Return to reflection'
            : 'Return to context'
          : second
            ? 'Seal second judgment →'
            : 'Seal first judgment →'}
      </button>
      {!sealed && !validJudgment(value) && (
        <p className={styles.hint}>
          Choose a verdict and confidence, and write your reasoning.
        </p>
      )}
    </section>
  )
}
