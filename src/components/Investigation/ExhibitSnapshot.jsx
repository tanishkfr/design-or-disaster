import { useLayoutEffect, useRef, useState } from 'react'
import { EXHIBIT_VIEWS } from './exhibitViews'
import styles from './Investigation.module.css'

// Render the captured DOM at its original logical width, then scale the whole
// surface. Text and fields cannot reflow underneath percentage-based marks.
export default function ExhibitSnapshot({ snapshot }) {
  const Exhibit = EXHIBIT_VIEWS[snapshot.exhibitId]
  const host = useRef(null)
  const [width, setWidth] = useState(snapshot.width)
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={host}
      className={styles.snapshot}
      style={{ aspectRatio: `${snapshot.width}/${snapshot.height}` }}
      aria-hidden="true"
    >
      <div
        className={styles.snapshotContent}
        style={{
          '--capture-width': `${snapshot.width}px`,
          width: snapshot.width,
          height: snapshot.height,
          transform: `scale(${width / snapshot.width})`,
        }}
      >
        <Exhibit state={snapshot.exhibit} frozen />
      </div>
    </div>
  )
}
