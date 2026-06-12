import { useEffect, useState } from 'react'
import styles from './AnnotatedScreenshot.module.css'

const RULING_COLOR = {
  guilty:    'var(--guilty)',
  not_guilty: 'var(--clear)',
  mixed:     'var(--mixed)',
}

const RULING_DIM = {
  guilty:    'var(--guilty-dim)',
  not_guilty: 'var(--clear-dim)',
  mixed:     'var(--mixed-dim)',
}

export default function AnnotatedScreenshot({
  src,
  annotations,
  annotationsVisible,
  pulsingLens,
  expanded,
  aspectRatio = '4/3',
  objectPosition = 'top center',
}) {
  const [visible, setVisible] = useState([])

  const isPortrait = (() => {
    const [w, h] = aspectRatio.split('/').map(Number)
    return !isNaN(w) && !isNaN(h) && h > w
  })()

  useEffect(() => {
    if (!annotationsVisible) return
    const timers = annotations.map((_, i) =>
      setTimeout(() => setVisible(prev => [...prev, i]), i * 80)
    )
    return () => timers.forEach(clearTimeout)
  }, [annotationsVisible, annotations])

  return (
    <div className={[styles.wrap, isPortrait ? styles.portraitWrap : ''].filter(Boolean).join(' ')}>
      {/* Screenshot viewer */}
      <div className={[styles.viewer, expanded ? styles.expanded : ''].filter(Boolean).join(' ')}>
        <img
          src={src}
          alt="Interface under examination"
          className={styles.image}
          style={{ aspectRatio, objectPosition }}
          draggable={false}
        />
        <div className={`${styles.vignette} ${expanded ? styles.vignetteDeep : ''}`} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />

        {annotations.map((ann, i) => (
          <div
            key={i}
            className={[
              styles.annotation,
              visible.includes(i) ? styles.annotationVisible : '',
              pulsingLens === ann.juror ? styles.annotationPulse : '',
            ].filter(Boolean).join(' ')}
            style={{
              left:   `${ann.x}%`,
              top:    `${ann.y}%`,
              width:  `${ann.width}%`,
              height: `${ann.height}%`,
              '--ac': RULING_COLOR[ann.type],
              '--ad': RULING_DIM[ann.type],
            }}
            aria-hidden="true"
          >
            <span
              className={styles.annotationBadge}
              style={{ background: RULING_COLOR[ann.type] }}
            >
              {i + 1}
            </span>
          </div>
        ))}

        <span className={styles.exhibitLabel}>Exhibit A</span>
      </div>

      {/* Legend — staggered in sync with annotation reveal */}
      {annotations.length > 0 && (
        <ol className={styles.legend} aria-label="Annotation key">
          {annotations.map((ann, i) => (
            <li
              key={i}
              className={[
                styles.legendItem,
                visible.includes(i) ? styles.legendItemVisible : '',
              ].filter(Boolean).join(' ')}
            >
              <span
                className={styles.legendBadge}
                style={{ '--ac': RULING_COLOR[ann.type] }}
              >
                {i + 1}
              </span>
              <span className={styles.legendLabel}>{ann.label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
