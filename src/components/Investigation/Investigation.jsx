import { useEffect, useRef, useState } from 'react'
import { INVESTIGATIONS } from '../../investigation/capabilities'
import { availableStages, evidenceReady } from '../../investigation/engine'
import EvidenceMap from '../CaseFile/EvidenceMap'
import { EXHIBIT_VIEWS } from './exhibitViews'
import ExhibitSnapshot from './ExhibitSnapshot'
import LookEvidence from './LookEvidence'
import Judgment from './Judgment'
import Reflection from './Reflection'
import styles from './Investigation.module.css'

const LABELS = {
  FIRST_LOOK: 'First look',
  FIRST_JUDGMENT: 'First judgment',
  CONTEXT: 'Context',
  SECOND_LOOK: 'Second look',
  SECOND_JUDGMENT: 'Second judgment',
  REFLECTION: 'Reflection',
}
export default function Investigation({
  record: currentRecord,
  caseData,
  apply,
  error,
  onBack,
  onPanel,
  onLegacy,
  onNext,
  onReport,
  history = [],
}) {
  const [reviewId, setReviewId] = useState(null)
  const record =
    history.find((attempt) => attempt.id === reviewId) ?? currentRecord
  const [mode, setMode] = useState('explore'),
    [confirmRestart, setConfirmRestart] = useState(false),
    [selectedContext, setSelectedContext] = useState(null)
  const [editorTarget, setEditorTarget] = useState(null)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 801px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)')
    const resize = () => setWide(media.matches)
    media.addEventListener('change', resize)
    return () => media.removeEventListener('change', resize)
  }, [])
  const captureRequest = useRef(0)
  const live = useRef(null),
    heading = useRef(null),
    modeButtons = useRef({})
  const config = INVESTIGATIONS[caseData.id],
    Exhibit = EXHIBIT_VIEWS[config.exhibit.id],
    stage = record.stage
  const first = stage === 'FIRST_LOOK' || stage === 'FIRST_JUDGMENT'
  const look = first ? record.firstLook : record.secondLook
  const sealed = Boolean(first ? record.firstJudgment : record.secondJudgment),
    complete = stage === 'COMPLETE'
  const snapshot = look.snapshots?.[look.activeSnapshotId]
  const send = (event) => apply(caseData.id, event)
  const frames = Object.values(look.snapshots ?? {}).filter((item) =>
    look.marks.some((mark) => mark.frameId === item.id),
  )
  useEffect(() => {
    captureRequest.current++
    heading.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [stage, record.id])
  function go(target) {
    setMode('explore')
    send({ type: 'GO', stage: target })
  }
  async function switchMode(next) {
    const request = ++captureRequest.current
    if (next === 'mark') {
      await document.fonts.ready
      if (request !== captureRequest.current) return
      const bounds = live.current?.getBoundingClientRect()
      if (!bounds) return
      const targets = [
        ...live.current.querySelectorAll(
          'input,select,h2,[data-evidence-region]',
        ),
      ]
        .filter((el) => el.offsetHeight)
        .map((el) => {
          const r = el.getBoundingClientRect(),
            left = Math.max(0, r.left - bounds.left),
            top = Math.max(0, r.top - bounds.top)
          return {
            id: el.dataset.evidenceRegion ?? el.id ?? '',
            label:
              el.labels?.[0]?.textContent ??
              el.querySelector('h2,h3')?.textContent ??
              el.textContent.slice(0, 60) ??
              'Interface region',
            x: Math.min(100, ((left + r.width / 2) / bounds.width) * 100),
            y: Math.min(100, ((top + r.height / 2) / bounds.height) * 100),
            left: (left / bounds.width) * 100,
            top: (top / bounds.height) * 100,
            width:
              (Math.min(r.width, bounds.width - left) / bounds.width) * 100,
            height:
              (Math.min(r.height, bounds.height - top) / bounds.height) * 100,
          }
        })
      const state = JSON.parse(JSON.stringify(look.exhibit))
      const existing = Object.values(look.snapshots ?? {}).find(
        (item) =>
          item.width === Math.round(bounds.width) &&
          item.height === Math.round(bounds.height) &&
          JSON.stringify(item.exhibit) === JSON.stringify(state),
      )
      const capture = existing ?? {
        id: crypto.randomUUID(),
        exhibitId: config.exhibit.id,
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
        exhibit: state,
        label: state.screen,
        targets,
      }
      if (!send({ type: 'CAPTURE', snapshot: capture })) return
    }
    setMode(next)
    requestAnimationFrame(() =>
      modeButtons.current[next]?.focus({ preventScroll: true }),
    )
  }
  const observation = stage === 'FIRST_LOOK' || stage === 'SECOND_LOOK'
  const interactive = !first || config.firstLook === 'interactive'
  const marksChange = (marks) =>
    send({
      type: first ? 'FIRST_MARKS' : 'SECOND_MARKS',
      marks: interactive
        ? [
            ...look.marks.filter((mark) => mark.frameId !== snapshot.id),
            ...marks,
          ]
        : marks,
    })
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <button onClick={onBack}>← Case index</button>
        <span>
          {caseData.number} / {config.sealed ? 'SEALED FINALE' : 'SECOND LOOK'}
        </span>
        <button
          disabled={Boolean(reviewId)}
          onClick={() => setConfirmRestart(!confirmRestart)}
        >
          {confirmRestart ? 'Cancel restart' : 'New attempt'}
        </button>
      </header>
      {reviewId && (
        <button className={styles.textButton} onClick={() => setReviewId(null)}>
          Return to current attempt
        </button>
      )}
      {confirmRestart && (
        <div className={styles.restart}>
          <p>
            {complete
              ? 'Your completed attempt stays in the record. Start a fresh investigation?'
              : 'Discard this unfinished attempt? Earlier completed attempts stay saved.'}
          </p>
          <button
            onClick={() => {
              if (apply(caseData.id, { type: 'RESTART' }, true)) {
                setConfirmRestart(false)
                setMode('explore')
                setSelectedContext(null)
              }
            }}
          >
            Confirm new attempt
          </button>
        </div>
      )}
      {error && (
        <p className={styles.alert} role="alert">
          {error}
        </p>
      )}
      <details className={styles.stageDisclosure} open={wide}>
      <summary>{String(Object.keys(LABELS).indexOf(complete ? 'REFLECTION' : stage) + 1).padStart(2, '0')} / 06 · {complete ? 'Complete' : LABELS[stage]} <span className={styles.showStages}>All stages +</span><span className={styles.hideStages}>Close stages −</span></summary>
      <nav className={styles.stageNav} aria-label="Investigation stages">
        {Object.entries(LABELS).map(([key, label], index) => (
          <button
            key={key}
            aria-current={
              stage === key || (complete && key === 'REFLECTION')
                ? 'step'
                : undefined
            }
            disabled={complete || !availableStages(record).includes(key)}
            onClick={() => go(key)}
          >
            <span>0{index + 1}</span>
            {label}
          </button>
        ))}
      </nav>
      </details>
      <div className={styles.titleRow}>
        <div>
          {(observation || stage === 'CONTEXT' || stage === 'REFLECTION' || complete) && <p className={styles.caseIdentity}>{caseData.title}</p>}
        <h1 ref={heading} tabIndex="-1">
          {complete || stage === 'REFLECTION'
            ? 'Two looks. Your record.'
            : stage === 'FIRST_LOOK'
              ? 'What catches your attention?'
              : stage === 'CONTEXT'
                ? 'There is more to this interface.'
                : stage === 'SECOND_LOOK'
                  ? 'Try what the image cannot show.'
                  : caseData.title}
        </h1>
        </div>
        <p className={styles.saved}>
          Saved locally
        </p>
      </div>
      {observation && (
        <>
          {interactive && (
            <div
              className={styles.modeRail}
              role="group"
              aria-label="Exhibit interaction mode"
            >
              <button
                ref={(el) => { modeButtons.current.explore = el }}
                disabled={sealed}
                aria-pressed={mode === 'explore' && !sealed}
                onClick={() => switchMode('explore')}
              >
                Explore
              </button>
              <button
                ref={(el) => { modeButtons.current.mark = el }}
                aria-pressed={mode === 'mark' || sealed}
                onClick={() => !sealed && switchMode('mark')}
              >
                Mark
              </button>
              <p>
                {sealed
                  ? 'This evidence is sealed.'
                  : mode === 'explore'
                    ? 'Try the exhibit, then mark what stands out.'
                    : 'Select an area, then add a short note.'}
              </p>
              <a href="#look-inspector" onClick={(e) => {
                e.preventDefault()
                document.getElementById('look-inspector')?.focus()
              }}>Your findings ↓</a>
            </div>
          )}
          <div className={styles.workspace}>
            <div className={styles.liveColumn}>
              {sealed ? (
                <LookEvidence key={stage} look={look} caseData={caseData} />
              ) : !interactive ? (
                <EvidenceMap
                  src={caseData.screenshot}
                  aspectRatio={caseData.screenshotAspect}
                  description={caseData.screenshotDescription}
                  evidenceTargets={caseData.evidenceTargets}
                  marks={look.marks}
                  onChange={marksChange}
                  neutral
                  maxMarks={Infinity}
                  heading="Your first reading"
                  editorTarget={editorTarget}
                />
              ) : mode === 'explore' ? (
                <>
                  <div ref={live} className={styles.liveExhibit}>
                    <Exhibit
                      state={look.exhibit}
                      onAction={(action) => send({ type: 'EXHIBIT', action })}
                    />
                  </div>
                  <p className={styles.hint}>
                    Authored simulation / no real service, money, message or
                    purchase.
                  </p>
                </>
              ) : snapshot ? (
                <EvidenceMap
                  key={snapshot.id}
                  exhibit={<ExhibitSnapshot snapshot={snapshot} />}
                  description={`${caseData.title}, captured ${snapshot.label} state. Named regions are available below.`}
                  evidenceTargets={snapshot.targets ?? []}
                  frameId={snapshot.id}
                  neutral
                  maxMarks={Infinity}
                  heading="Mark this captured state"
                  editorTarget={editorTarget}
                  marks={look.marks.filter(
                    (mark) => mark.frameId === snapshot.id,
                  )}
                  onChange={marksChange}
                />
              ) : (
                <p>Explore the exhibit, then choose Mark to capture it.</p>
              )}
              {config.captureNote && mode === 'mark' && (
                <p className={styles.hint}>{config.captureNote}</p>
              )}
              {frames.length > 1 && (
                <div className={styles.savedFrames}>
                  <h3>Marked exhibit states</h3>
                  {frames.map((item, index) => (
                    <button
                      key={item.id}
                      aria-pressed={snapshot?.id === item.id && mode === 'mark'}
                      onClick={() => {
                        send({ type: 'SELECT_SNAPSHOT', id: item.id })
                        setMode('mark')
                      }}
                    >
                      State {index + 1} / {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <aside className={styles.inspector} id="look-inspector" tabIndex="-1">
              <div className={styles.inspectorHead}><h2>Your findings</h2></div>
              {(!interactive || mode === 'explore') && <p>{first ? config.instruction : config.task}</p>}
              {interactive && mode === 'explore' && !sealed && <button className={styles.textButton} onClick={() => switchMode('mark')}>Freeze this view to mark →</button>}
              <div ref={setEditorTarget} className={styles.editorSlot} />
              {!first && (
                <details className={styles.firstReference}>
                  <summary>Your first evidence / sealed</summary>
                  <LookEvidence look={record.firstLook} caseData={caseData} />
                  <blockquote>{record.firstJudgment.writtenRuling}</blockquote>
                </details>
              )}
              <button
                className={styles.primary}
                disabled={!evidenceReady(look.marks)}
                onClick={() => send({ type: 'NEXT' })}
              >
                {first ? 'Make first judgment →' : 'Make second judgment →'}
              </button>
              {!sealed && (
                <p className={styles.readiness} role="status">
                  {evidenceReady(look.marks)
                    ? 'Ready for your judgment.'
                    : look.marks.length
                      ? 'Describe each finding to continue.'
                      : 'One finding and a short note are enough.'}
                </p>
              )}
              <details className={styles.guidance}><summary>How this look works</summary><p>One described point or region is enough. Classification is optional. {first ? 'Context opens after you seal your first judgment.' : 'A different verdict is optional; both judgments stay on record.'}</p></details>
              {first && onLegacy && (
                <button className={styles.textButton} onClick={onLegacy}>
                  Read your earlier single-look ruling
                </button>
              )}
            </aside>
          </div>
        </>
      )}
      {(stage === 'FIRST_JUDGMENT' || stage === 'SECOND_JUDGMENT') && (
        <div className={styles.workspace}>
          <div className={styles.reference}>
            <details className={styles.judgmentEvidence} open={wide}>
            <summary>Review your {look.marks.length} saved finding{look.marks.length === 1 ? '' : 's'} ↓</summary>
            <LookEvidence key={stage} look={look} caseData={caseData} />
            </details>
          </div>
          <Judgment
            second={!first}
            sealed={sealed}
            value={
              (first ? record.firstJudgment : record.secondJudgment) ??
              look.draft
            }
            onChange={(patch) => send({ type: 'DRAFT', patch })}
            onSubmit={() =>
              send({
                type: sealed
                  ? 'NEXT'
                  : first
                    ? 'SUBMIT_FIRST'
                    : 'SUBMIT_SECOND',
              })
            }
          />
        </div>
      )}
      {stage === 'CONTEXT' && (
        <div className={styles.contextLayout}>
          <div className={styles.contextExhibit}>
            <LookEvidence look={record.firstLook} caseData={caseData} />
            <p>
              Your first map is preserved. Context adds information; it does not
              correct your judgment.
            </p>
            <details className={styles.firstReference}>
              <summary>Read your sealed first judgment</summary>
              <p>{record.firstJudgment.writtenRuling}</p>
            </details>
          </div>
          <section className={styles.documents}>
            <h2>Open the case material.</h2>
            <p>Each document names where its claims come from.</p>
            {config.context.map((item, index) => (
              <div className={styles.document} key={item.id}>
                <button
                  aria-expanded={selectedContext === item.id}
                  onClick={() => {
                    if (send({ type: 'REVEAL', id: item.id }))
                      setSelectedContext(
                        selectedContext === item.id ? null : item.id,
                      )
                  }}
                >
                  <span>
                    0{index + 1} / {item.kind}
                  </span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.provenance}
                    {record.contextRevealed.includes(item.id) ? ' / read' : ''}
                  </small>
                </button>
                {selectedContext === item.id && (
                  <div className={styles.documentBody}>
                    <p>{item.body}</p>
                    <p className={styles.connection}>{item.connection}</p>
                  </div>
                )}
              </div>
            ))}
            <button
              className={styles.primary}
              disabled={
                !config.context.every((item) =>
                  record.contextRevealed.includes(item.id),
                )
              }
              onClick={() => {
                setMode('explore')
                send({ type: 'NEXT' })
              }}
            >
              Take a second look →
            </button>
            <p className={styles.hint}>
              Open all {config.context.length} documents to continue. No verdict
              is expected to change.
            </p>
          </section>
        </div>
      )}
      {(stage === 'REFLECTION' || complete) && (
        <Reflection
          record={record}
          caseData={caseData}
          config={config}
          onNote={(value) => send({ type: 'REFLECTION_NOTE', value })}
          onComplete={() => send({ type: 'COMPLETE' })}
          onPanel={() => onPanel(record)}
          onNext={onNext}
          onReport={onReport}
        />
      )}
      {history.length > 0 && (
        <details className={styles.attempts}>
          <summary>
            {history.length} earlier completed attempt
            {history.length === 1 ? '' : 's'} preserved
          </summary>
          {history.map((attempt, index) => (
            <button key={attempt.id} onClick={() => setReviewId(attempt.id)}>
              Read attempt {index + 1} /{' '}
              {new Date(attempt.completedAt).toLocaleDateString('en-GB')}
            </button>
          ))}
        </details>
      )}
      <footer className={styles.footer}>
        <span>
          {caseData.title} / {config.sealed ? 'Sealed record' : 'Second Look'}
        </span>
        <span>
          No score. No correct answer. Your record stays in this browser.
        </span>
      </footer>
    </div>
  )
}
