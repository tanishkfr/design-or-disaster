import { useState, useCallback } from 'react';
import { CASES } from '../data/cases';
import {
  calculateAccuracy,
  calculateConfidenceCalibration,
  calculateCategoryAccuracy,
  calculateJurorAlignment,
} from '../utils/scoring';

const STORAGE_KEY = 'design-eye-profile';

const TOTAL_CASES = CASES.length;

function createFreshProfile() {
  return {
    coldOpenCompleted: false,
    metPanel: false,
    casesCompleted: 0,
    submissions: [],
    accuracyByCategory: {},
    overallAccuracy: 0,
    confidenceCalibration: null,
    jurorAlignment: {},
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createFreshProfile();
    return JSON.parse(raw);
  } catch {
    return createFreshProfile();
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable — continue without persistence
  }
}

function recomputeStats(profile) {
  return {
    ...profile,
    overallAccuracy: calculateAccuracy(profile.submissions, CASES),
    confidenceCalibration: calculateConfidenceCalibration(profile.submissions, CASES),
    accuracyByCategory: calculateCategoryAccuracy(profile.submissions, CASES),
    jurorAlignment: calculateJurorAlignment(profile.submissions, CASES),
  };
}

export function useDesignEye() {
  const [profile, setProfile] = useState(() => loadProfile());

  const markColdOpenComplete = useCallback(() => {
    setProfile((prev) => {
      const next = { ...prev, coldOpenCompleted: true };
      saveProfile(next);
      return next;
    });
  }, []);

  const recordSubmission = useCallback((submission) => {
    // submission: { caseId, verdict, evidenceTags, confidence, timestamp }
    setProfile((prev) => {
      const alreadySubmitted = prev.submissions.some(
        (s) => s.caseId === submission.caseId
      );
      if (alreadySubmitted) return prev;

      const updated = {
        ...prev,
        casesCompleted: prev.casesCompleted + 1,
        submissions: [...prev.submissions, submission],
      };
      const next = recomputeStats(updated);
      saveProfile(next);
      return next;
    });
  }, []);

  const setInProgressCase = useCallback((caseId) => {
    setProfile((prev) => {
      const next = { ...prev, inProgressCaseId: caseId };
      saveProfile(next);
      return next;
    });
  }, []);

  const clearInProgressCase = useCallback(() => {
    setProfile((prev) => {
      const rest = { ...prev };
      delete rest.inProgressCaseId;
      saveProfile(rest);
      return rest;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const fresh = createFreshProfile();
    saveProfile(fresh);
    setProfile(fresh);
  }, []);

  const hasSubmittedCase = useCallback(
    (caseId) => profile.submissions.some((s) => s.caseId === caseId),
    [profile.submissions]
  );

  const getSubmission = useCallback(
    (caseId) => profile.submissions.find((s) => s.caseId === caseId) ?? null,
    [profile.submissions]
  );

  const markPanelMet = useCallback(() => {
    setProfile((prev) => {
      const next = { ...prev, metPanel: true };
      saveProfile(next);
      return next;
    });
  }, []);

  // Meet the Panel fires once, after the third case closes
  const shouldMeetPanel = profile.casesCompleted === 3 && !profile.metPanel;

  // One intermission, at the midpoint — after Movement II closes
  const shouldShowIntermission = profile.casesCompleted === 6;

  const isComplete = profile.casesCompleted >= TOTAL_CASES;

  return {
    profile,
    markColdOpenComplete,
    markPanelMet,
    shouldMeetPanel,
    recordSubmission,
    setInProgressCase,
    clearInProgressCase,
    resetProfile,
    hasSubmittedCase,
    getSubmission,
    shouldShowIntermission,
    isComplete,
  };
}
