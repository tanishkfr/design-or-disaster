import { useState } from 'react'
import { useDesignEye } from './hooks/useDesignEye'
import ColdOpen from './components/ColdOpen/ColdOpen'
import Archive from './components/Archive/Archive'
import CaseFile from './components/CaseFile/CaseFile'

export default function App() {
  const designEye = useDesignEye()

  const [view, setView] = useState(
    designEye.profile.coldOpenCompleted ? 'archive' : 'coldopen'
  )
  const [selectedCaseId, setSelectedCaseId] = useState(null)

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

  const handleSelectCase = (caseId) => {
    designEye.setInProgressCase(caseId)
    setSelectedCaseId(caseId)
    setView('casefile')
  }

  const handleCaseFileBack = () => {
    designEye.clearInProgressCase()
    setView('archive')
  }

  const handleCaseFileSubmit = ({ caseId, verdict, evidenceTags, confidence }) => {
    designEye.recordSubmission({
      caseId,
      verdict,
      evidenceTags,
      confidence,
      timestamp: Date.now(),
    })
    designEye.clearInProgressCase()
    // Phase 5 — verdict chamber replaces this placeholder
    setView('verdictchamber')
  }

  if (view === 'coldopen') {
    return <ColdOpen onComplete={handleColdOpenComplete} />
  }

  if (view === 'archive') {
    return (
      <Archive
        onSelectCase={handleSelectCase}
        onDesignEye={() => setView('designeye')}
      />
    )
  }

  if (view === 'casefile') {
    return (
      <CaseFile
        caseId={selectedCaseId}
        onBack={handleCaseFileBack}
        onSubmit={handleCaseFileSubmit}
      />
    )
  }

  // Phase 5 placeholder — VerdictChamber replaces this
  if (view === 'verdictchamber') {
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
          Verdict Chamber
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-case-number)',
          letterSpacing: 'var(--ls-mono)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          opacity: 0.5,
        }}>
          Phase 5 — coming next
        </p>
        <button
          onClick={() => setView('archive')}
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
          ← Archive
        </button>
        <button
          onClick={() => {
            designEye.resetProfile()
            setView('coldopen')
          }}
          style={{
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

  // Phase 6 placeholder — DesignEye replaces this
  if (view === 'designeye') {
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
          Design Eye Report
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-case-number)',
          letterSpacing: 'var(--ls-mono)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          opacity: 0.5,
        }}>
          Phase 6 — coming next
        </p>
        <button
          onClick={() => setView('archive')}
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
          ← Archive
        </button>
      </div>
    )
  }

  return null
}
