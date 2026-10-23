import { useState } from 'react'
import {
  perspectivesFor,
  perspectiveFrames,
  spatialPositions,
  PERSPECTIVE_NAMES,
} from '../../investigation/perspectives'
import ExhibitSnapshot from './ExhibitSnapshot'
import styles from './Perspectives.module.css'

export default function Perspectives({ record, caseData, onBack }) {
  const [lens, setLens] = useState('hierarchy'),
    [selected, setSelected] = useState(null),
    [reveal, setReveal] = useState(50)
  const frames = perspectiveFrames(record, caseData)
  const [frameId, setFrameId] = useState(
    frames.find((frame) => frame.marks.length)?.id ?? frames[0]?.id,
  )
  if (caseData.caseStatus === 'sealed' || !record.secondJudgment)
    return (
      <div className={styles.root}>
        <h1>This record has no outside interpretation.</h1>
        <button onClick={onBack}>Return to your record</button>
      </div>
    )
  const frame = frames.find((item) => item.id === frameId) ?? frames[0]
  const material = perspectivesFor(caseData.id),
    conflict = material.contradictions.find((item) => item.id === selected)
  const positions = spatialPositions(caseData.id, frame)
  const shown = positions.filter((item) =>
    conflict
      ? conflict.perspectives.includes(item.lens)
      : lens === 'all' || item.lens === lens,
  )
  // Shared evidence gets one boundary, numbered against the reading text.
  const regions = []
  shown.forEach((item, index) => {
    if (!item.target) return
    const same = regions.find((region) => ['left', 'top', 'width', 'height'].every((key) => region.target[key] === item.target[key]))
    if (same) same.numbers.push(index + 1)
    else regions.push({ target: item.target, numbers: [index + 1] })
  })
  const matchingFrame = conflict && frames.find((candidate) => spatialPositions(caseData.id, candidate).some((item) => conflict.perspectives.includes(item.lens) && item.target))
  return (
    <div className={styles.root}>
      <header>
        <button onClick={onBack}>← Your reflection</button>
        <span>{caseData.number} / AUTHORED PERSPECTIVES</span>
      </header>
      <h1>
        Same evidence.
        <br />
        <em>Different attention.</em>
      </h1>
      <p className={styles.intro}>
        These are authored critical readings, not expert research or a correct
        answer. Select a captured state, then inspect what each perspective
        attends to.
      </p>
      <div className={styles.toolbar}>
        <label>
          Exhibit state
          <select
            aria-label="Perspective exhibit state"
            value={frameId}
            onChange={(e) => setFrameId(e.target.value)}
          >
            {frames.map((item, index) => (
              <option key={item.id} value={item.id}>
                {item.look} / {item.label} / {index + 1}
              </option>
            ))}
          </select>
        </label>
        <div role="group" aria-label="Authored perspectives">
          {Object.entries(PERSPECTIVE_NAMES).map(([key, name]) => (
            <button
              key={key}
              aria-pressed={lens === key && !selected}
              onClick={() => {
                setLens(key)
                setSelected(null)
              }}
            >
              {name}
            </button>
          ))}
          <button
            aria-pressed={lens === 'all' && !selected}
            onClick={() => {
              setLens('all')
              setSelected(null)
            }}
          >
            All layers
          </button>
        </div>
      </div>
      <div className={styles.layout}>
        <section>
          <div className={styles.layerKey} aria-hidden="true">
            <span>Your evidence / numbers</span>
            <span>Authored readings / R</span>
          </div>
          <div className={styles.comparison}>
            {frame.image ? (
              <img src={frame.image} alt={caseData.screenshotDescription} />
            ) : (
              <ExhibitSnapshot snapshot={frame} />
            )}
            <div
              className={styles.layer}
              style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
              aria-hidden="true"
            >
              {frame.marks.map((mark, index) => (
                <span
                  key={mark.id}
                  className={
                    mark.width != null
                      ? styles.visitorRegion
                      : styles.visitorPoint
                  }
                  style={{
                    left: mark.x + '%',
                    top: mark.y + '%',
                    width: mark.width != null ? mark.width + '%' : undefined,
                    height: mark.height != null ? mark.height + '%' : undefined,
                  }}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <div
              className={styles.layer}
              style={{ clipPath: `inset(0 0 0 ${reveal}%)` }}
              aria-hidden="true"
            >
              {regions.map((item) => (
                  <span
                    key={item.numbers.join('-')}
                    className={`${styles.authoredRegion} ${selected ? styles.highlight : ''}`}
                    style={{
                      left: item.target.left + '%',
                      top: item.target.top + '%',
                      width: item.target.width + '%',
                      height: item.target.height + '%',
                    }}
                  >
                    <b>R{item.numbers.join(' · R')}</b>
                  </span>
                ))}
            </div>
            <div
              className={styles.divider}
              style={{ left: reveal + '%' }}
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={(e) => {
                if (e.buttons !== 1) return
                const r = e.currentTarget.parentElement.getBoundingClientRect()
                setReveal(
                  Math.max(
                    0,
                    Math.min(100, ((e.clientX - r.left) / r.width) * 100),
                  ),
                )
              }}
            >
              <span aria-hidden="true">↔</span>
            </div>
          </div>
          <label className={styles.slider}>
            Your marks / authored layers
            <input
              type="range"
              min="0"
              max="100"
              value={reveal}
              aria-label="Perspective reveal divider"
              onChange={(e) => setReveal(Number(e.target.value))}
            />
          </label>
          <p className={styles.caption}>
            {frame.look} / {frame.label}. All visible marks share this exact
            captured state.
          </p>
          <details>
            <summary>
              Your evidence in this state ({frame.marks.length})
            </summary>
            {frame.marks.map((mark) => (
              <p key={mark.id}>{mark.note}</p>
            ))}
            {!frame.marks.length && (
              <p>No visitor annotation belongs to this state.</p>
            )}
          </details>
        </section>
        <aside>
          <h2>
            {selected
              ? 'A curated disagreement'
              : lens === 'all'
                ? 'Five readings'
                : PERSPECTIVE_NAMES[lens]}
          </h2>
          {conflict && (
            <>
              <h3>{conflict.element}</h3>
              <p>{conflict.question}</p>
              <p className={styles.uncertainty}>{conflict.uncertainty}</p>
            </>
          )}
          {shown.map((item, index) => (
            <article key={item.id}>
              <h3><span className={styles.readingNumber}>R{index + 1}</span> {PERSPECTIVE_NAMES[item.lens]}</h3>
              <p>{item.reading}</p>
              <small>
                {item.target
                  ? 'Evidence highlighted in the exhibit.'
                  : 'This region is not visible in the selected state. Choose another captured state to inspect it spatially.'}
              </small>
            </article>
          ))}
          {matchingFrame && !shown.some((item) => item.target) && (
            <button className={styles.findState} onClick={() => setFrameId(matchingFrame.id)}>
              Show this evidence in {matchingFrame.look.toLowerCase()} / {matchingFrame.label} →
            </button>
          )}
          <section className={styles.contradictions}>
            <h2>Where readings diverge</h2>
            {material.contradictions.length ? (
              material.contradictions.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={selected === item.id}
                  onClick={() => {
                    setSelected(selected === item.id ? null : item.id)
                    setReveal(35)
                  }}
                >
                  {item.element}
                  <span>{item.question}</span>
                </button>
              ))
            ) : (
              <p>No curated contradiction is entered for this case.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
