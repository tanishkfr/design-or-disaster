import { JURORS } from '../../data/jurors'
import styles from './MeetThePanel.module.css'

// Shown once, after the third case closes. The five lenses have each
// ruled on the investigator three times — now they get names.
export default function MeetThePanel({ onContinue }) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>

        <header className={styles.header}>
          <span className={styles.label}>── The Panel</span>
          <p className={styles.intro}>
            Three cases closed. You've now argued beside all five — not been graded by them.
          </p>
        </header>

        <div className={styles.jurorList}>
          {JURORS.map((juror, i) => (
            <div
              key={juror.lens}
              className={styles.juror}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={styles.jurorHead}>
                <span className={styles.lens}>{juror.lens}</span>
                <span className={styles.title}>{juror.title}</span>
              </div>
              <p className={styles.focus}>{juror.focus}</p>
              <p className={styles.voice}>{juror.voice}</p>
            </div>
          ))}
        </div>

        <p className={styles.closing}>
          Five lenses. One design. They will not always agree — and from here,
          the cases stop resolving cleanly.
        </p>

        <button className={styles.continueBtn} onClick={onContinue}>
          Continue Investigation →
        </button>

      </div>
    </div>
  )
}
