import { useState, useEffect } from 'react'
import { JUROR_BY_LENS } from '../../data/jurors'
import AnnotatedScreenshot from './AnnotatedScreenshot'
import JurorEntry from './JurorEntry'
import FinalVerdictBlock from './FinalVerdictBlock'
import styles from './VerdictChamber.module.css'

// ─── Timing constants ──────────────────────────────────
// All in ms, measured from phase transitions (not absolute mount time)
const ENTER_TO_ANNOTATE     = 350   // screenshot+header settle before annotations begin
const ANNOTATION_STAGGER    = 80    // ms between each annotation appearing
const ANNOTATION_SETTLE     = 250   // buffer after last annotation before jurors start
const JUROR_STAGGER         = 400   // between each juror arrival
const POST_JURORS_PAUSE     = 1400  // silence after last juror before verdict (or split)
const SPLIT_DURATION        = 1100  // split animation (500ms) + settle buffer (600ms)
const VERDICT_TO_COMPLETE   = 1400  // block lands + text fades + "Next" appears

// ─── Verdict colour for screen tint ───────────────────
const TINT_COLOR = {
  strong_design:   'var(--clear)',
  needs_revision:  'var(--mixed)',
  design_disaster: 'var(--guilty)',
}

// ─── Split offset per ruling ───────────────────────────
const SPLIT_OFFSET = {
  guilty:    -32,
  not_guilty: 32,
  mixed:       0,
}

// The investigator's verdict maps onto the jury's ruling vocabulary
const VERDICT_TO_RULING = {
  strong_design:   'not_guilty',
  needs_revision:  'mixed',
  design_disaster: 'guilty',
}

