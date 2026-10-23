import { useCallback, useEffect, useRef, useState } from 'react'
import {
  decodeStore,
  emptyStore,
  INVESTIGATION_KEY,
  persistChange,
} from '../investigation/storage.js'

function load() {
  try {
    return {
      store: decodeStore(localStorage.getItem(INVESTIGATION_KEY)),
      error: '',
    }
  } catch (error) {
    return { store: emptyStore(), error: error.message }
  }
}

export function useInvestigations() {
  const [state, setState] = useState(load)
  const current = useRef(state)
  const apply = useCallback((caseId, event, confirm = false) => {
    try {
      const store = persistChange(
        localStorage,
        current.current.store,
        caseId,
        event,
        { id: crypto.randomUUID(), now: Date.now(), confirm },
      )
      current.current = { store, error: '' }
      setState(current.current)
      return store.records[caseId]
    } catch (error) {
      const loaded = load()
      current.current = { ...loaded, error: error.message }
      setState(current.current)
      return null
    }
  }, [])
  const refresh = useCallback(() => {
    current.current = load()
    setState(current.current)
  }, [])
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === INVESTIGATION_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])
  const reset = useCallback(() => {
    localStorage.removeItem(INVESTIGATION_KEY)
    current.current = { store: emptyStore(), error: '' }
    setState(current.current)
  }, [])
  return { ...state, apply, refresh, reset }
}
