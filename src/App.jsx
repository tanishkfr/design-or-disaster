import { useState, useCallback, useRef } from 'react'
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

export default function App() {
  const designEye = useDesignEye()

  const [view, setView] = useState(designEye.profile.coldOpenCompleted ? 'archive' : 'coldopen')
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(null)
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [lastSubmission, setLastSubmission] = useState(null)

  const navigate = useCallback((newView, updateFn) => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    setExiting(true)
    exitTimer.current = setTimeout(() => {
      if (updateFn) updateFn()
      setView(newView)
      setExiting(false)
    }, 200)
  }, [])

  const handleColdOpenComplete = ({ verdict, timestamp }) => {
    designEye.recordSubmission({
      caseId: 'case-001',
      verdict,
      evidenceTags: [],
      confidence: null,
      timestamp,
    })
    designEye.markColdOpenComplete()
    navigate('archive')
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

  const handleCaseFileSubmit = ({ caseId, verdict, evidencePlate, evidenceTags, confidence, confidenceInferred, elapsedMs, writtenRuling }) => {
    const submission = {
      caseId, verdict, evidencePlate, evidenceTags, confidence,
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

  const handleRestart = () => {
    navigate('coldopen', () => {
      designEye.resetProfile()
      setSelectedCaseId(null)
      setLastSubmission(null)
    })
  }

  const wrapClass = `${styles.viewWrap}${exiting ? ` ${styles.viewExiting}` : ''}`

  if (view === 'coldopen') {
    return <div className={wrapClass}><ColdOpen onComplete={handleColdOpenComplete} /></div>
  }

  if (view === 'archive') {
    return (
      <div className={wrapClass}>
        <Archive
          onSelectCase={handleSelectCase}
          onDesignEye={() => navigate('designeye')}
          onAbout={() => navigate('about')}
          onReset={handleRestart}
        />
      </div>
    )
  }

  if (view === 'casefile') {
    return (
      <div className={wrapClass}>
        <CaseFile
          caseId={selectedCaseId}
          onBack={handleCaseFileBack}
          onSubmit={handleCaseFileSubmit}
        />
      </div>
    )
  }

  if (view === 'verdictchamber' && selectedCaseId && lastSubmission) {
    return (
      <div className={wrapClass}>
        <VerdictChamber
          caseData={getCaseById(selectedCaseId)}
          submission={lastSubmission}
          onNext={handleVerdictChamberNext}
          onBack={() => navigate('archive')}
          isFinalCase={designEye.isComplete}
        />
      </div>
    )
  }

  if (view === 'designeye-intro') {
    const insight = deriveLeadInsight(designEye.profile, CASES)
    return (
      <div className={wrapClass}>
        <DesignEyeIntro
          headline={insight.headline}
          onComplete={() => navigate('designeye')}
        />
      </div>
    )
  }

  if (view === 'meetpanel') {
    return (
      <div className={wrapClass}>
        <MeetThePanel onContinue={() => navigate('archive')} />
      </div>
    )
  }

  if (view === 'intermission') {
    return (
      <div className={wrapClass}>
        <IntermissionReport
          profile={designEye.profile}
          onContinue={() => navigate('archive')}
        />
      </div>
    )
  }

  if (view === 'about') {
    return (
      <div className={wrapClass}>
        <About onBack={() => navigate('archive')} />
      </div>
    )
  }

  if (view === 'designeye') {
    return (
      <div className={wrapClass}>
        <FinalReport
          profile={designEye.profile}
          onRestart={handleRestart}
          onBack={() => navigate('archive')}
        />
      </div>
    )
  }

  return null
}
