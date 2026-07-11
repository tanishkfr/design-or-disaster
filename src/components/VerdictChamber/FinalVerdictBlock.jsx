import { useState, useEffect } from 'react'
import styles from './FinalVerdictBlock.module.css'

const VERDICT_LABEL = {
  strong_design:   'Strong Design',
  needs_revision:  'Needs Revision',
  design_disaster: 'Design Disaster',
}

const CONFIDENCE_LABEL = {
  guessing:       'Guessing',
  somewhat_sure:  'Somewhat Sure',
  confident:      'Confident',
  very_confident: 'Very Confident',
}

const STATUS_PROSE = {
  consensus: 'The jury reached consensus.',
  contested: 'The jury remained divided.',
  landmark:  'The jury rendered a landmark verdict.',
  sealed:    'No panel verdict was entered.',
}

const VERDICT_ORDER = ['strong_design', 'needs_revision', 'design_disaster']

// Count how many jurors vote in support of the official verdict.
// guilty → problems found → supports needs_revision or design_disaster
// not_guilty → clean → supports strong_design
// mixed → partial issues → supports needs_revision
function getVoteCount(jurorRulings, officialVerdict) {
  return jurorRulings.filter(r => {
    if (officialVerdict === 'strong_design')   return r.ruling === 'not_guilty'
    if (officialVerdict === 'design_disaster') return r.ruling === 'guilty'
    return r.ruling === 'guilty' || r.ruling === 'mixed'
  }).length
}