export default function VerdictChamber({ caseData, submission, onNext, onBack, isFinalCase }) {
  // phases: entering → annotating → deliberating → (splitting?) → verdicting → complete
  const [phase,       setPhase]       = useState('entering')
  const [arrivedCount, setArrivedCount] = useState(0)
  const [pulsingLens,  setPulsingLens]  = useState(null)
  const [splitActive,  setSplitActive]  = useState(false)
  const [showTint,     setShowTint]     = useState(false)

  const isSealed      = caseData.caseStatus === 'sealed'
  const isContested   = caseData.caseStatus === 'contested' || isSealed
  const annotations   = caseData.annotations ?? []
  const jurorRulings  = caseData.jurorRulings

  // The investigator files as the sixth juror when a written ruling exists
  const hasInvestigator = Boolean(submission?.writtenRuling)
  const totalEntries    = jurorRulings.length + (hasInvestigator ? 1 : 0)
  const investigatorRuling = VERDICT_TO_RULING[submission?.verdict] ?? 'mixed'

  // ── Phase 1: entering → annotating ──────────────────
  useEffect(() => {
    const t = setTimeout(() => setPhase('annotating'), ENTER_TO_ANNOTATE)
    return () => clearTimeout(t)
  }, [])

  // ── Phase 2: annotating → deliberating ──────────────
  useEffect(() => {
    if (phase !== 'annotating') return
    const annotationWait = annotations.length * ANNOTATION_STAGGER + ANNOTATION_SETTLE
    const t = setTimeout(() => setPhase('deliberating'), annotationWait)
    return () => clearTimeout(t)
  }, [phase, annotations.length])

  // ── Phase 3: jurors arrive one by one, then the investigator ──
  useEffect(() => {
    if (phase !== 'deliberating') return

    const timers = jurorRulings.map((ruling, i) =>
      setTimeout(() => {
        setArrivedCount(i + 1)
        setPulsingLens(ruling.juror)
        // pulse clears after 800ms
        setTimeout(() => setPulsingLens(null), 800)
      }, i * JUROR_STAGGER)
    )

    // The sixth entry: your own ruling, filed into the same record
    if (hasInvestigator) {
      timers.push(
        setTimeout(() => setArrivedCount(jurorRulings.length + 1), jurorRulings.length * JUROR_STAGGER + 200)
      )
    }

    return () => timers.forEach(clearTimeout)
  }, [phase, jurorRulings, hasInvestigator])

  // ── Phase 4: after all entries — split or verdict ─────
  useEffect(() => {
    if (arrivedCount < totalEntries) return

    if (isContested) {
      const t1 = setTimeout(() => setSplitActive(true), POST_JURORS_PAUSE)
      const t2 = setTimeout(() => {
        setPhase('verdicting')
        setShowTint(true)
      }, POST_JURORS_PAUSE + SPLIT_DURATION)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }

    const t = setTimeout(() => {
      setPhase('verdicting')
      setShowTint(true)
    }, POST_JURORS_PAUSE)
    return () => clearTimeout(t)
  }, [arrivedCount, isContested, totalEntries])

  // ── Phase 5: verdicting → complete ───────────────────
  useEffect(() => {
    if (phase !== 'verdicting') return
    const t = setTimeout(() => setPhase('complete'), VERDICT_TO_COMPLETE)
    return () => clearTimeout(t)
  }, [phase])

  const inVerdict = phase === 'verdicting' || phase === 'complete'

  return (
    <div className={styles.root}>

      {/* Full-screen tint — consensus verdict colour at 4% opacity */}
      {!isContested && (
        <div
          className={[styles.screenTint, showTint ? styles.screenTintVisible : ''].join(' ')}
          style={{ '--tint': TINT_COLOR[caseData.officialVerdict] }}
          aria-hidden="true"
        />
      )}

      {/* ── Sticky header ──────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Return to archive">
          ← Archive
        </button>
        <span className={styles.caseNumber}>{caseData.number}</span>
        <span
          className={[
            styles.chamberLabel,
            phase !== 'entering' ? styles.chamberLabelVisible : '',
          ].join(' ')}
        >
          VERDICT CHAMBER
        </span>
      </header>

      {/* ── Scrollable content ─────────────────────────── */}
      <div className={styles.content}>

        {/* Screenshot — expands and annotates on entry */}
        <AnnotatedScreenshot
          src={caseData.screenshot}
          annotations={annotations}
          annotationsVisible={phase !== 'entering'}
          pulsingLens={pulsingLens}
          expanded={phase !== 'entering'}
          aspectRatio={caseData.screenshotAspect ?? '4/3'}
          objectPosition={caseData.screenshotPosition ?? 'top center'}
        />

        {/* Case identity — category revealed here for the first time */}
        <div className={styles.caseIdentity}>
          <div className={styles.caseTitleRow}>
            <h1 className={styles.caseTitle}>{caseData.title}</h1>
            <span
              className={[
                styles.categoryTag,
                phase !== 'entering' ? styles.categoryTagVisible : '',
              ].join(' ')}
            >
              {caseData.category}
            </span>
          </div>
          <p className={styles.caseContext}>{caseData.context}</p>
        </div>

        {/* Section divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* ── The Deliberation ─────────────────────────── */}
        <section className={styles.deliberation} aria-label="Jury deliberation">

          {/* Header: label + verdict dots */}
          <div className={styles.deliberationHeader}>
            <span className={styles.deliberationLabel}>The Jury</span>

            <div className={styles.jurorDots} aria-hidden="true">
              {jurorRulings.map((ruling, i) => (
                <div
                  key={i}
                  className={[
                    styles.jurorDot,
                    i < arrivedCount ? styles[`jurorDot_${ruling.ruling}`] : '',
                  ].filter(Boolean).join(' ')}
                />
              ))}
            </div>
          </div>

          {/* Juror entries — tight stack, shared left-rail effect */}
          <div className={styles.jurorList}>
            {jurorRulings.map((ruling, i) => (
              <JurorEntry
                key={ruling.juror}
                juror={JUROR_BY_LENS[ruling.juror]}
                ruling={ruling.ruling}
                reasoning={ruling.reasoning}
                arrived={i < arrivedCount}
                splitOffset={splitActive ? SPLIT_OFFSET[ruling.ruling] : 0}
              />
            ))}

            {/* The sixth juror — the investigator's own ruling joins the record,
                and shifts with its camp when the jury splits */}
            {hasInvestigator && (
              <JurorEntry
                juror={{ lens: 'you', title: 'The Investigator' }}
                ruling={investigatorRuling}
                reasoning={submission.writtenRuling}
                arrived={arrivedCount >= totalEntries}
                splitOffset={splitActive ? SPLIT_OFFSET[investigatorRuling] : 0}
                isInvestigator
              />
            )}
          </div>

        </section>

        {/* ── Final verdict block ───────────────────────── */}
        {inVerdict && (
          <>
            <div className={styles.divider} aria-hidden="true" />
            <FinalVerdictBlock
              caseData={caseData}
              submission={submission}
              showNext={phase === 'complete'}
              onNext={onNext}
              isFinalCase={isFinalCase}
            />
          </>
        )}

        {/* Bottom breathing room */}
        <div className={styles.bottomSpacer} />

      </div>
    </div>
  )
}
