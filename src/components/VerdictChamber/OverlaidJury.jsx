import { useMemo, useState } from 'react'
import { JURORS, JUROR_BY_LENS } from '../../data/jurors'
import styles from './OverlaidJury.module.css'

const EVIDENCE_LENSES = [
  { key: 'hierarchy', label: 'Hierarchy', color: '#e8a33d' },
  { key: 'accessibility', label: 'Access', color: '#7fb7ff' },
  { key: 'usability', label: 'Task', color: '#88c999' },
  { key: 'trust', label: 'Trust', color: '#c79be8' },
  { key: 'delight', label: 'Feeling', color: '#ee8f9a' },
]
const lensByKey = Object.fromEntries(EVIDENCE_LENSES.map((lens) => [lens.key, lens]))
const rulingColor = { guilty: 'var(--guilty)', not_guilty: 'var(--clear)', mixed: 'var(--mixed)' }

export default function OverlaidJury({
  src,
  aspectRatio = '4/3',
  objectPosition = 'top center',
  description,
  visitorMarks = [],
  annotations = [],
  availableLenses = [],
  sealed = false,
  onOpenPerspective,
}) {
  const [active, setActive] = useState('you')
  const jurorPerspectives = useMemo(() => JURORS.map((juror) => juror.lens), [])


  const activeAnnotations = active === 'you' ? [] : active === 'all' ? annotations : annotations.filter((annotation) => annotation.juror === active)
  const activeJuror = active === 'you' || active === 'all' ? null : JUROR_BY_LENS[active]
  const activeLens = active === 'you' || active === 'all' ? null : lensByKey[active]

  return (
    <section className={styles.root} aria-label="Evidence comparison">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{sealed ? 'SEALED RECORD' : 'EVIDENCE COMPARISON'}</p>
          <h2 className={styles.title}>
            {active === 'you' ? 'What you counted as evidence.' : active === 'all' ? 'Where the five perspectives agree and conflict.' : `What ${activeJuror.title.toLowerCase()} counted as evidence.`}
          </h2>
        </div>
        <p className={styles.counter}>{active === 'you' ? `YOUR EVIDENCE · ${visitorMarks.length} MARKS` : `${activeAnnotations.length} FINDINGS · ${activeLens?.label.toUpperCase()}`}</p>
      </div>

      <div className={styles.perspectives} role="tablist" aria-label="Evidence perspectives">
        <button type="button" role="tab" aria-selected={active === 'you'} aria-controls="evidence-comparison-stage" onClick={() => setActive('you')} className={`${styles.perspectiveTab} ${active === 'you' ? styles.perspectiveTabActive : ''}`}>
          <span>Your view</span>
        </button>
        {!sealed && jurorPerspectives.map((lens) => {
          const available = availableLenses.includes(lens)
          return (
            <button
              key={lens}
              type="button"
              role="tab"
              aria-selected={active === lens}
              aria-controls="evidence-comparison-stage"
              disabled={!available}
              onClick={() => { setActive(lens); onOpenPerspective?.(lens) }}
              className={`${styles.perspectiveTab} ${active === lens ? styles.perspectiveTabActive : ''}`}
              style={{ '--perspective-color': lensByKey[lens]?.color }}
            >
              <span>{JUROR_BY_LENS[lens]?.title.replace('The ', '')}</span>
            </button>
          )
        })}
        {!sealed && (
          <button
            type="button"
            role="tab"
            aria-selected={active === 'all'}
            aria-controls="evidence-comparison-stage"
            disabled={availableLenses.length < JURORS.length}
            onClick={() => { setActive('all'); onOpenPerspective?.('all') }}
            className={`${styles.perspectiveTab} ${styles.allTab} ${active === 'all' ? styles.perspectiveTabActive : ''}`}
          >
            <span>Combined</span>
          </button>
        )}
      </div>

      <div className={styles.stage} id="evidence-comparison-stage" role="tabpanel">
        <img src={src} alt={description ?? 'Interface with selected evidence perspective'} className={styles.image} style={{ aspectRatio, objectPosition }} draggable={false} />
        <span className={styles.vignette} aria-hidden="true" />

        {visitorMarks.map((mark, index) => (
          <span
            key={mark.id ?? index}
            className={`${styles.visitorMark} ${active !== 'you' ? styles.visitorMarkGhost : ''}`}
            style={{ left: `${mark.x}%`, top: `${mark.y}%`, '--visitor-color': lensByKey[mark.lens]?.color ?? 'var(--mixed)' }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        ))}

        {activeAnnotations.map((annotation, index) => (
          <span
            key={`${annotation.juror}-${index}`}
            className={styles.jurorMark}
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              width: `${annotation.width}%`,
              height: `${annotation.height}%`,
              '--ruling-color': rulingColor[annotation.type],
              '--lens-color': lensByKey[annotation.juror]?.color,
            }}
            aria-hidden="true"
          >
            <span className={styles.jurorBadge}>{String(index + 1).padStart(2, '0')}</span>
          </span>
        ))}
        <span className={styles.exhibit}>All marks share the same image coordinates</span>
      </div>

      <ol className={styles.legend}>
        {active === 'you'
          ? visitorMarks.map((mark, index) => (
              <li key={mark.id ?? index} className={styles.legendRow} style={{ '--lens-color': lensByKey[mark.lens]?.color }}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{lensByKey[mark.lens]?.label}</strong>
                <p>{mark.note}</p>
              </li>
            ))
          : activeAnnotations.map((annotation, index) => (
              <li key={`${annotation.juror}-${index}`} className={styles.legendRow} style={{ '--lens-color': lensByKey[annotation.juror]?.color }}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{lensByKey[annotation.juror]?.label}</strong>
                <p>{annotation.label}</p>
              </li>
            ))}
      </ol>

      {sealed && <p className={styles.sealedNote}>No outside perspective will be shown. This case keeps only the evidence you chose to see.</p>}
    </section>
  )
}
