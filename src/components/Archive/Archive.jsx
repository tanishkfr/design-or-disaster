import { useState, useRef } from 'react'
import { useDesignEye } from '../../hooks/useDesignEye'
import { CURATED_IDS, investigationFor } from '../../investigation/capabilities'
import { CASES } from '../../data/cases'
import styles from './Archive.module.css'

const PREVIEWS = {
  'case-001': ['When does calm become equal weight?', 'Explore an account, find a refund and try a fictional transfer.'],
  'case-006': ['What should a shared screen remember?', 'Inspect a form, then test interruption and draft recovery.'],
  'case-010': ['How much expression helps you see the work?', 'Try optional motion, inspect a project and find its designer’s role.'],
  'case-012': ['Can density help you find what matters?', 'Filter fictional listings, inspect collection details and save a shortlist.'],
  'case-015': ['What earns trust beyond the first impression?', 'Inspect a garment, choose a size and try the local bag. A sealed finale.'],
}

export default function Archive({
  onSelectCase,
  onLegacyCase,
  onDesignEye,
  onAbout,
  onReset,
  onStartCurated,
  onCover,
  investigationRecords = {},
  investigationError,
}) {
  const { profile, hasSubmittedCase } = useDesignEye()
  const [selected, setSelected] = useState(CASES[0])
  const [previewId, setPreviewId] = useState(CURATED_IDS[0])
  const [expanded, setExpanded] = useState(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const resetButton = useRef(null)
  const hasLegacyCase = (id) =>
    profile.submissions.some(
      (item) => item.caseId === id && !item.investigationId,
    )
  const reviewed = CASES.filter((c) => hasLegacyCase(c.id)).length
  const unlocked = (c) =>
    c.movement === 1 ||
    CASES.filter((p) => p.movement === c.movement - 1).every((p) =>
      hasSubmittedCase(p.id),
    ) ||
    hasSubmittedCase(c.id)
  const labels = [
    'The opening readings',
    'The divide',
    'The landmarks',
    'The sealed case',
  ]
  function reset() {
    if (confirmingReset) {
      onReset()
    } else {
      setConfirmingReset(true)
    }
  }
  function preview(id, mobile = false) {
    const item = CASES.find((c) => c.id === id)
    const record = investigationRecords[id]
    return (
      <div className={mobile ? styles.mobilePreview : styles.collectionPreview} id={mobile ? `preview-${id}` : undefined} data-preview-case={id}>
        <div className={styles.previewCaption}>
          <span>{item.number} / {id === 'case-015' ? 'SEALED FINALE' : 'SECOND LOOK'}</span>
          <span>{record?.stage === 'COMPLETE' ? 'Filed' : record ? 'In progress' : 'Unopened'}</span>
        </div>
        <div className={styles.collectionImage} data-case={id}>
          <img key={id} src={`/previews/${id}.png`} alt={`${item.title}: opening ${id === 'case-006' ? 'reconstructed still' : 'working exhibit'}`} width="760" height="650" />
        </div>
        <h3>{PREVIEWS[id][0]}</h3>
        <p>{PREVIEWS[id][1]}</p>
        <button className={styles.open} onClick={() => onSelectCase(id)}>
          {record?.stage === 'COMPLETE' ? 'Read investigation record' : record ? 'Resume investigation' : 'Open investigation'} <span>↗</span>
        </button>
        <small>Actual exhibit / authored simulation</small>
      </div>
    )
  }
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <button
          className={styles.wordmark}
          onClick={onCover}
          aria-label="Return to cover"
        >
          D/D
        </button>
        <nav className={styles.navigation} aria-label="Main navigation">
          <button onClick={onAbout}>About</button>
          <button onClick={onDesignEye}>Your Design Eye ↗</button>
          <button ref={resetButton} onClick={reset}>
            {confirmingReset ? 'Erase progress?' : 'Reset'}
          </button>
        </nav>
      </header>
      {confirmingReset && (
        <div className={styles.resetNotice}>
          <p role="status">
            Erase all local judgments, evidence and demo entries? Choose Erase
            progress to confirm, or Cancel reset to keep them. Downloaded exports
            remain on your device.
          </p>
          <button onClick={() => {
            setConfirmingReset(false)
            requestAnimationFrame(() => resetButton.current?.focus())
          }}>Cancel reset</button>
        </div>
      )}
      <div className={styles.intro}>
        <h1>
          The case
          <br />
          <em>index.</em>
        </h1>
        <div className={styles.introCopy}>
          <p>
            One interface can hold
            <br />
            more than one truth.
          </p>
          <span>
            {
              CURATED_IDS.filter(
                (id) => investigationRecords[id]?.stage === 'COMPLETE',
              ).length
            }{' '}
            / 5 Second Look investigations filed
          </span>
          <button className={styles.quick} onClick={onStartCurated}>
            Take the five-minute path ↗
          </button>
          <small className={styles.quickNote}>Original single-look route / two cases</small>
          {profile.inProgressCaseId && (
            <button onClick={() => onLegacyCase(profile.inProgressCaseId)}>
              Resume your investigation →
            </button>
          )}
        </div>
      </div>
      {investigationError && (
        <p role="alert">
          {investigationError} Existing records have been kept untouched.
        </p>
      )}
      <section
        className={styles.collection}
        aria-label="Second Look collection"
      >
        <h2>Five exhibits. Two looks. Your judgment.</h2>
        <p>
          Choose an exhibit. Explore it, mark one finding, then make your first
          judgment. Each exhibit is a simulation.
        </p>
        <div className={styles.collectionLayout}>
        <div className={styles.collectionRows}>
        {CURATED_IDS.map((id, index) => {
          const item = CASES.find((c) => c.id === id),
            config = investigationFor(item),
            record = investigationRecords[id]
          return (
            <div key={id} className={`${styles.collectionItem} ${previewId === id ? styles.activeCase : ''}`} data-catalogue-case={id} onPointerMove={(event) => {
              // Scrolling can place another row under a stationary pointer.
              // Only intentional pointer movement should replace a focused case.
              if (event.pointerType === 'mouse' && (event.movementX || event.movementY)) setPreviewId(id)
            }} onFocus={() => setPreviewId(id)}>
            <button className={styles.caseEntry} onClick={() => onSelectCase(id)}>
              <span>0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{config.theme}</p>
              </div>
              <strong>
                {record
                  ? record.stage === 'COMPLETE'
                    ? 'Read record'
                    : 'Resume'
                  : 'Investigate'}{' '}
                ↗
              </strong>
            </button>
            <button className={styles.previewToggle} aria-label={`Preview ${item.title}`} aria-expanded={expanded === id} aria-controls={`preview-${id}`} onClick={() => {
              setPreviewId(id)
              setExpanded(expanded === id ? null : id)
            }}>{expanded === id ? 'Close preview −' : 'Preview +'}</button>
            {expanded === id && preview(id, true)}
            </div>
          )
        })}
        </div>
        {preview(previewId)}
        </div>
      </section>
      <details className={styles.legacyArchive}>
        <summary>
          Original ten-case archive / {reviewed} single-look rulings
        </summary>
        <p>
          Original single-look route. These judgments are retained separately
          from Second Look.
        </p>
        <div className={styles.catalogue}>
          <div className={styles.rows}>
            {[1, 2, 3, 4].map((m) => (
              <section key={m} className={styles.movement}>
                <h2>
                  <span>0{m}</span>
                  {labels[m - 1]}
                </h2>
                {CASES.filter((c) => c.movement === m).map((c) => (
                  <button
                    key={c.id}
                    className={`${styles.row} ${selected.id === c.id ? styles.selected : ''}`}
                    onMouseEnter={() => setSelected(c)}
                    onFocus={() => setSelected(c)}
                    onClick={() => unlocked(c) && onLegacyCase(c.id)}
                    aria-disabled={!unlocked(c)}
                  >
                    <span className={styles.number}>
                      {c.number.replace('CASE #', '')}
                    </span>
                    <span className={styles.rowTitle}>
                      {c.title}
                      <small>
                        {c.category}
                        {investigationFor(c) ? ' / Second Look available' : ''}
                      </small>
                    </span>
                    <span className={styles.state}>
                      {hasLegacyCase(c.id)
                        ? 'Filed ↗'
                        : investigationRecords[c.id]?.stage === 'COMPLETE'
                          ? 'Second Look saved'
                          : unlocked(c)
                            ? 'Open ↗'
                            : 'Locked'}
                    </span>
                  </button>
                ))}
              </section>
            ))}
          </div>
          <aside className={styles.preview}>
            <div className={styles.previewHead}>
              <span>SELECTED EXHIBIT</span>
              <span>{selected.number}</span>
            </div>
            <div className={styles.imageWell}>
              <img
                key={selected.id}
                src={selected.screenshot}
                alt={selected.screenshotDescription}
              />
            </div>
            <h2>{selected.title}</h2>
            <p>{selected.context}</p>
            <button
              className={styles.open}
              disabled={!unlocked(selected)}
              onClick={() => onLegacyCase(selected.id)}
            >
              {hasLegacyCase(selected.id)
                ? 'Read your filed single-look ruling'
                : unlocked(selected)
                  ? 'Investigate this interface'
                  : `Complete ${labels[selected.movement - 2]} to unlock`}{' '}
              <span>↗</span>
            </button>
          </aside>
        </div>
      </details>
      <footer className={styles.footer}>
        <p>
          The five jurors are authored voices. Their perspectives are
          interpretations, not settled fact. Case imagery uses authored
          reconstructions. Three formerly supplied captures now have original
          fictional replacements. See About for provenance and older-record limits.
          Your record stays in this browser.
        </p>
        <a
          href="https://github.com/tanishkfr/design-or-disaster"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source ↗
        </a>
      </footer>
    </div>
  )
}
