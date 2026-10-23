import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  rectangleFromPoints,
  normalizeGeometry,
} from '../../utils/evidenceGeometry'
import styles from './EvidenceMap.module.css'

const EVIDENCE_LENSES = [
  { key: 'hierarchy', label: 'Hierarchy', color: '#e8a33d' },
  { key: 'accessibility', label: 'Access', color: '#7fb7ff' },
  { key: 'usability', label: 'Task', color: '#88c999' },
  { key: 'trust', label: 'Trust', color: '#c79be8' },
  { key: 'delight', label: 'Feeling', color: '#ee8f9a' },
]

const lensByKey = Object.fromEntries(
  EVIDENCE_LENSES.map((lens) => [lens.key, lens]),
)

function Editor({ target, children }) {
  const content = <div className={styles.editor}>{children}</div>
  return target ? createPortal(content, target) : content
}

export default function EvidenceMap({
  src,
  aspectRatio = '4/3',
  objectPosition = 'top center',
  description,
  evidenceTargets = [],
  marks,
  onChange,
  neutral = false,
  exhibit = null,
  frameId,
  maxMarks = 4,
  heading = 'Look before you judge.',
  editorTarget = null,
}) {
  const Viewer = exhibit ? 'div' : 'button'
  const viewerRef = useRef(null)
  const cursorRef = useRef(null)
  const helpId = useId()
  const [tool, setTool] = useState('point')
  const [drag, setDrag] = useState(null)
  const [selected, setSelected] = useState(null)
  const dragStart = useRef(null)
  const noteRefs = useRef({})
  const markRefs = useRef({})
  const pendingPointerFocus = useRef(null)
  const [lens, setLens] = useState(neutral ? null : 'hierarchy')
  const activeLens = lensByKey[lens] ?? {
    label: 'Unclassified',
    color: 'var(--amber)',
  }
  const [keyboardPoint, setKeyboardPoint] = useState({ x: 50, y: 50 })
  const [keyboardActive, setKeyboardActive] = useState(false)
  const [pointerPoint, setPointerPoint] = useState(null)
  useEffect(() => {
    if (keyboardActive) cursorRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
  }, [keyboardPoint, keyboardActive])

  const isPortrait = (() => {
    const [width, height] = aspectRatio.split('/').map(Number)
    return !Number.isNaN(width) && !Number.isNaN(height) && height > width
  })()

  function addMark(x, y, region = {}) {
    if (marks.length >= maxMarks) return
    const id = crypto.randomUUID()
    onChange([
      ...marks,
      { id, x, y, lens, note: '', ...(frameId ? { frameId } : {}), ...region },
    ])
    setSelected(id)
    if (dragStart.current) pendingPointerFocus.current = id
    else requestAnimationFrame(() => noteRefs.current[id]?.focus({ preventScroll: window.innerWidth > 800 }))
  }

  function pointFromEvent(event) {
    if (!viewerRef.current) return null
    const bounds = viewerRef.current.getBoundingClientRect()
    return {
      x: Math.min(
        98,
        Math.max(2, ((event.clientX - bounds.left) / bounds.width) * 100),
      ),
      y: Math.min(
        98,
        Math.max(2, ((event.clientY - bounds.top) / bounds.height) * 100),
      ),
    }
  }

  function startMark(event) {
    if (event.button !== 0) return
    setKeyboardActive(false)
    dragStart.current = pointFromEvent(event)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function finishMark(event) {
    if (!dragStart.current) return
    const end = pointFromEvent(event)
    const region = rectangleFromPoints(dragStart.current, end)
    const bounds = viewerRef.current.getBoundingClientRect()
    const hit = region.width < 1 && region.height < 1 && [...marks].reverse().find((mark) =>
      mark.width != null
        ? end.x >= mark.x && end.x <= mark.x + mark.width && end.y >= mark.y && end.y <= mark.y + mark.height
        : Math.hypot((end.x - mark.x) * bounds.width / 100, (end.y - mark.y) * bounds.height / 100) < 22,
    )
    if (hit) {
      setSelected(hit.id)
      pendingPointerFocus.current = hit.id
      dragStart.current = null
      setDrag(null)
      setPointerPoint(null)
      return
    }
    if (tool === 'region' && region.width > 1 && region.height > 1)
      addMark(region.x, region.y, {
        width: region.width,
        height: region.height,
      })
    else
      addMark(
        end.x,
        end.y,
        tool === 'region'
          ? {
              width: Math.min(18, 100 - end.x),
              height: Math.min(12, 100 - end.y),
            }
          : {},
      )
    dragStart.current = null
    setDrag(null)
    setPointerPoint(null)
  }

  function trackPointer(event) {
    if (dragStart.current && tool === 'region')
      setDrag(rectangleFromPoints(dragStart.current, pointFromEvent(event)))
    if (marks.length >= maxMarks || event.pointerType === 'touch') return
    setPointerPoint(pointFromEvent(event))
  }

  function handleViewerKeyDown(event) {
    const movement = event.shiftKey ? 1 : 5
    const delta = {
      ArrowLeft: [-movement, 0],
      ArrowRight: [movement, 0],
      ArrowUp: [0, -movement],
      ArrowDown: [0, movement],
    }[event.key]

    if (delta) {
      event.preventDefault()
      setKeyboardActive(true)
      setKeyboardPoint((point) => ({
        x: Math.min(98, Math.max(2, point.x + delta[0])),
        y: Math.min(98, Math.max(2, point.y + delta[1])),
      }))
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      addMark(
        keyboardPoint.x,
        keyboardPoint.y,
        tool === 'region'
          ? {
              width: Math.min(18, 100 - keyboardPoint.x),
              height: Math.min(12, 100 - keyboardPoint.y),
            }
          : {},
      )
    }
  }

  function updateMark(id, patch) {
    onChange(
      marks.map((mark) =>
        mark.id === id ? normalizeGeometry(mark, patch) : mark,
      ),
    )
  }

  function removeMark(id) {
    const remaining = marks.filter((mark) => mark.id !== id)
    const index = marks.findIndex((mark) => mark.id === id)
    const next = remaining[Math.min(index, remaining.length - 1)]
    onChange(remaining)
    setSelected(next?.id ?? null)
    requestAnimationFrame(() => {
      if (next) noteRefs.current[next.id]?.focus()
      else viewerRef.current?.focus()
    })
  }

  return (
    <section className={styles.root} aria-label="Build your evidence map">
      <div className={styles.mapHeader}>
        <div>
          <h2 className={styles.eyebrow}>{heading}</h2>
          {!editorTarget && <p className={styles.instruction}>
            Choose what matters, then mark the part of the interface that
            supports your judgment.
          </p>}
        </div>
        <span className={styles.count}>
          {marks.length}
          {Number.isFinite(maxMarks)
            ? ` of ${maxMarks} markers`
            : marks.length === 1
              ? ' finding'
              : ' findings'}
        </span>
      </div>

      <div
        className={styles.tools}
        role="group"
        aria-label="Evidence instrument"
      >
        <span>INSTRUMENT</span>
        <button
          aria-pressed={tool === 'point'}
          onClick={() => setTool('point')}
        >
          ＋ Point
        </button>
        <button
          aria-pressed={tool === 'region'}
          onClick={() => setTool('region')}
        >
          ▧ Region
        </button>
        <span>
          {exhibit
            ? 'Frozen exhibit · Explore to interact'
            : 'Static exhibit · mark to inspect'}
        </span>
      </div>
      {!neutral && (
        <>
          <p className={styles.lensPrompt}>What are you looking for?</p>
          <div
            className={styles.lenses}
            role="group"
            aria-label="What matters in this interface"
          >
            {EVIDENCE_LENSES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setLens(item.key)}
                aria-pressed={lens === item.key}
                className={`${styles.lens} ${lens === item.key ? styles.lensActive : ''}`}
                style={{ '--lens-color': item.color }}
              >
                <span className={styles.lensDot} />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
      <div
        className={`${styles.viewerWrap} ${isPortrait ? styles.portraitWrap : ''}`}
        style={exhibit ? { maxWidth: 808, margin: '0 auto' } : undefined}
      >
        <Viewer
          ref={viewerRef}
          type={exhibit ? undefined : 'button'}
          role={exhibit ? 'button' : undefined}
          tabIndex={exhibit ? 0 : undefined}
          onPointerMove={trackPointer}
          onPointerLeave={() => setPointerPoint(null)}
          onPointerDown={startMark}
          onPointerUp={finishMark}
          onClick={() => {
            // Finish the native click before scrolling to an observation. On
            // touch, scrolling during pointerup can retarget that click and
            // steal focus from the note we just selected.
            const id = pendingPointerFocus.current
            pendingPointerFocus.current = null
            if (id) requestAnimationFrame(() => noteRefs.current[id]?.focus({ preventScroll: window.innerWidth > 800 }))
          }}
          onPointerCancel={() => {
            dragStart.current = null
            pendingPointerFocus.current = null
            setDrag(null)
          }}
          onKeyDown={handleViewerKeyDown}
          onBlur={() => setKeyboardActive(false)}
          className={styles.viewer}
          style={{ '--active-lens-color': activeLens.color, touchAction: tool === 'region' ? 'none' : 'pan-y' }}
          aria-label={`Mark ${activeLens.label.toLowerCase()} evidence on the interface. Use arrow keys to move the evidence cursor and Enter to place a mark.`}
          aria-describedby={helpId}
          disabled={marks.length >= maxMarks}
        >
          {exhibit ?? (
            <img
              src={src}
              alt={description ?? 'Interface under investigation'}
              className={styles.image}
              style={{ aspectRatio, objectPosition }}
              draggable={false}
            />
          )}
          <span className={styles.vignette} aria-hidden="true" />
          {pointerPoint && marks.length < maxMarks && (
            <span
              className={styles.pointerPreview}
              style={{ left: pointerPoint.x + '%', top: pointerPoint.y + '%' }}
              aria-hidden="true"
            >
              +
            </span>
          )}
          {keyboardActive && marks.length < maxMarks && (
            <span
              ref={cursorRef}
              className={styles.keyboardCursor}
              style={{
                left: `${keyboardPoint.x}%`,
                top: `${keyboardPoint.y}%`,
              }}
              aria-hidden="true"
            />
          )}
          {drag && (
            <span
              className={styles.region}
              style={{
                left: drag.x + '%',
                top: drag.y + '%',
                width: drag.width + '%',
                height: drag.height + '%',
              }}
              aria-hidden="true"
            />
          )}
          {marks.map((mark, index) => (
            <span
              key={mark.id}
              ref={(element) => { markRefs.current[mark.id] = element }}
              className={`${mark.width != null ? styles.region : styles.mark} ${selected === mark.id ? styles.selectedMark : ''}`}
              style={{
                left: `${mark.x}%`,
                top: `${mark.y}%`,
                width: mark.width != null ? mark.width + '%' : undefined,
                height: mark.height != null ? mark.height + '%' : undefined,
                '--mark-color': lensByKey[mark.lens]?.color ?? 'var(--amber)',
              }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
          <span className={styles.exhibitLabel}>
            {tool === 'region'
              ? 'Drag to select a region'
              : 'Point to place evidence'}
          </span>
        </Viewer>
      </div>

      <details className={styles.inputInstructions}>
      <summary>Placement help / keyboard & touch</summary>
      <p className={styles.inputHelp} id={helpId}>
        {exhibit && description ? `${description} ` : ''}
        Point or drag on the exhibit. Keyboard: arrows to move, Enter to mark.
        Shift + arrow for precision. Select an observation below to edit its
        position. Touch: Point allows swiping to scroll; Region reserves dragging
        for selection.
      </p>
      </details>
      <details className={styles.accessibleTools}>
        <summary>Choose a named region instead</summary>
        <div className={styles.targetList} aria-label="Named interface regions">
          {evidenceTargets.map((target) => (
            <button
              key={target.label}
              type="button"
              className={styles.target}
              onClick={() =>
                addMark(
                  target.x,
                  target.y,
                  tool === 'region'
                    ? {
                        width: Math.min(18, 100 - target.x),
                        height: Math.min(12, 100 - target.y),
                      }
                    : {},
                )
              }
              disabled={marks.length >= maxMarks}
            >
              {target.label}
            </button>
          ))}
        </div>
      </details>

      <Editor target={editorTarget}>
      <p className={styles.inputHelp} role="status">
        {marks.length
          ? `${marks.length} finding${marks.length === 1 ? '' : 's'} placed. Describe each observation below.`
          : 'No findings yet. Place your first mark.'}
      </p>
      {marks.length > 0 && (
        <ol className={styles.ledger}>
          {marks.map((mark, index) => (
            <li
              key={mark.id}
              className={styles.ledgerRow}
              style={{
                '--mark-color': lensByKey[mark.lens]?.color ?? 'var(--amber)',
              }}
            >
              <button
                className={styles.ledgerNumber}
                onClick={() => {
                  setSelected(mark.id)
                  noteRefs.current[mark.id]?.focus()
                }}
                aria-label={`Select evidence ${index + 1}`}
                aria-pressed={selected === mark.id}
              >
                {String(index + 1).padStart(2, '0')}
              </button>
              <span className={styles.ledgerLens}>
                {lensByKey[mark.lens]?.label ?? 'Unclassified'}
              </span>
              <textarea
                ref={(element) => {
                  noteRefs.current[mark.id] = element
                }}
                onFocus={() => setSelected(mark.id)}
                value={mark.note}
                onChange={(event) =>
                  updateMark(mark.id, { note: event.target.value })
                }
                placeholder="What does this area make you notice?"
                aria-label={`Marker ${index + 1} observation`}
                maxLength={100}
                rows={2}
                className={styles.note}
              />
              <button
                type="button"
                onClick={() => removeMark(mark.id)}
                className={styles.remove}
                aria-label={`Remove evidence mark ${index + 1}`}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      )}
      {marks
        .filter((mark) => mark.id === selected)
        .map((mark) => (
          <div
            key={mark.id}
            className={styles.geometry}
            aria-label="Edit selected evidence position"
          >
            {neutral && (
              <label className={styles.classification}>
                Classification (optional)
                <select
                  aria-label="Evidence classification"
                  value={mark.lens ?? ''}
                  onChange={(event) =>
                    updateMark(mark.id, { lens: event.target.value || null })
                  }
                >
                  <option value="">Unclassified</option>
                  {EVIDENCE_LENSES.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {['x', 'y', ...(mark.width != null ? ['width', 'height'] : [])].map(
              (key) => (
                <label key={key}>
                  {key} %
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label={`Evidence ${key} percent`}
                    value={Math.round(mark[key])}
                    onChange={(event) =>
                      updateMark(mark.id, { [key]: Number(event.target.value) })
                    }
                  />
                </label>
              ),
            )}
          </div>
        ))}
      {marks.length > 0 && <button className={styles.returnToExhibit} onClick={() => {
        viewerRef.current?.focus({ preventScroll: true })
        const target = markRefs.current[selected] ?? viewerRef.current
        target?.scrollIntoView({ block: 'center', behavior: 'instant' })
      }}>Return to exhibit ↑</button>}
      </Editor>
    </section>
  )
}
