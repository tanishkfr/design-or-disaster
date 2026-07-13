import { useEffect, useMemo, useState } from 'react'
import { JUROR_BY_LENS } from '../../data/jurors'
import JurorEntry from './JurorEntry'
import FinalVerdictBlock from './FinalVerdictBlock'
import OverlaidJury from './OverlaidJury'
import styles from './VerdictChamber.module.css'

const TINT_COLOR = {
  strong_design: 'var(--clear)',
  needs_revision: 'var(--mixed)',
  design_disaster: 'var(--guilty)',
}

const SPLIT_OFFSET = { guilty: -32, not_guilty: 32, mixed: 0 }
const VERDICT_TO_RULING = { strong_design: 'not_guilty', needs_revision: 'mixed', design_disaster: 'guilty' }

export default function VerdictChamber({ caseData, submission, onNext, onBack, isFinalCase }) {
  const sealed = caseData.caseStatus === 'sealed'
  const contested = caseData.caseStatus === 'contested'
  const jurorRulings = useMemo(() => (sealed ? [] : caseData.jurorRulings), [caseData.jurorRulings, sealed])
  const [arrivedCount, setArrivedCount] = useState(0)
  const [showVerdict, setShowVerdict] = useState(sealed)
  const [complete, setComplete] = useState(false)
  const [openedJurorPlate, setOpenedJurorPlate] = useState(false)

  useEffect(() => {
    if (sealed) {
      const timer = setTimeout(() => setComplete(true), 900)
      return () => clearTimeout(timer)
    }

    const timers = jurorRulings.map((_, index) =>
      setTimeout(() => setArrivedCount((current) => Math.max(current, index + 1)), 500 + index * 650),
    )
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [jurorRulings, sealed])

  useEffect(() => {
    if (sealed || !openedJurorPlate || arrivedCount < jurorRulings.length) return
    const verdictTimer = setTimeout(() => setShowVerdict(true), 500)
    const completeTimer = setTimeout(() => setComplete(true), 1700)
    return () => { clearTimeout(verdictTimer); clearTimeout(completeTimer) }
  }, [arrivedCount, jurorRulings.length, openedJurorPlate, sealed])

  const availableLenses = jurorRulings.slice(0, arrivedCount).map((ruling) => ruling.juror)
  const investigatorRuling = VERDICT_TO_RULING[submission.verdict] ?? 'mixed'

  return (
    <div className={styles.root}>
      {!sealed && showVerdict && (
        <div className={`${styles.screenTint} ${styles.screenTintVisible}`} style={{ '--tint': TINT_COLOR[caseData.officialVerdict] }} aria-hidden="true" />
      )}

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Return to archive">← Archive</button>
        <span className={styles.caseNumber}>{caseData.number}</span>
        <span className={`${styles.chamberLabel} ${styles.chamberLabelVisible}`}>{sealed ? 'SEALED PLATE' : 'OVERLAID JURY'}</span>
      </header>

      <div className={styles.content}>
        <OverlaidJury
          src={caseData.screenshot}
          aspectRatio={caseData.screenshotAspect ?? '4/3'}
          objectPosition={caseData.screenshotPosition ?? 'top center'}
          description={caseData.screenshotDescription}
          visitorMarks={submission.evidencePlate ?? []}
          annotations={sealed ? [] : caseData.annotations ?? []}
          availableLenses={availableLenses}
          sealed={sealed}
          onOpenJurorPlate={() => setOpenedJurorPlate(true)}
        />

        {!sealed && arrivedCount >= jurorRulings.length && !openedJurorPlate && (
          <p className={styles.caseContext}>Open at least one juror plate. The ruling will not arrive until you have looked through another eye.</p>
        )}

        <div className={styles.caseIdentity}>
          <div className={styles.caseTitleRow}>
            <h1 className={styles.caseTitle}>{caseData.title}</h1>
            <span className={`${styles.categoryTag} ${styles.categoryTagVisible}`}>{caseData.category}</span>
          </div>
          <p className={styles.caseContext}>{caseData.context}</p>
        </div>

        {!sealed && (
          <>
            <div className={styles.divider} aria-hidden="true" />
            <section className={styles.deliberation} aria-label="Jury deliberation">
              <div className={styles.deliberationHeader}>
                <span className={styles.deliberationLabel}>Five plates · incompatible evidence</span>
                {arrivedCount < jurorRulings.length && (
                  <button className={styles.revealAllBtn} type="button" onClick={() => setArrivedCount(jurorRulings.length)}>
                    Open all five plates
                  </button>
                )}
                <div className={styles.jurorDots} aria-hidden="true">
                  {jurorRulings.map((ruling, index) => (
                    <div key={ruling.juror} className={`${styles.jurorDot} ${index < arrivedCount ? styles[`jurorDot_${ruling.ruling}`] : ''}`} />
                  ))}
                </div>
              </div>
              <div className={styles.jurorList}>
                {jurorRulings.map((ruling, index) => (
                  <JurorEntry
                    key={ruling.juror}
                    juror={JUROR_BY_LENS[ruling.juror]}
                    ruling={ruling.ruling}
                    reasoning={ruling.reasoning}
                    arrived={index < arrivedCount}
                    splitOffset={contested && showVerdict ? SPLIT_OFFSET[ruling.ruling] : 0}
                  />
                ))}
                <JurorEntry
                  juror={{ lens: 'you', title: 'The Investigator' }}
                  ruling={investigatorRuling}
                  reasoning={submission.writtenRuling}
                  arrived={arrivedCount >= jurorRulings.length}
                  splitOffset={contested && showVerdict ? SPLIT_OFFSET[investigatorRuling] : 0}
                  isInvestigator
                />
              </div>
            </section>
          </>
        )}

        {showVerdict && (
          <>
            <div className={styles.divider} aria-hidden="true" />
            <FinalVerdictBlock caseData={caseData} submission={submission} showNext={complete} onNext={onNext} isFinalCase={isFinalCase} />
          </>
        )}
        <div className={styles.bottomSpacer} />
      </div>
    </div>
  )
}
