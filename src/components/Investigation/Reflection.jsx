import { reflectionOutcome } from '../../investigation/engine'
import { VERDICT_LABELS, CONFIDENCE_LABELS } from '../../investigation/labels'
import LookEvidence from './LookEvidence'
import styles from './Investigation.module.css'

const OUTCOMES = {
  changed_verdict: 'Your verdict changed.',
  new_reasoning: 'Same verdict. Different reasoning.',
  consistent_reasoning: 'Your verdict and reasoning stand.',
  incomplete: 'The record is incomplete.',
}
export default function Reflection({
  record,
  caseData,
  config,
  onNote,
  onComplete,
  onPanel,
  onNext,
  onReport,
}) {
  const first = record.firstJudgment,
    second = record.secondJudgment
  const complete = record.stage === 'COMPLETE'
  const outcome = reflectionOutcome(record)
  return (
    <section className={styles.reflection}>
      <div className={styles.reflectionLead}>
        <h2>{OUTCOMES[outcome]}</h2>
        <p>
          {outcome === 'new_reasoning'
            ? 'Your written reasoning differs. This is a comparison of your words, not an assessment of their quality.'
            : outcome === 'consistent_reasoning'
              ? 'The verdict and written reasoning match. New evidence and a change in confidence can still matter.'
              : 'Neither changing nor keeping a verdict is scored. These are the two decisions you made.'}
        </p>
      </div>
      <div className={styles.comparison}>
        {[
          ['First look', first],
          ['Second look', second],
        ].map(([label, judgment]) => (
          <section key={label} className={styles.decision}>
            <h2>{label}</h2>
            <strong>
              {VERDICT_LABELS[judgment?.verdict] ?? 'Not submitted'}
            </strong>
            <p className={styles.meta}>
              Confidence /{' '}
              {CONFIDENCE_LABELS[judgment?.confidence] ?? 'Not supplied'}
            </p>
            <blockquote>
              {judgment?.writtenRuling ?? 'No reasoning on record.'}
            </blockquote>
          </section>
        ))}
      </div>
      <div className={styles.geometryNotice}>
        <strong>Two preserved moments.</strong>
        <p>
          Each map keeps its captured state and geometry. Different states are
          shown separately, never silently aligned.
        </p>
      </div>
      <div className={styles.comparison}>
        <section>
          <h2 className={styles.mapTitle}>Before / first evidence</h2>
          <LookEvidence
            look={record.firstLook}
            caseData={caseData}
            label="First exhibit state"
          />
        </section>
        <section>
          <h2 className={styles.mapTitle}>After / second evidence</h2>
          <LookEvidence
            look={record.secondLook}
            caseData={caseData}
            label="Second exhibit state"
          />
        </section>
      </div>
      <section className={styles.contextRecord}>
        <h2>What entered the investigation</h2>
        {config.context
          .filter((item) => record.contextRevealed.includes(item.id))
          .map((item) => (
            <details key={item.id}>
              <summary>
                {item.title}
                <span>{item.provenance}</span>
              </summary>
              <p>{item.body}</p>
            </details>
          ))}
        <p className={styles.meta}>
          Observed in this attempt:{' '}
          {[...new Set(record.secondLook.exhibit.events)].join(', ') ||
            'No task actions recorded'}
          . No confidence was inferred from these actions.
        </p>
      </section>
      <label className={styles.written}>
        What influenced your decision?{' '}
        <span>Optional. Keeping your verdict needs no defense.</span>
        <textarea
          maxLength={800}
          rows={3}
          value={record.reflectionNote}
          readOnly={complete}
          onChange={(event) => onNote(event.target.value)}
          placeholder="Leave a note for your record, if you want."
        />
      </label>
      {complete ? (
        <div className={styles.finish}>
          <p>Your investigation is complete and saved in this browser.</p>
          {!config.sealed && (
            <button className={styles.primary} onClick={onPanel}>
              Compare the authored jurors →
            </button>
          )}
          {config.sealed && (
            <p>Your ruling stands without an outside interpretation.</p>
          )}
          {onNext && (
            <button className={styles.textButton} onClick={onNext}>
              Next investigation →
            </button>
          )}
          {onReport && (
            <button className={styles.textButton} onClick={onReport}>
              Your Design Eye →
            </button>
          )}
        </div>
      ) : (
        <button
          className={styles.primary}
          onClick={onComplete}
          disabled={outcome === 'incomplete'}
        >
          Complete investigation →
        </button>
      )}
    </section>
  )
}
