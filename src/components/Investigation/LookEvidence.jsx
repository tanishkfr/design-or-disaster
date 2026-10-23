import { useState } from 'react'
import EvidencePlate from './EvidencePlate'
import ExhibitSnapshot from './ExhibitSnapshot'
import styles from './Investigation.module.css'

export default function LookEvidence({
  look,
  caseData,
  label = 'Captured exhibit',
}) {
  const frames = Object.values(look.snapshots ?? {}).filter((snapshot) =>
    look.marks.some((mark) => mark.frameId === snapshot.id),
  )
  const [selected, setSelected] = useState(
    frames[0]?.id ?? look.activeSnapshotId,
  )
  const frame = look.snapshots?.[selected] ?? frames[0]
  const marks = frame
    ? look.marks.filter((mark) => mark.frameId === frame.id)
    : look.marks
  return (
    <section>
      {frames.length > 1 && (
        <label className={styles.frameSelect}>
          {label}
          <select
            aria-label={label}
            value={frame?.id}
            onChange={(e) => setSelected(e.target.value)}
          >
            {frames.map((item, index) => (
              <option key={item.id} value={item.id}>
                State {index + 1} / {item.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <EvidencePlate
        src={caseData.screenshot}
        description={caseData.screenshotDescription}
        marks={marks}
      >
        {frame ? <ExhibitSnapshot snapshot={frame} /> : undefined}
      </EvidencePlate>
      <ol className={styles.observations}>
        {marks.map((mark, index) => (
          <li key={mark.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>
              {mark.note}
              <small>{mark.lens ?? 'Unclassified'}</small>
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
