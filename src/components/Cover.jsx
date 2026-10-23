import { useState } from 'react'
import { CASES } from '../data/cases'
import styles from './Cover.module.css'

export default function Cover({ onBegin, onArchive }) {
  const [split, setSplit] = useState(52)
  const exhibit = CASES[0]
  return (
    <div className={styles.cover}>
      <header className={styles.nav}>
        <span className={styles.logo}>
          D<span>/</span>D
        </span>
        <span className={styles.edition}>
          An investigation into design judgment
        </span>
        <button onClick={onArchive}>Case index ↗</button>
      </header>
      <div className={styles.composition}>
        <div className={styles.copy}>
          <h1>
            DESIGN
            <br />
            <span className={styles.or}>or</span> DISASTER
            <span className={styles.question}>?</span>
          </h1>
          <p className={styles.line}>
            The same interface.
            <br />
            <em>A different story.</em>
          </p>
          <p className={styles.description}>
            Explore an interface. Mark your evidence. Make a first call, open
            the context, then judge again. Would your reading change?
          </p>
          <div className={styles.actions}>
            <button className={styles.begin} onClick={onBegin}>
              Begin the investigation <span>↗</span>
            </button>
            <button onClick={onArchive}>Explore the cases →</button>
          </div>
        </div>
        <section
          className={styles.preview}
          aria-label="The Split: one interface, competing readings"
        >
          <div className={styles.previewMeta}>
            <span>EXHIBIT 001</span>
            <span>OBSERVATION / INTERPRETATION</span>
          </div>
          <div
            className={styles.split}
            onPointerMove={(e) => {
              if (e.pointerType === 'mouse') {
                const r = e.currentTarget.getBoundingClientRect()
                setSplit(
                  Math.max(
                    0,
                    Math.min(100, ((e.clientX - r.left) / r.width) * 100),
                  ),
                )
              }
            }}
          >
            <div className={styles.bigSlash} aria-hidden="true">
              /
            </div>
            <div className={styles.imagePlane}>
              <img src={exhibit.screenshot} alt={exhibit.screenshotDescription} width="375" height="812" fetchPriority="high" />
            </div>
            <div
              className={styles.layer}
              style={{ clipPath: `inset(0 0 0 ${split}%)` }}
              aria-hidden="true"
            >
              <div className={styles.imagePlane}>
                <div className={styles.region} />
              </div>
            </div>
            <div className={styles.annotation}>
              Equal weight.
              <br />
              <em>Calm, or no clear priority?</em>
            </div>
            <span
              className={styles.divider}
              style={{ left: `${split}%` }}
              aria-hidden="true"
              onPointerDown={(e) => {
                e.preventDefault()
                e.currentTarget.setPointerCapture(e.pointerId)
              }}
              onPointerMove={(e) => {
                if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
                const r = e.currentTarget.parentElement.getBoundingClientRect()
                setSplit(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)))
              }}
            >
              <span>↔</span>
            </span>
          </div>
          <label className={styles.sliderLabel}>
            Move between readings
            <input
              type="range"
              min="0"
              max="100"
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-label="Split reveal position"
            />
          </label>
          <p className={styles.caption}>
            Mobile Banking Dashboard{' '}
            <span>One exhibit. Five authored perspectives.</span>
          </p>
        </section>
      </div>
      <footer className={styles.footer}>
        <span>Two looks. Five authored perspectives. No right answer.</span>
        <span>5 INVESTIGATIONS / ORIGINAL TEN-CASE ARCHIVE</span>
      </footer>
    </div>
  )
}
