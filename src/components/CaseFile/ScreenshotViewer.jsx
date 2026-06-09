import styles from './ScreenshotViewer.module.css'

export default function ScreenshotViewer({ src }) {
  return (
    <div className={styles.viewer}>
      <img
        src={src}
        alt="Interface under investigation"
        className={styles.image}
        draggable={false}
      />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <span className={styles.exhibitLabel}>Exhibit A</span>
    </div>
  )
}
