import { useRef, useState } from 'react'
import styles from './EvidencePlate.module.css'

const EVIDENCE_LENSES = [
  { key: 'hierarchy', label: 'Hierarchy', color: '#e8a33d' },
  { key: 'accessibility', label: 'Access', color: '#7fb7ff' },
  { key: 'usability', label: 'Task', color: '#88c999' },
  { key: 'trust', label: 'Trust', color: '#c79be8' },
  { key: 'delight', label: 'Feeling', color: '#ee8f9a' },
]

const lensByKey = Object.fromEntries(EVIDENCE_LENSES.map((lens) => [lens.key, lens]))

export default function EvidencePlate({ src, aspectRatio = '4/3', objectPosition = 'top center', description, evidenceTargets = [], marks, onChange }) {
  const viewerRef = useRef(null)
  const [lens, setLens] = useState('hierarchy')
  const [keyboardPoint, setKeyboardPoint] = useState({ x: 50, y: 50 })
  const [keyboardActive, setKeyboardActive] = useState(false)

  const isPortrait = (() => {
    const [width, height] = aspectRatio.split('/').map(Number)
    return !Number.isNaN(width) && !Number.isNaN(height) && height > width
  })()

  function addMark(x, y) {
    if (marks.length >= 4) return
    onChange([...marks, { id: crypto.randomUUID(), x, y, lens, note: '' }])
  }

  function placeMark(event) {
    if (event.detail === 0 || !viewerRef.current) return
    const bounds = viewerRef.current.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    addMark(x, y)
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
      addMark(keyboardPoint.x, keyboardPoint.y)
    }
  }

  function updateMark(id, patch) {
    onChange(marks.map((mark) => (mark.id === id ? { ...mark, ...patch } : mark)))
  }

  function removeMark(id) {
    onChange(marks.filter((mark) => mark.id !== id))
  }

  return (
    <section className={styles.root} aria-label="Your evidence plate">
      <div className={styles.plateHeader}>
        <div>
          <p className={styles.eyebrow}>PLATE 00 · THE INVESTIGATOR</p>
          <p className={styles.instruction}>Choose what you are looking for, then mark the exact place that decides your ruling.</p>
        </div>
        <span className={styles.count}>{marks.length}/4 MARKS</span>
      </div>

      <div className={styles.lenses} role="group" aria-label="Evidence lens">
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

      <div className={`${styles.viewerWrap} ${isPortrait ? styles.portraitWrap : ''}`}>
        <button
          ref={viewerRef}
          type="button"
          onClick={placeMark}
          onKeyDown={handleViewerKeyDown}
          onFocus={() => setKeyboardActive(true)}
          onBlur={() => setKeyboardActive(false)}
          className={styles.viewer}
          aria-label={`Mark ${lensByKey[lens].label.toLowerCase()} evidence on the interface. Use arrow keys to move the evidence cursor and Enter to place a mark.`}
          aria-describedby="evidence-plate-help"
          disabled={marks.length >= 4}
        >
          <img src={src} alt={description ?? 'Interface under investigation'} className={styles.image} style={{ aspectRatio, objectPosition }} draggable={false} />
          <span className={styles.vignette} aria-hidden="true" />
          {keyboardActive && marks.length < 4 && (
            <span className={styles.keyboardCursor} style={{ left: `${keyboardPoint.x}%`, top: `${keyboardPoint.y}%` }} aria-hidden="true" />
          )}
          {marks.map((mark, index) => (
            <span
              key={mark.id}
              className={styles.mark}
              style={{ left: `${mark.x}%`, top: `${mark.y}%`, '--mark-color': lensByKey[mark.lens].color }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
          <span className={styles.exhibitLabel}>EXHIBIT A · CLICK TO MARK</span>
        </button>
      </div>

      <div className={styles.accessibleTools} id="evidence-plate-help">
        <p className={styles.accessibleHelp}>Use the image directly, move the keyboard cursor with the arrow keys, or choose a named interface region.</p>
        <div className={styles.targetList} aria-label="Named interface regions">
          {evidenceTargets.map((target) => (
            <button
              key={target.label}
              type="button"
              className={styles.target}
              onClick={() => addMark(target.x, target.y)}
              disabled={marks.length >= 4}
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>

      {marks.length > 0 && (
        <ol className={styles.ledger}>
          {marks.map((mark, index) => (
            <li key={mark.id} className={styles.ledgerRow} style={{ '--mark-color': lensByKey[mark.lens].color }}>
              <span className={styles.ledgerNumber}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.ledgerLens}>{lensByKey[mark.lens].label}</span>
              <input
                value={mark.note}
                onChange={(event) => updateMark(mark.id, { note: event.target.value })}
                placeholder="What does this place make you notice?"
                aria-label={`Evidence mark ${index + 1} observation`}
                maxLength={100}
                className={styles.note}
              />
              <button type="button" onClick={() => removeMark(mark.id)} className={styles.remove} aria-label={`Remove evidence mark ${index + 1}`}>×</button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
