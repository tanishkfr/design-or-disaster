import { JURORS } from '../../data/jurors'
import styles from './About.module.css'

export default function About({ onBack }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <span className={styles.docLabel}>D/D · About</span>
        </header>

        <h1 className={styles.title}>About This Archive</h1>

        <p className={styles.opening}>
          Design or Disaster is a verdict chamber, not a lesson. It asks you to rule on
          an interface before you know enough, then places your verdict beside five
          critics who do not agree with each other, let alone with you. The point is
          not to learn the answer. The point is to discover which lens your judgment
          reached for first.
        </p>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── The Structure</h2>
          <p className={styles.prose}>
            Ten cases, argued in four movements. Movement I is consensus — the jury
            agrees, and you learn how each lens reads a screen. Movement II is the
            divide — the panel splits, and there's no clean answer to lean on. Movement
            III holds the landmarks: cases with documented public consequences, where
            confidence is read from how long you took rather than what you claim. The
            investigation closes on a single sealed case. No panel verdict is entered
            there. Yours is the only ruling on record.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── The Panel</h2>
          <div className={styles.jurorList}>
            {JURORS.map(j => (
              <p key={j.lens} className={styles.jurorLine}>
                <span className={styles.jurorTitle}>{j.title}</span>
                <span className={styles.jurorFocus}>{j.focus}</span>
              </p>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── Your Design Eye</h2>
          <p className={styles.prose}>
            The report at the end of an investigation doesn't grade you against the
            panel's verdicts. It shows you which of the five lenses your own judgment
            echoes most, and which one it consistently misses — the software declining
            to be the authority, and telling you instead which authority you already
            carry.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── Methodology</h2>
          <p className={styles.prose}>
            The five jurors are authored voices, each holding one critical lens; their
            verdicts are one panel's position, not settled fact. Verdict distributions
            shown after ruling are seeded projections, not live telemetry. Screenshots
            are composites recreating documented interface patterns — no real product is
            depicted, and any resemblance is the pattern, not the brand.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── Elsewhere in T*</h2>
          <p className={styles.prose}>
            Atlas teaches a method for reasoning new interaction questions. Design or Disaster
            does something harsher: it makes you commit before the method arrives.
            The artifact here is not a transferable framework. It is calibration under
            disagreement, the moment your eye discovers what it values.
          </p>
        </section>

        <div className={styles.rule} />

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={onBack}>← Archive</button>
          <a
            href="https://github.com/tanishkfr/design-or-disaster"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            github.com/tanishkfr/design-or-disaster
          </a>
        </div>

      </div>
    </div>
  )
}
