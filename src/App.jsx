import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './App.module.css'
import { useDesignEye } from './hooks/useDesignEye'
import { getCaseById, CASES } from './data/cases'
import { deriveLeadInsight } from './utils/reportInsights'
import ColdOpen from './components/ColdOpen/ColdOpen'
import Archive from './components/Archive/Archive'
import CaseFile from './components/CaseFile/CaseFile'
import VerdictChamber from './components/VerdictChamber/VerdictChamber'
import MeetThePanel from './components/MeetThePanel/MeetThePanel'
import About from './components/About/About'
import IntermissionReport from './components/DesignEye/IntermissionReport'
import FinalReport from './components/DesignEye/FinalReport'
import DesignEyeIntro from './components/DesignEye/DesignEyeIntro'

const CURATED_CASES = ['case-010', 'case-015']

function ViewFrame({ className, children }) {
  return (
    <section className={className}>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <main className={styles.main} id="main-content" tabIndex="-1">{children}</main>
    </section>
  )
}

export default function App() {
  const designEye = useDesignEye()

  const [view, setView] = useState(designEye.profile.coldOpenCompleted ? 'archive' : 'coldopen')
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(null)
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [lastSubmission, setLastSubmission] = useState(null)
  const [curatedMode, setCuratedMode] = useState(false)

  useEffect(() => {
    const selectedCase = selectedCaseId ? getCaseById(selectedCaseId) : null
    const viewTitle = {
      coldopen: 'Design or Disaster?',
      archive: 'Case Archive',
      about: 'About the Investigation',
      meetpanel: 'Meet the Panel',
      intermission: 'Intermission Report',
      'designeye-intro': 'Your Design Eye',
      designeye: 'Investigation Record',
      casefile: selectedCase ? selectedCase.number + ': ' + selectedCase.title : 'Case File',
      verdictchamber: selectedCase ? selectedCase.number + ': Overlaid Jury' : 'Panel comparison',
    }[view]
    document.title = (viewTitle ?? 'Design or Disaster?') + ' | Design or Disaster?'
  }, [selectedCaseId, view])

  const navigate = useCallback((newView, updateFn) => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    setExiting(true)
    exitTimer.current = setTimeout(() => {
      if (updateFn) updateFn()
      setView(newView)
      setExiting(false)
    }, 200)
  }, [])

  const handleColdOpenComplete = ({ verdict, evidenceMap, evidenceTags, writtenRuling, timestamp }) => {
    const submission = {
      caseId: 'case-001', verdict, evidenceMap, evidenceTags, writtenRuling,
      confidence: null, confidenceInferred: false, timestamp,
    }
    navigate('verdictchamber', () => {
      designEye.recordSubmission(submission)
      designEye.markColdOpenComplete()
      setSelectedCaseId('case-001')
      setLastSubmission(submission)
    })
  }

  const handleSelectCase = (caseId) => {
    navigate('casefile', () => {
      designEye.setInProgressCase(caseId)
      setSelectedCaseId(caseId)
    })
  }

  const handleCaseFileBack = () => {
    navigate('archive', () => designEye.clearInProgressCase())
  }

  const handleCaseFileSubmit = ({ caseId, verdict, evidenceMap, evidenceTags, confidence, confidenceInferred, elapsedMs, writtenRuling }) => {
    const submission = {
      caseId, verdict, evidenceMap, evidenceTags, confidence,
      confidenceInferred, elapsedMs, writtenRuling,
      timestamp: Date.now(),
    }
    navigate('verdictchamber', () => {
      setLastSubmission(submission)
      designEye.recordSubmission(submission)
      designEye.clearInProgressCase()
    })
  }

  const handleVerdictChamberNext = () => {
    if (curatedMode) {
      const curatedIndex = CURATED_CASES.indexOf(selectedCaseId)
      if (curatedIndex >= 0 && curatedIndex < CURATED_CASES.length - 1) {
        const nextCaseId = CURATED_CASES[curatedIndex + 1]
        navigate('casefile', () => {
          designEye.setInProgressCase(nextCaseId)
          setSelectedCaseId(nextCaseId)
        })
      } else {
        navigate('designeye-intro')
      }
      return
    }
    // Full investigation complete — interstitial reveals the lead insight before the report
    if (designEye.isComplete) {
      navigate('designeye-intro')
      return
    }
    // After the third case closes: meet the panel (once)
    if (designEye.shouldMeetPanel) {
      navigate('meetpanel', () => designEye.markPanelMet())
      return
    }
    // Single midpoint intermission, after Movement II closes
    if (designEye.shouldShowIntermission) {
      navigate('intermission')
      return
    }
    navigate('archive')
  }

  const handleStartCurated = () => {
    const firstCaseId = CURATED_CASES[0]
    setCuratedMode(true)
    navigate('casefile', () => {
      designEye.setInProgressCase(firstCaseId)
      setSelectedCaseId(firstCaseId)
    })
  }

  const handleRestart = () => {
    navigate('coldopen', () => {
      designEye.resetProfile()
      setCuratedMode(false)
      setSelectedCaseId(null)
      setLastSubmission(null)
    })
  }

  const wrapClass = `${styles.viewWrap}${exiting ? ` ${styles.viewExiting}` : ''}`

  if (view === 'coldopen') {
    return <ViewFrame className={wrapClass}><ColdOpen onComplete={handleColdOpenComplete} /></ViewFrame>
  }

  if (view === 'archive') {
    return (
      <ViewFrame className={wrapClass}>
        <Archive
          onSelectCase={handleSelectCase}
          onDesignEye={() => navigate('designeye')}
          onAbout={() => navigate('about')}
          onReset={handleRestart}
          onStartCurated={handleStartCurated}
        />
      </ViewFrame>
    )
  }

  if (view === 'casefile') {
    return (
      <ViewFrame className={wrapClass}>
        <CaseFile
          caseId={selectedCaseId}
          onBack={handleCaseFileBack}
          onSubmit={handleCaseFileSubmit}
        />
      </ViewFrame>
    )
  }

  if (view === 'verdictchamber' && selectedCaseId && lastSubmission) {
    return (
      <ViewFrame className={wrapClass}>
        <VerdictChamber
          caseData={getCaseById(selectedCaseId)}
          submission={lastSubmission}
          onNext={handleVerdictChamberNext}
          onBack={() => navigate('archive')}
          isFinalCase={designEye.isComplete || (curatedMode && selectedCaseId === CURATED_CASES.at(-1))}
        />
      </ViewFrame>
    )
  }

  if (view === 'designeye-intro') {
    const insight = deriveLeadInsight(designEye.profile, CASES)
    return (
      <ViewFrame className={wrapClass}>
        <DesignEyeIntro
          headline={insight.headline}
          onComplete={() => navigate('designeye')}
        />
      </ViewFrame>
    )
  }

  if (view === 'meetpanel') {
    return (
      <ViewFrame className={wrapClass}>
        <MeetThePanel onContinue={() => navigate('archive')} />
      </ViewFrame>
    )
  }

  if (view === 'intermission') {
    return (
      <ViewFrame className={wrapClass}>
        <IntermissionReport
          profile={designEye.profile}
          onContinue={() => navigate('archive')}
        />
      </ViewFrame>
    )
  }

  if (view === 'about') {
    return (
      <ViewFrame className={wrapClass}>
        <About onBack={() => navigate('archive')} />
      </ViewFrame>
    )
  }

  if (view === 'designeye') {
    return (
      <ViewFrame className={wrapClass}>
        <FinalReport
          profile={designEye.profile}
          onRestart={handleRestart}
          onBack={() => navigate('archive')}
          isQuickPathComplete={curatedMode && selectedCaseId === CURATED_CASES.at(-1)}
        />
      </ViewFrame>
    )
  }

  return null
}
