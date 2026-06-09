import { useState } from 'react'
import { useDesignEye } from './hooks/useDesignEye'
import ColdOpen from './components/ColdOpen/ColdOpen'

export default function App() {
  const designEye = useDesignEye()

  // Skip cold open on return visits
  const [view, setView] = useState(
    designEye.profile.coldOpenCompleted ? 'archive' : 'coldopen'
  )

  const handleColdOpenComplete = ({ verdict, timestamp }) => {
    designEye.recordSubmission({
      caseId: 'case-001',
      verdict,
      evidenceTags: [],
      confidence: null,
      timestamp,
    })
    designEye.markColdOpenComplete()
    setView('archive')
  }

  if (view === 'coldopen') {
    return <ColdOpen onComplete={handleColdOpenComplete} />
  }

  // Phase 3 placeholder — Archive component replaces this
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-case-number)',
        letterSpacing: 'var(--ls-mono)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
      }}>
        Investigation Archive
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-case-number)',
        letterSpacing: 'var(--ls-mono)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        opacity: 0.5,
      }}>
        Phase 3 — coming next
      </p>
      <button
        onClick={() => {
          designEye.resetProfile()
          setView('coldopen')
        }}
        style={{
          marginTop: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-case-number)',
          letterSpacing: 'var(--ls-mono)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          background: 'none',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 16px',
          cursor: 'pointer',
        }}
      >
        Reset (dev only)
      </button>
    </div>
  )
}
