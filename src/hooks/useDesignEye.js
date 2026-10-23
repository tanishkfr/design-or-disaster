import { useState, useCallback, useEffect } from 'react'
import { CASES } from '../data/cases'
import { LEGACY_KEY, freshProfile, decodeLegacyProfile, saveLegacyProfile } from '../utils/legacyStorage'

const TOTAL_CASES = CASES.length
const storageMessage = 'Single-look storage is unavailable or unreadable. Existing data has been kept untouched; new single-look changes are available only in this tab until saving works.'
function loadProfile() {
  try {
    return { profile: decodeLegacyProfile(localStorage.getItem(LEGACY_KEY)), storageError: '' }
  } catch {
    return { profile: freshProfile(), storageError: storageMessage }
  }
}
function saveProfile(profile, reset = false) {
  try {
    saveLegacyProfile(localStorage, profile, reset)
    return ''
  } catch {
    return storageMessage
  }
}

export function useDesignEye() {
  const [state, setState] = useState(loadProfile)
  const { profile, storageError } = state
  useEffect(() => {
    const refresh = (event) => {
      if (event.key === LEGACY_KEY || event.key === null) setState(loadProfile())
    }
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])
  const update = useCallback(
    (makeNext) =>
      setState((previous) => {
        const next = makeNext(previous.profile)
        return { profile: next, storageError: saveProfile(next) }
      }),
    [],
  )
  const markColdOpenComplete = useCallback(
    () => update((previous) => ({ ...previous, coldOpenCompleted: true })),
    [update],
  )
  const markPanelMet = useCallback(
    () => update((previous) => ({ ...previous, metPanel: true })),
    [update],
  )
  const setInProgressCase = useCallback(
    (caseId) =>
      update((previous) => ({ ...previous, inProgressCaseId: caseId })),
    [update],
  )
  const clearInProgressCase = useCallback(
    () =>
      update((previous) => {
        const next = { ...previous }
        delete next.inProgressCaseId
        return next
      }),
    [update],
  )
  const recordSubmission = useCallback(
    (submission) =>
      update((previous) =>
        previous.submissions.some((item) => item.caseId === submission.caseId)
          ? previous
          : {
              ...previous,
              casesCompleted: previous.casesCompleted + 1,
              submissions: [...previous.submissions, submission],
            },
      ),
    [update],
  )
  const recordInvestigationCompletion = useCallback(
    (submission) =>
      update((previous) => {
        const cleared =
          previous.inProgressCaseId === submission.caseId
            ? (() => {
                const next = { ...previous }
                delete next.inProgressCaseId
                return next
              })()
            : previous
        const existing = previous.submissions.find(
          (item) => item.caseId === submission.caseId,
        )
        // An earlier single-look record remains readable, never silently replaced.
        if (
          existing &&
          (!existing.investigationId ||
            (existing.investigationId === submission.investigationId &&
              existing.timestamp === submission.timestamp))
        )
          return cleared
        const submissions = existing
          ? previous.submissions.map((item) =>
              item.caseId === submission.caseId ? submission : item,
            )
          : [...previous.submissions, submission]
        return { ...cleared, submissions, casesCompleted: submissions.length }
      }),
    [update],
  )
  const resetProfile = useCallback(() => {
    const fresh = freshProfile()
    setState({ profile: fresh, storageError: saveProfile(fresh, true) })
  }, [])
  const hasSubmittedCase = useCallback(
    (caseId) => profile.submissions.some((item) => item.caseId === caseId),
    [profile.submissions],
  )
  const getSubmission = useCallback(
    (caseId) =>
      profile.submissions.find((item) => item.caseId === caseId) ?? null,
    [profile.submissions],
  )
  return {
    profile,
    storageError,
    markColdOpenComplete,
    markPanelMet,
    shouldMeetPanel: profile.casesCompleted === 3 && !profile.metPanel,
    recordSubmission,
    recordInvestigationCompletion,
    setInProgressCase,
    clearInProgressCase,
    resetProfile,
    hasSubmittedCase,
    getSubmission,
    shouldShowIntermission: profile.casesCompleted === 6,
    isComplete: profile.casesCompleted >= TOTAL_CASES,
  }
}
