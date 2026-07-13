import { useEffect, useState } from 'react'
import styles from './FinalVerdictBlock.module.css'

const VERDICT_LABEL = {
  strong_design: 'Strong Design',
  needs_revision: 'Needs Revision',
  design_disaster: 'Design Disaster',
}

const STATUS_PROSE = {
  consensus: 'The panel reached consensus.',
  contested: 'The panel remained divided.',
  landmark: 'The panel rendered a landmark verdict.',
  sealed: 'No panel verdict was entered.',
}

function getVoteCount(jurorRulings, officialVerdict) {
  return jurorRulings.filter((ruling) => {
    if (officialVerdict === 'strong_design') return ruling.ruling === 'not_guilty'
    if (officialVerdict === 'design_disaster') return ruling.ruling === 'guilty'
    return ruling.ruling === 'guilty' || ruling.ruling === 'mixed'
  }).length
}

export default function FinalVerdictBlock({ caseData, submission, showNext, onNext, isFinalCase }) {
  const [textVisible, setTextVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const isSealed = caseData.caseStatus === 'sealed'
  const isContested = caseData.caseStatus === 'contested'
  const verdictText = VERDICT_LABEL[isSealed ? submission.verdict : caseData.officialVerdict]
  const voteCount = isSealed ? null : getVoteCount(caseData.jurorRulings, caseData.officialVerdict)
  const guiltyCount = isSealed ? 0 : caseData.jurorRulings.filter((item) => item.ruling === 'guilty' || item.ruling === 'mixed').length
  const clearCount = isSealed ? 0 : caseData.jurorRulings.filter((item) => item.ruling === 'not_guilty').length

  return (
    <div className={styles.block}>
      {isSealed ? (
        <>
          <div className={styles.jurySplitHeader}><span className={styles.jurySplitLabel}>YOUR EVIDENCE STANDS</span></div>
          <div className={`${styles.contestedBody} ${textVisible ? styles.visible : ''}`}>
            <div className={styles.contestedRule} aria-hidden="true" />
            <p className={styles.contestedSummary}>No panel perspective, vote count, or official interpretation will be shown. The archive preserves only the evidence you marked and the ruling you filed.</p>
            <p className={styles.contestedClose}>Your perception remains the sole record of this case.</p>
            <div className={styles.contestedRule} aria-hidden="true" />
          </div>
        </>
      ) : isContested ? (
        <>
          <div className={styles.jurySplitHeader}><span className={styles.jurySplitLabel}>JURY SPLIT</span></div>
          <div className={`${styles.splitVotes} ${textVisible ? styles.visible : ''}`}>
            <span className={styles.splitVoteRow}><span className={styles.splitCount}>{guiltyCount} / 5</span><span className={styles.splitSeparator}>FOUND MATERIAL CONCERNS</span></span>
            <span className={styles.splitVoteRow}><span className={styles.splitCount}>{clearCount} / 5</span><span className={styles.splitSeparator}>DID NOT</span></span>
          </div>
          {caseData.contestedSummary && <p className={`${styles.contestedSummary} ${textVisible ? styles.visible : ''}`}>{caseData.contestedSummary}</p>}
        </>
      ) : (
        <p className={styles.voteCount}>{voteCount} / 5 JURORS</p>
      )}

      <div className={`${styles.verdictLine} ${textVisible ? styles.visible : ''}`}>
        <span className={`${styles.verdictText} ${isContested || isSealed ? styles.contestedVerdict : ''}`}>{verdictText}</span>
      </div>

      <div className={styles.rule} aria-hidden="true" />
      <div className={`${styles.comparison} ${textVisible ? styles.visible : ''}`}>
        <span className={styles.yourVerdict}>Your verdict: {VERDICT_LABEL[submission.verdict]}</span>
        <span className={styles.correct}>{isSealed ? 'Your ruling stands. No one will overrule it.' : 'This is the evidence you chose to make visible.'}</span>
      </div>
      <div className={`${styles.statusRow} ${textVisible ? styles.visible : ''}`}><span className={styles.statusProse}>{STATUS_PROSE[caseData.caseStatus]}</span></div>

      {!isSealed && caseData.curatorNote && (
        <aside className={`${styles.caseNote} ${textVisible ? styles.visible : ''}`}>
          <span className={styles.caseNoteLabel}>Case note ? opened after your ruling</span>
          <p>{caseData.curatorNote}</p>
        </aside>
      )}

      {showNext && (
        <>
          {isFinalCase && <p className={styles.completionLine}>Investigation complete · 10 cases</p>}
          <button className={styles.nextBtn} onClick={onNext}>{isFinalCase ? 'The record →' : 'Next Case →'}</button>
        </>
      )}
    </div>
  )
}
