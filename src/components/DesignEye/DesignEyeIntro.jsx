import { useEffect } from 'react'
import styles from './DesignEyeIntro.module.css'

export default function DesignEyeIntro({ headline, onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 5000)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className={styles.root} aria-live="polite">
      <p className={styles.headline}>{headline}</p>
      <div className={styles.progressBar} aria-hidden="true">
        <div className={styles.progressFill} />
      </div>
      <button className={styles.continueBtn} onClick={onComplete}>
        The record →
      </button>
    </div>
  )
}
