import { useState, useCallback } from 'react'
import { CASES } from '../data/cases'

const STORAGE_KEY = 'design-eye-profile'
const TOTAL_CASES = CASES.length
function createFreshProfile() { return { coldOpenCompleted: false, metPanel: false, casesCompleted: 0, submissions: [] } }
function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createFreshProfile()
    const parsed = JSON.parse(raw)
    return { ...createFreshProfile(), ...parsed, submissions: parsed.submissions ?? [] }
  } catch { return createFreshProfile() }
}
function saveProfile(profile) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)) } catch { /* optional persistence */ } }

export function useDesignEye() {
  const [profile, setProfile] = useState(() => loadProfile())
  const update = useCallback((makeNext) => setProfile((previous) => { const next = makeNext(previous); saveProfile(next); return next }), [])
  const markColdOpenComplete = useCallback(() => update((previous) => ({ ...previous, coldOpenCompleted: true })), [update])
  const markPanelMet = useCallback(() => update((previous) => ({ ...previous, metPanel: true })), [update])
  const setInProgressCase = useCallback((caseId) => update((previous) => ({ ...previous, inProgressCaseId: caseId })), [update])
  const clearInProgressCase = useCallback(() => update((previous) => { const next = { ...previous }; delete next.inProgressCaseId; return next }), [update])
  const recordSubmission = useCallback((submission) => update((previous) => previous.submissions.some((item) => item.caseId === submission.caseId) ? previous : ({ ...previous, casesCompleted: previous.casesCompleted + 1, submissions: [...previous.submissions, submission] })), [update])
  const resetProfile = useCallback(() => { const fresh = createFreshProfile(); saveProfile(fresh); setProfile(fresh) }, [])
  const hasSubmittedCase = useCallback((caseId) => profile.submissions.some((item) => item.caseId === caseId), [profile.submissions])
  const getSubmission = useCallback((caseId) => profile.submissions.find((item) => item.caseId === caseId) ?? null, [profile.submissions])
  return {
    profile, markColdOpenComplete, markPanelMet,
    shouldMeetPanel: profile.casesCompleted === 3 && !profile.metPanel,
    recordSubmission, setInProgressCase, clearInProgressCase, resetProfile, hasSubmittedCase, getSubmission,
    shouldShowIntermission: profile.casesCompleted === 6,
    isComplete: profile.casesCompleted >= TOTAL_CASES,
  }
}
