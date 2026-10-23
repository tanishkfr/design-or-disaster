import { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'
import { useDesignEye } from './hooks/useDesignEye'
import { getCaseById, CASES } from './data/cases'
import { deriveLeadInsight } from './utils/reportInsights'
import { useInvestigations } from './hooks/useInvestigations'
import { CURATED_IDS, investigationFor } from './investigation/capabilities'
import { toLegacySubmission } from './investigation/engine'
import CompleteReport from './components/DesignEye/CompleteReport'
import Perspectives from './components/Investigation/Perspectives'
import Investigation from './components/Investigation/Investigation'
import Cover from './components/Cover'
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
      <a className={styles.skipLink} href="#main-content" onClick={(e) => {
        e.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>
        Skip to main content
      </a>
      <main className={styles.main} id="main-content" tabIndex="-1">
        {children}
      </main>
    </section>
  )
}

export default function App() {
  const designEye = useDesignEye()
  const investigations = useInvestigations()
  const unfinished = Object.values(investigations.store.records).find(
    (record) => record.stage !== 'COMPLETE',
  )
  const syncCompletion = designEye.recordInvestigationCompletion
  useEffect(() => {
    Object.values(investigations.store.records).forEach((record) => {
      const submission = toLegacySubmission(record)
      if (submission) syncCompletion(submission)
    })
  }, [investigations.store.records, syncCompletion])

  const initialRoute = new URLSearchParams(window.location.hash.slice(1))
  const routeCase = getCaseById(initialRoute.get('case'))?.id
  const requestedView = initialRoute.get('view')
  const routeAllowed =
    [
      'cover',
      'archive',
      'designeye',
      'about',
      'legacyreport',
      'coldopen',
      'designeye-intro',
      'intermission',
      'meetpanel',
    ].includes(requestedView) ||
    (['investigation', 'perspectives'].includes(requestedView) &&
      routeCase &&
      investigations.store.records[routeCase]) ||
    ((requestedView === 'casefile' ||
      (requestedView === 'verdictchamber' &&
        designEye.getSubmission(routeCase))) &&
      routeCase)
  const [view, setView] = useState(
    routeAllowed
      ? requestedView
      : unfinished
        ? 'investigation'
        : designEye.profile.coldOpenCompleted ||
            Object.keys(investigations.store.records).length
          ? 'archive'
          : 'cover',
  )
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(null)
  useEffect(() => () => clearTimeout(exitTimer.current), [])
  const [selectedCaseId, setSelectedCaseId] = useState(
    routeCase ?? unfinished?.caseId ?? null,
  )
  const [lastSubmission, setLastSubmission] = useState(() =>
    routeCase ? designEye.getSubmission(routeCase) : null,
  )
  const [curatedMode, setCuratedMode] = useState(
    initialRoute.get('path') === 'short',
  )
  const [perspectiveAttempt, setPerspectiveAttempt] = useState(null)

  const routeInitialized = useRef(false)
  const fromHistory = useRef(false)
  useEffect(() => {
    const onPop = () => {
      clearTimeout(exitTimer.current)
      const params = new URLSearchParams(window.location.hash.slice(1)),
        id = getCaseById(params.get('case'))?.id
      fromHistory.current = true
      setSelectedCaseId(id ?? null)
      setLastSubmission(id ? designEye.getSubmission(id) : null)
      setCuratedMode(params.get('path') === 'short')
      const destination = params.get('view') || 'archive'
      const validDestination =
        !(
          ['investigation', 'perspectives'].includes(destination) &&
          !investigations.store.records[id]
        ) && !(destination === 'verdictchamber' && !designEye.getSubmission(id))
      setView(
        validDestination &&
          [
            'cover',
            'archive',
            'designeye',
            'about',
            'legacyreport',
            'coldopen',
            'casefile',
            'verdictchamber',
            'investigation',
            'perspectives',
          ].includes(destination)
          ? destination
          : 'archive',
      )
      setExiting(false)
      window.scrollTo(0, 0)
      requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [designEye, investigations.store.records])
  useEffect(() => {
    const params = new URLSearchParams({ view })
    if (
      selectedCaseId &&
      ['investigation', 'perspectives', 'casefile', 'verdictchamber'].includes(
        view,
      )
    )
      params.set('case', selectedCaseId)
    if (
      curatedMode &&
      [
        'casefile',
        'verdictchamber',
        'designeye-intro',
        'legacyreport',
      ].includes(view)
    ) {
      params.set('path', 'short')
      if (selectedCaseId) params.set('case', selectedCaseId)
    }
    const hash = '#' + params.toString()
    if (fromHistory.current) fromHistory.current = false
    else if (window.location.hash !== hash)
      window.history[
        routeInitialized.current &&
        !window.location.hash.includes('view=designeye-intro')
          ? 'pushState'
          : 'replaceState'
      ](null, '', hash)
    routeInitialized.current = true
  }, [view, selectedCaseId, curatedMode])

  useEffect(() => {
    const selectedCase = selectedCaseId ? getCaseById(selectedCaseId) : null
    const viewTitle = {
      investigation: 'Second Look Investigation',
      cover: 'Design or Disaster?',
      coldopen: 'Design or Disaster?',
      archive: 'Case Archive',
      about: 'About the Investigation',
      meetpanel: 'Meet the Panel',
      intermission: 'Intermission Report',
      'designeye-intro': 'Your Design Eye',
      designeye: 'Investigation Record',
      legacyreport: 'Legacy investigation record',
      perspectives: 'Authored perspectives',
      casefile: selectedCase
        ? selectedCase.number + ': ' + selectedCase.title
        : 'Case File',
      verdictchamber: selectedCase
        ? selectedCase.number + ': Overlaid Jury'
        : 'Panel comparison',
    }[view]
    document.title =
      (viewTitle ?? 'Design or Disaster?') + ' | Design or Disaster?'
  }, [selectedCaseId, view])

  const navigate = (newView, updateFn) => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.activeElement?.matches(':focus-visible')
    setExiting(true)
    exitTimer.current = setTimeout(() => {
      if (updateFn) updateFn()
      setView(newView)
      setExiting(false)
      window.scrollTo(0, 0)
      requestAnimationFrame(() =>
        document.getElementById('main-content')?.focus({ preventScroll: true }),
      )
    }, instant ? 0 : 120)
  }

  const handleColdOpenComplete = ({
    verdict,
    evidenceMap,
    evidenceTags,
    writtenRuling,
    timestamp,
  }) => {
    const submission = {
      caseId: 'case-001',
      verdict,
      evidenceMap,
      evidenceTags,
      writtenRuling,
      confidence: null,
      confidenceInferred: false,
      timestamp,
    }
    navigate('verdictchamber', () => {
      designEye.recordSubmission(submission)
      designEye.markColdOpenComplete()
      setSelectedCaseId('case-001')
      setLastSubmission(submission)
    })
  }

  const handleLegacyCase = (caseId) => {
    setCuratedMode(false)
    const saved = designEye.getSubmission(caseId)
    if (saved && !saved.investigationId)
      navigate('verdictchamber', () => {
        setSelectedCaseId(caseId)
        setLastSubmission(saved)
      })
    else
      navigate('casefile', () => {
        designEye.setInProgressCase(caseId)
        setSelectedCaseId(caseId)
      })
  }

  const handleSelectCase = (caseId) => {
    setPerspectiveAttempt(null)
    setCuratedMode(false)
    if (investigationFor(getCaseById(caseId))) {
      const started = investigations.apply(caseId, { type: 'START' })
      if (started) navigate('investigation', () => setSelectedCaseId(caseId))
      return
    }
    const saved = designEye.getSubmission(caseId)
    if (saved) {
      navigate('verdictchamber', () => {
        setSelectedCaseId(caseId)
        setLastSubmission(saved)
      })
      return
    }
    navigate('casefile', () => {
      designEye.setInProgressCase(caseId)
      setSelectedCaseId(caseId)
    })
  }

  const handleCaseFileBack = () => {
    navigate('archive', () => designEye.clearInProgressCase())
  }

  const handleCaseFileSubmit = ({
    caseId,
    verdict,
    evidenceMap,
    evidenceTags,
    confidence,
    confidenceInferred,
    elapsedMs,
    writtenRuling,
  }) => {
    const submission = {
      caseId,
      verdict,
      evidenceMap,
      evidenceTags,
      confidence,
      confidenceInferred,
      elapsedMs,
      writtenRuling,
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
    navigate('cover', () => {
      investigations.reset()
      designEye.resetProfile()
      setCuratedMode(false)
      setSelectedCaseId(null)
      setLastSubmission(null)
    })
  }

  const wrapClass = `${styles.viewWrap}${exiting ? ` ${styles.viewExiting}` : ''}`

  if (
    view === 'investigation' &&
    selectedCaseId &&
    investigations.store.records[selectedCaseId]
  ) {
    const record = investigations.store.records[selectedCaseId]
    const legacy = designEye.getSubmission(selectedCaseId)
    return (
      <ViewFrame className={wrapClass}>
        <Investigation
          key={record.id}
          record={record}
          caseData={getCaseById(selectedCaseId)}
          apply={investigations.apply}
          error={investigations.error || designEye.storageError}
          history={investigations.store.history[selectedCaseId]}
          onBack={() => navigate('archive')}
          onPanel={(attempt) => {
            if (!investigationFor(getCaseById(selectedCaseId)).sealed)
              navigate('perspectives', () => setPerspectiveAttempt(attempt))
          }}
          onNext={
            CURATED_IDS.indexOf(selectedCaseId) < CURATED_IDS.length - 1
              ? () =>
                  handleSelectCase(
                    CURATED_IDS[CURATED_IDS.indexOf(selectedCaseId) + 1],
                  )
              : null
          }
          onReport={() => navigate('designeye')}
          onLegacy={
            legacy && !legacy.investigationId
              ? () =>
                  navigate('verdictchamber', () => setLastSubmission(legacy))
              : null
          }
        />
      </ViewFrame>
    )
  }

  if (view === 'cover')
    return (
      <ViewFrame className={wrapClass}>
        <Cover
          onBegin={() => handleSelectCase('case-001')}
          onArchive={() => navigate('archive')}
        />
      </ViewFrame>
    )

  if (view === 'coldopen') {
    return (
      <ViewFrame className={wrapClass}>
        <ColdOpen
          onComplete={handleColdOpenComplete}
          onBack={() => navigate('cover')}
        />
      </ViewFrame>
    )
  }

  if (view === 'archive') {
    return (
      <ViewFrame className={wrapClass}>
        <Archive
          investigationRecords={investigations.store.records}
          investigationError={investigations.error || designEye.storageError}
          onCover={() => navigate('cover')}
          onSelectCase={handleSelectCase}
          onLegacyCase={handleLegacyCase}
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
          onReflection={
            lastSubmission.investigationId
              ? () => navigate('investigation')
              : null
          }
          submission={lastSubmission}
          onNext={handleVerdictChamberNext}
          onBack={() => navigate('archive')}
          isFinalCase={
            designEye.isComplete ||
            (curatedMode && selectedCaseId === CURATED_CASES.at(-1))
          }
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
          onComplete={() => navigate('legacyreport')}
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

  if (
    view === 'perspectives' &&
    selectedCaseId &&
    investigations.store.records[selectedCaseId]
  )
    return (
      <ViewFrame className={wrapClass}>
        <Perspectives
          record={
            perspectiveAttempt?.caseId === selectedCaseId
              ? perspectiveAttempt
              : investigations.store.records[selectedCaseId]
          }
          caseData={getCaseById(selectedCaseId)}
          onBack={() => navigate('investigation')}
        />
      </ViewFrame>
    )

  if (view === 'designeye')
    return (
      <ViewFrame className={wrapClass}>
        <CompleteReport
          records={investigations.store.records}
          legacy={designEye.profile.submissions}
          storageError={designEye.storageError}
          onBack={() => navigate('archive')}
          onCase={handleSelectCase}
          onLegacy={() => navigate('legacyreport')}
        />
      </ViewFrame>
    )

  if (view === 'legacyreport') {
    return (
      <ViewFrame className={wrapClass}>
        <FinalReport
          profile={designEye.profile}
          onRestart={handleRestart}
          onBack={() => navigate('archive')}
          isQuickPathComplete={
            curatedMode && selectedCaseId === CURATED_CASES.at(-1)
          }
        />
      </ViewFrame>
    )
  }

  return null
}
