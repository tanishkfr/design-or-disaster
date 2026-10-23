import { createInvestigation, transition, validateRecord } from './engine.js'

export const INVESTIGATION_KEY = 'design-disaster-investigations-v1'
export const emptyStore = () => ({ schemaVersion: 1, records: {}, history: {} })

export function decodeStore(raw) {
  if (!raw) return emptyStore()
  const parsed = JSON.parse(raw)
  if (
    parsed.schemaVersion !== 1 ||
    !parsed.records ||
    !parsed.history ||
    !Object.entries(parsed.records).every(
      ([id, record]) => record.caseId === id && validateRecord(record),
    ) ||
    !Object.entries(parsed.history).every(
      ([id, records]) =>
        Array.isArray(records) &&
        records.every(
          (record) =>
            record.caseId === id &&
            record.stage === 'COMPLETE' &&
            validateRecord(record),
        ),
    )
  ) {
    throw new Error(
      'Saved investigation data could not be read. The original data has been kept untouched.',
    )
  }
  return parsed
}

export function changeStore(
  store,
  caseId,
  event,
  { id, now, confirm = false } = {},
) {
  const record = store.records[caseId]
  if (event.type === 'START' && record) return store
  if (event.type === 'START' || event.type === 'RESTART') {
    if (event.type === 'RESTART' && !confirm)
      throw new Error('Confirm before starting a new attempt.')
    const history =
      record?.stage === 'COMPLETE'
        ? [...(store.history[caseId] ?? []), record]
        : (store.history[caseId] ?? [])
    return {
      ...store,
      records: {
        ...store.records,
        [caseId]: createInvestigation(caseId, id, now),
      },
      history: { ...store.history, [caseId]: history },
    }
  }
  if (!record) throw new Error('Start this investigation first.')
  return {
    ...store,
    records: { ...store.records, [caseId]: transition(record, event, now) },
  }
}

// Read immediately before writing; a stale tab cannot replace a newer revision.
export function persistChange(storage, expectedStore, caseId, event, options) {
  const fresh = decodeStore(storage.getItem(INVESTIGATION_KEY))
  const expected = expectedStore.records[caseId],
    current = fresh.records[caseId]
  if (expected?.id !== current?.id || expected?.revision !== current?.revision)
    throw new Error(
      'This investigation changed in another tab. Reopen it to continue from the latest saved step.',
    )
  const next = changeStore(fresh, caseId, event, options)
  storage.setItem(INVESTIGATION_KEY, JSON.stringify(next))
  return next
}
