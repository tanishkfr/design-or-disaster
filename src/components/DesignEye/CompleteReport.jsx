import { useState } from 'react'
import { getCaseById } from '../../data/cases'
import { INVESTIGATIONS } from '../../investigation/capabilities'
import { buildReport } from '../../investigation/report'
import { exportSummary, exportCompactSummary, exportTextReport } from '../../investigation/export'
import { VERDICT_LABELS, CONFIDENCE_LABELS } from '../../investigation/labels'
import LookEvidence from '../Investigation/LookEvidence'
import styles from './CompleteReport.module.css'

function EvidenceStates({ look, caseData }) {
  const frames = Object.values(look.snapshots ?? {}).filter((frame) =>
    look.marks.some((mark) => mark.frameId === frame.id),
  )
  if (!frames.length) return <LookEvidence look={look} caseData={caseData} />
  return frames.map((frame, index) => (
    <section
      key={frame.id}
      style={{
        '--print-state-width': `${Math.min(430, (600 * frame.width) / frame.height)}px`,
      }}
    >
      <h4>
        Captured state {index + 1} / {frame.label}
      </h4>
      <LookEvidence
        key={frame.id}
        look={{
          ...look,
          activeSnapshotId: frame.id,
          snapshots: { [frame.id]: frame },
          marks: look.marks.filter((mark) => mark.frameId === frame.id),
        }}
        caseData={caseData}
      />
    </section>
  ))
}
export default function CompleteReport({
  records,
  legacy,
  storageError,
  onBack,
  onCase,
  onLegacy,
}) {
  const report = buildReport(records, legacy),
    [error, setError] = useState(''),
    [exporting, setExporting] = useState(false)
  async function download(compact = false) {
    setExporting(true)
    setError('')
    try {
      await (compact ? exportCompactSummary : exportSummary)(report, getCaseById)
    } catch (error) {
      setError(error.message)
    } finally {
      setExporting(false)
    }
  }
  return (
    <article className={styles.root}>
      <nav className={styles.actions} aria-label="Report actions">
        <button onClick={onBack}>← Case index</button>
        <button onClick={() => download(true)} disabled={exporting}>Save one-page PNG ↓</button>
        <button onClick={() => download(false)} disabled={exporting}>
          {exporting ? 'Preparing PNG…' : 'Save summary PNG ↓'}
        </button>
        <button onClick={() => window.print()}>Print / save PDF ↓</button>
        <button onClick={() => exportTextReport(report, getCaseById, INVESTIGATIONS)}>Save text HTML ↓</button>
        <button onClick={onLegacy}>Legacy Design Eye →</button>
      </nav>
      {error && <p role="alert">{error}</p>}
      {storageError && <p role="alert">{storageError}</p>}
      <p className={styles.exportNote}>The one-page image uses reason excerpts. Full PNG and PDF retain the detailed record. Save text HTML for a portable nonvisual edition; PDF accessibility has not been certified.</p>
      <header className={styles.lead}>
        <p className={styles.meta}>
          DESIGN / DISASTER? — YOUR INVESTIGATION RECORD
        </p>
        <h1>
          Your Design <em>Eye.</em>
        </h1>
        <p className={styles.dek}>
          What you noticed. What you reconsidered. What you kept.
        </p>
        <p>
          {report.complete} / 5 investigations complete. {report.paired}{' '}
          submitted judgment pairs. This document includes incomplete attempts;
          it makes no claims about decisions you have not submitted.
        </p>
      </header>
      <section className={styles.summary} aria-label="Saved record summary">
        <div>
          <strong>{report.outcomes.changed_verdict}</strong>
          <span>Changed verdict</span>
        </div>
        <div>
          <strong>{report.outcomes.new_reasoning}</strong>
          <span>Same verdict, different words</span>
        </div>
        <div>
          <strong>{report.outcomes.consistent_reasoning}</strong>
          <span>Same verdict and words</span>
        </div>
      </section>
      <section className={styles.patterns}>
        <div>
          <h2>Confidence, as you stated it.</h2>
          <p>
            {report.confidence.higher} higher · {report.confidence.lower} lower
            · {report.confidence.same} unchanged
          </p>
          <p>
            Compared only where both judgments have an explicit confidence
            value. No confidence is inferred from speed or actions.
          </p>
        </div>
        <div>
          <h2>Where you placed a lens.</h2>
          <dl className={styles.lensCounts}>
            {Object.entries({ hierarchy: 'Hierarchy', accessibility: 'Access', usability: 'Task', trust: 'Trust', delight: 'Feeling' }).map(([lens, label]) => (
              <div key={lens}><dt>{label}</dt><dd>{report.lensCounts[lens]}</dd></div>
            ))}
          </dl>
          <p>
            {report.unclassified} unclassified marks.{' '}
            {report.leadingLenses.length
              ? `Most used: ${report.leadingLenses.join(' and ')}${report.leadingLenses.length > 1 ? ' (tied)' : ''}.`
              : 'No classified evidence yet.'}{' '}
            Counts describe these marks, not your personality.
          </p>
        </div>
      </section>
      <p className={styles.method}>{report.methodology}</p>
      <nav className={styles.recordIndex} aria-label="Jump to investigation record">
        {report.cases.map((item, index) => (
          <a key={item.caseId} href={`#record-${item.caseId}`} onClick={(e) => {
            e.preventDefault()
            document.getElementById(`record-${item.caseId}`)?.focus()
          }}>
            <span>0{index + 1}</span> {getCaseById(item.caseId).title}
          </a>
        ))}
      </nav>
      {report.cases.map((item, index) => {
        const caseData = getCaseById(item.caseId),
          config = INVESTIGATIONS[item.caseId]
        return (
          <section
            key={item.caseId}
            className={`${styles.case} ${item.record ? styles.hasRecord : styles.unstarted}`}
          >
            <header>
              <p className={styles.meta}>
                INVESTIGATION {String(index + 1).padStart(2, '0')} /{' '}
                {item.status}
                {config.sealed ? ' / SEALED FINALE' : ''}
              </p>
              <h2 id={`record-${item.caseId}`} tabIndex="-1">{caseData.title}</h2>
              <button
                className={styles.screenOnly}
                onClick={() => onCase(item.caseId)}
              >
                {item.status === 'complete'
                  ? 'Review investigation'
                  : 'Continue investigation'}{' '}
                ↗
              </button>
            </header>
            {!item.record ? (
              <p>No saved attempt.</p>
            ) : (
              <>
                {[
                  ['First look', item.record.firstLook, item.before],
                  ['Second look', item.record.secondLook, item.after],
                ].map(([label, look, judgment]) => (
                  <section key={label} className={styles.look}>
                    <h3>{label}</h3>
                    {judgment ? (
                      <>
                        <p>
                          <strong>{VERDICT_LABELS[judgment.verdict]}</strong> /{' '}
                          {CONFIDENCE_LABELS[judgment.confidence]}
                        </p>
                        <blockquote>{judgment.writtenRuling}</blockquote>
                      </>
                    ) : (
                      <p>
                        No submitted judgment. Any evidence below is a draft.
                      </p>
                    )}
                    {look.marks.length > 0 ? (
                      <EvidenceStates look={look} caseData={caseData} />
                    ) : (
                      <p>No evidence marks saved.</p>
                    )}
                  </section>
                ))}
                <section className={styles.context}>
                  <h3>Context opened</h3>
                  {config.context
                    .filter((entry) =>
                      item.record.contextRevealed.includes(entry.id),
                    )
                    .map((entry) => (
                      <div key={entry.id}>
                        <h4>{entry.title}</h4>
                        <small>{entry.provenance}</small>
                        <p>{entry.body}</p>
                      </div>
                    ))}
                  {!item.record.contextRevealed.length && (
                    <p>No context opened.</p>
                  )}
                  <h3>Your reflection</h3>
                  <p>
                    {item.record.reflectionNote ||
                      'No reflection note supplied.'}
                  </p>
                  <small>
                    Task events:{' '}
                    {[...new Set(item.record.secondLook.exhibit.events)].join(
                      ', ',
                    ) || 'None recorded'}
                    . These events are not a performance score.
                  </small>
                </section>
              </>
            )}
          </section>
        )
      })}
      <section
        className={styles.legacy}
        data-has-records={report.legacy.length > 0}
      >
        <h2>Legacy single-look record</h2>
        <p>
          {report.legacy.length} original submissions. These are retained
          separately and excluded from Second Look comparisons.
        </p>
        {report.legacy.map((item, index) => (
          <div key={`${item.caseId}-${index}`}>
            <h3>{getCaseById(item.caseId)?.title ?? item.caseId}</h3>
            <p>
              {VERDICT_LABELS[item.verdict]} /{' '}
              {CONFIDENCE_LABELS[item.confidence] ?? 'Confidence not supplied'}
            </p>
            <blockquote>
              {item.writtenRuling || 'No written ruling supplied.'}
            </blockquote>
          </div>
        ))}
      </section>
      <footer>
        <h2>What would you investigate next?</h2>
        <p>
          Working exhibits are authored simulations. The five outside
          perspectives are authored interpretations, not an answer key. No
          outside interpretation is provided for the sealed finale. This report
          describes the current local record; it is not a validated assessment
          of design ability.
        </p>
        <p>
          Export note: PNG contains the compact textual summary. Print / PDF
          contains every saved marked state, note, judgment, opened context
          document, and reflection displayed here. Browser printing may add page
          headers; turn those off in print settings if desired.
        </p>
      </footer>
    </article>
  )
}
