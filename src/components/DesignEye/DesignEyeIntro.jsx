import { useEffect } from 'react'
import styles from './DesignEyeIntro.module.css'

export default function DesignEyeIntro({ headline, onComplete }) {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const delay = reducedMotion ? 800 : 3200

  useEffect(() => {
    const timer = setTimeout(onComplete, delay)
    return () => clearTimeout(timer)
  }, [delay, onComplete])

  return (
    <div className={styles.root} style={{ '--intro-duration': String(delay) + 'ms' }} aria-live="polite">
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
