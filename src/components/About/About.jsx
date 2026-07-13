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
            design judgment carries visible public stakes. Confidence remains yours to report. The
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
            The report at the end of an investigation does not grade you against the panel. It shows which evidence lenses you used most and which remained least visible — the software declining
            to be the authority, and telling you instead which authority you already
            carry.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── Methodology</h2>
          <p className={styles.prose}>
            The five jurors are authored voices, each holding one critical lens; their
            verdicts are one panel's position, not settled fact. No crowd telemetry or correctness score is implied.
            The case imagery combines authored reconstructions with recognizable historical captures. Products remain visible
            where the design under discussion would become meaningless without context; the archive claims the critique, not the source interface.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── What this contributes</h2>
          <p className={styles.prose}>
            The evidence map is the contribution: a critique must locate what it counts as evidence
            before it can announce a verdict. Comparing five perspectives then makes disagreement spatial,
            showing that attention has geometry and that no panel can make it neutral.
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
