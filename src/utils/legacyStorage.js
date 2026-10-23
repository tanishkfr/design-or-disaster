export const LEGACY_KEY = 'design-eye-profile'
export const freshProfile = () => ({ coldOpenCompleted: false, metPanel: false, casesCompleted: 0, submissions: [] })

export function decodeLegacyProfile(raw) {
  if (!raw) return freshProfile()
  const parsed = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) ||
      (parsed.submissions !== undefined && (!Array.isArray(parsed.submissions) ||
        !parsed.submissions.every((item) => item && typeof item === 'object' && typeof item.caseId === 'string'))))
    throw new Error('Unreadable single-look record')
  const submissions = parsed.submissions ?? []
  return { ...freshProfile(), ...parsed, submissions,
    casesCompleted: Number.isFinite(parsed.casesCompleted) ? parsed.casesCompleted : submissions.length }
}

export function saveLegacyProfile(storage, profile, reset = false) {
  // Only an explicitly confirmed reset may replace unreadable older data.
  if (!reset) decodeLegacyProfile(storage.getItem(LEGACY_KEY))
  storage.setItem(LEGACY_KEY, JSON.stringify(profile))
}
