import styles from './Investigation.module.css'

export default function EvidencePlate({
  src,
  description,
  marks = [],
  children,
}) {
  return (
    <div className={styles.plate}>
      {children ?? <img src={src} alt={description} />}
      <div className={styles.plateLayer} aria-hidden="true">
        {marks.map((mark, index) => (
          <span
            key={mark.id}
            className={
              mark.width != null ? styles.plateRegion : styles.platePoint
            }
            style={{
              left: mark.x + '%',
              top: mark.y + '%',
              width: mark.width != null ? mark.width + '%' : undefined,
              height: mark.height != null ? mark.height + '%' : undefined,
            }}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  )
}