export default function FinalVerdictBlock({ caseData, submission, showNext, onNext, isFinalCase }) {
  const [textVisible, setTextVisible] = useState(false)

  // Verdict text fades in 500ms after the block lands — let the reveal feel earned
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 500)
    return () => clearTimeout(t)
  }, [])

  const isSealed    = caseData.caseStatus === 'sealed'
  const isContested = caseData.caseStatus === 'contested'
  const isCorrect   = !isSealed && submission.verdict === caseData.officialVerdict
  const voteCount   = isSealed ? null : getVoteCount(caseData.jurorRulings, caseData.officialVerdict)
  const verdictText = isSealed ? VERDICT_LABEL[submission.verdict] : VERDICT_LABEL[caseData.officialVerdict]
  const crowd       = caseData.crowd ?? null

  // Contested: split vote counts for each side
  const guiltyCount   = caseData.jurorRulings.filter(r => r.ruling === 'guilty' || r.ruling === 'mixed').length
  const clearCount    = caseData.jurorRulings.filter(r => r.ruling === 'not_guilty').length
  const minorityLabel = guiltyCount > clearCount ? VERDICT_LABEL['strong_design'] : VERDICT_LABEL['design_disaster']

  return (
    <div className={styles.block}>
      {isSealed ? (
        <>
          {/* Sealed header */}
          <div className={styles.jurySplitHeader}>
            <span className={styles.jurySplitLabel}>VERDICT SEALED</span>
          </div>

          {/* The jury still divided — the votes are on record, the ruling is not */}
          <div className={`${styles.splitVotes} ${textVisible ? styles.visible : ''}`}>
            <span className={styles.splitVoteRow}>
              <span className={styles.splitCount}>{guiltyCount} / 5</span>
              <span className={styles.splitSeparator}>FIND</span>
              <span className={styles.splitVerdict}>Against the design</span>
            </span>
            <span className={styles.splitVoteRow}>
              <span className={styles.splitCount}>{clearCount} / 5</span>
              <span className={styles.splitSeparator}>FIND</span>
              <span className={styles.splitVerdict}>For the design</span>
            </span>
          </div>

          {caseData.contestedSummary && (
            <div className={`${styles.contestedBody} ${textVisible ? styles.visible : ''}`}>
              <div className={styles.contestedRule} aria-hidden="true" />
              <p className={styles.contestedSummary}>{caseData.contestedSummary}</p>
              <p className={styles.contestedClose}>
                On this case, the panel entered no verdict. Yours is the ruling of record.
              </p>
              <div className={styles.contestedRule} aria-hidden="true" />
            </div>
          )}

          {/* The investigator's verdict — the only one stamped */}
          <div className={`${styles.verdictLine} ${textVisible ? styles.visible : ''}`}>
            <span className={`${styles.verdictText} ${styles.contestedVerdict}`}>{verdictText}</span>
          </div>
        </>
      ) : isContested ? (
        <>
          {/* JURY SPLIT header */}
          <div className={styles.jurySplitHeader}>
            <span className={styles.jurySplitLabel}>JURY SPLIT</span>
          </div>

          {/* Split vote breakdown */}
          <div className={`${styles.splitVotes} ${textVisible ? styles.visible : ''}`}>
            <span className={styles.splitVoteRow}>
              <span className={styles.splitCount}>{guiltyCount} / 5</span>
              <span className={styles.splitSeparator}>VOTE:</span>
              <span className={styles.splitVerdict}>{verdictText}</span>
            </span>
            <span className={styles.splitVoteRow}>
              <span className={styles.splitCount}>{clearCount} / 5</span>
              <span className={styles.splitSeparator}>VOTE:</span>
              <span className={styles.splitVerdict}>{minorityLabel}</span>
            </span>
          </div>

          {/* Contested summary */}
          {caseData.contestedSummary && (
            <div className={`${styles.contestedBody} ${textVisible ? styles.visible : ''}`}>
              <div className={styles.contestedRule} aria-hidden="true" />
              <p className={styles.contestedSummary}>{caseData.contestedSummary}</p>
              <p className={styles.contestedClose}>The design community remains divided.</p>
              <div className={styles.contestedRule} aria-hidden="true" />
            </div>
          )}

          {/* Final verdict line */}
          <div className={`${styles.verdictLine} ${textVisible ? styles.visible : ''}`}>
            <span className={`${styles.verdictText} ${styles.contestedVerdict}`}>{verdictText}</span>
          </div>
        </>
      ) : (
        <>
          {/* Vote count */}
          <p className={styles.voteCount}>{voteCount} / 5 JURORS</p>

          {/* Verdict text */}
          <div className={`${styles.verdictLine} ${textVisible ? styles.visible : ''}`}>
            <span className={styles.verdictText}>{verdictText}</span>
          </div>
        </>
      )}

      {/* ── The Record — how prior investigators ruled ── */}
      {crowd && (
        <div className={`${styles.crowdBlock} ${textVisible ? styles.visible : ''}`}>
          <span className={styles.crowdLabel}>── Investigators on record</span>
          {VERDICT_ORDER.map((key) => {
            const pct = crowd[key] ?? 0
            const isYours = submission.verdict === key
            const isPanel = !isSealed && caseData.officialVerdict === key
            return (
              <div key={key} className={styles.crowdRow}>
                <span className={`${styles.crowdVerdict} ${isYours ? styles.crowdYours : ''}`}>
                  {VERDICT_LABEL[key]}
                </span>
                <div className={styles.crowdTrack} aria-hidden="true">
                  <div className={styles.crowdFill} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.crowdPct}>{pct}%</span>
                <span className={styles.crowdMarkers}>
                  {isYours && <span className={styles.crowdYourMark}>you</span>}
                  {isPanel && <span className={styles.crowdPanelMark}>panel</span>}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Divider */}
      <div className={styles.rule} aria-hidden="true" />

      {/* Personal comparison */}
      <div className={`${styles.comparison} ${textVisible ? styles.visible : ''}`}>
        <span className={styles.yourVerdict}>
          Your verdict: {VERDICT_LABEL[submission.verdict]}
          {submission.confidenceInferred && submission.elapsedMs ? (
            <> · Filed in {Math.max(1, Math.round(submission.elapsedMs / 1000))}s · read as {CONFIDENCE_LABEL[submission.confidence]}</>
          ) : submission.confidence ? (
            <> · {CONFIDENCE_LABEL[submission.confidence]}</>
          ) : null}
        </span>
        {isSealed ? (
          <span className={styles.correct}>Your ruling stands. No one will overrule it.</span>
        ) : (
          <span className={isCorrect ? styles.correct : styles.incorrect}>
            {isCorrect ? 'You were right.' : 'You were wrong.'}
          </span>
        )}
      </div>

      {/* Status */}
      <div className={`${styles.statusRow} ${textVisible ? styles.visible : ''}`}>
        <span className={styles.statusProse}>{STATUS_PROSE[caseData.caseStatus]}</span>
      </div>

      {/* Next case / final exit */}
      {showNext && (
        <>
          {isFinalCase && (
            <p className={styles.completionLine}>Investigation complete · 10 cases</p>
          )}
          <button className={styles.nextBtn} onClick={onNext}>
            {isFinalCase ? 'The record →' : 'Next Case →'}
          </button>
        </>
      )}
    </div>
  )
}
