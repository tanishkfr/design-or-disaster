import styles from './ScreenshotViewer.module.css'

export default function ScreenshotViewer({ src, aspectRatio = '4/3' }) {
  const isPortrait = (() => {
    const [w, h] = aspectRatio.split('/').map(Number)
    return !isNaN(w) && !isNaN(h) && h > w
  })()

  return (
    <div className={[styles.viewer, isPortrait ? styles.portraitViewer : ''].filter(Boolean).join(' ')}>
      <img
        src={src}
        alt="Interface under investigation"
        className={styles.image}
        style={{ aspectRatio }}
        draggable={false}
      />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <span className={styles.exhibitLabel}>Exhibit A</span>
    </div>
  )
}
