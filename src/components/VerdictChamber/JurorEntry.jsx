import styles from './JurorEntry.module.css'

const RULING_LABEL = {
  guilty:    'Guilty',
  not_guilty: 'Not Guilty',
  mixed:     'Mixed',
}

export default function JurorEntry({ juror, ruling, reasoning, arrived, splitOffset }) {
  return (
    <div
      className={styles.wrapper}
      style={
        splitOffset
          ? { transform: `translateX(${splitOffset}px)`, transition: `transform var(--duration-slower) var(--ease-out)` }
          : undefined
      }
    >
      <div
        className={[
          styles.entry,
          arrived ? styles.arrived : '',
          styles[ruling],
        ].filter(Boolean).join(' ')}
      >
        {/* Header row: lens · title ——————————— RULING ● */}
        <div className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.lens}>{juror.lens.toUpperCase()}</span>
            <span className={styles.dot} aria-hidden="true">·</span>
            <span className={styles.title}>{juror.title}</span>
          </div>
          <div className={styles.ruling} aria-label={`Ruling: ${RULING_LABEL[ruling]}`}>
            <span className={styles.rulingLabel}>{RULING_LABEL[ruling].toUpperCase()}</span>
            <span className={styles.rulingDot} aria-hidden="true" />
          </div>
        </div>

        {/* One-sentence reasoning in the juror's voice */}
        <p className={styles.reasoning}>"{reasoning}"</p>
      </div>
    </div>
  )
}
