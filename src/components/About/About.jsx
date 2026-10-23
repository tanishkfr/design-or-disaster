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
          Design or Disaster asks what a judgment counts as evidence. Explore an
          interface, mark what matters and make a first call. Open the context,
          investigate again, and make an independent second call. Keeping your
          verdict is as valid as changing it.
        </p>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── The Structure</h2>
          <p className={styles.prose}>
            Five Second Look investigations pair evidence and reasoning around
            provenance-labeled context. The original ten-case single-look archive
            remains available as a separate route, including its short path.
            Working exhibits are local authored simulations. Historical-looking
            images support visual critique; they do not establish product history
            or measured user outcomes. The sealed fashion finale has no outside
            interpretation. Yours is the only ruling on record.
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
            Your record preserves submitted judgments, written reasons, marked
            states and explicitly selected lenses. Changes and reaffirmations are
            descriptive counts. Missing data and ties remain visible. The report
            does not infer your personality, expertise or improvement.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── Methodology</h2>
          <p className={styles.prose}>
            The five jurors are authored voices, each holding one critical lens; their
            verdicts are interpretations, not expert findings. No crowd telemetry or correctness score is implied.
            Seven case images have matching HTML/CSS reconstruction sources in
            this project's history: Banking, Broadsheet, Hamburger Navigation,
            Benefits, Nova OS, Animated Portfolio and Fashion. Their visible
            product names and interface conventions do not imply affiliation or
            ownership of those products. These are constructed critique objects,
            not verified historical captures.
          </p>
          <p className={styles.prose}>
            Three formerly supplied captures have been replaced with original
            fictional reconstructions: Flare uses invented contacts, Open Self
            presents an unfilled identity form, and Bulletin is a fictional
            category directory. Their inspectable HTML/CSS sources contain no
            imported images, personal details or third-party logos. The old
            captures are not cleared or redistributed by this update. Earlier
            saved notes and coordinates remain unchanged and may describe an
            older image; affected legacy cases disclose this difference.
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.sectionLabel}>── Local records and privacy</h2>
          <p className={styles.prose}>
            Evidence, notes and demo entries are saved in this browser's local
            storage. They are not encrypted or protected from another person
            using the same browser profile. Use fictional details, especially on
            a shared computer. The confirmed reset removes this project's local
            records; downloaded exports remain wherever you saved them. Fonts
            load from Google Fonts, which receives those font requests.
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
