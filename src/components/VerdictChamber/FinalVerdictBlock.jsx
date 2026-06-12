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
}

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

  const isContested = caseData.caseStatus === 'contested'
  const isCorrect   = submission.verdict === caseData.officialVerdict
  const voteCount   = getVoteCount(caseData.jurorRulings, caseData.officialVerdict)
  const verdictText = VERDICT_LABEL[caseData.officialVerdict]

  // Contested: split vote counts for each side
  const guiltyCount   = caseData.jurorRulings.filter(r => r.ruling === 'guilty' || r.ruling === 'mixed').length
  const clearCount    = caseData.jurorRulings.filter(r => r.ruling === 'not_guilty').length
  const minorityLabel = guiltyCount > clearCount ? VERDICT_LABEL['strong_design'] : VERDICT_LABEL['design_disaster']

  return (
    <div className={styles.block}>
      {isContested ? (
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

      {/* Divider */}
      <div className={styles.rule} aria-hidden="true" />

      {/* Personal comparison */}
      <div className={`${styles.comparison} ${textVisible ? styles.visible : ''}`}>
        <span className={styles.yourVerdict}>
          Your verdict: {VERDICT_LABEL[submission.verdict]}
          {submission.confidence && (
            <> · {CONFIDENCE_LABEL[submission.confidence]}</>
          )}
        </span>
        <span className={isCorrect ? styles.correct : styles.incorrect}>
          {isCorrect ? 'You were right.' : 'You were wrong.'}
        </span>
      </div>

      {/* Status */}
      <div className={`${styles.statusRow} ${textVisible ? styles.visible : ''}`}>
        <span className={styles.statusProse}>{STATUS_PROSE[caseData.caseStatus]}</span>
      </div>

      {/* Next case / final exit */}
      {showNext && (
        <>
          {isFinalCase && (
            <p className={styles.completionLine}>Investigation complete · 15 cases</p>
          )}
          <button className={styles.nextBtn} onClick={onNext}>
            {isFinalCase ? 'The record →' : 'Next Case →'}
          </button>
        </>
      )}
    </div>
  )
}
