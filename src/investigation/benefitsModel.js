export const DEMO = {
  name: 'Alex Sample',
  reference: 'TEST-1042',
  support: 'food',
  contact: 'library',
  declaration: true,
}
export const EMPTY_FORM = {
  name: '',
  reference: '',
  support: '',
  contact: '',
  declaration: false,
}
export const createExhibit = () => ({
  values: { ...EMPTY_FORM },
  errors: {},
  screen: 'form',
  recoveryCode: '',
  recoveryError: '',
  events: [],
})

export function validateBenefits(values) {
  const errors = {}
  if (values.name.trim() !== DEMO.name)
    errors.name = 'Use the fictional name Alex Sample.'
  if (values.reference.trim().toUpperCase() !== DEMO.reference)
    errors.reference = 'Enter the demo reference TEST-1042.'
  if (!['food', 'energy', 'travel'].includes(values.support))
    errors.support = 'Choose one kind of assistance.'
  if (!['library', 'demo-inbox'].includes(values.contact))
    errors.contact = 'Choose a fictional reply route.'
  if (!values.declaration)
    errors.declaration = 'Confirm that you are using fictional details.'
  return errors
}

export function updateExhibit(state, action) {
  if (
    action.type === 'FIELD' &&
    state.screen === 'form' &&
    Object.hasOwn(EMPTY_FORM, action.field)
  ) {
    return {
      ...state,
      values: { ...state.values, [action.field]: action.value },
      errors: { ...state.errors, [action.field]: undefined },
    }
  }
  if (action.type === 'SUBMIT' && state.screen === 'form') {
    const errors = validateBenefits(state.values)
    return {
      ...state,
      errors,
      screen: Object.keys(errors).length ? 'form' : 'receipt',
      events: [
        ...state.events,
        Object.keys(errors).length ? 'validation-shown' : 'task-completed',
      ],
    }
  }
  if (action.type === 'INTERRUPT' && state.screen === 'form')
    return {
      ...state,
      screen: 'interrupted',
      recoveryCode: '',
      recoveryError: '',
      events: [...state.events, 'session-interrupted'],
    }
  if (action.type === 'RECOVERY_CODE' && state.screen === 'interrupted')
    return { ...state, recoveryCode: action.value, recoveryError: '' }
  if (action.type === 'RECOVER' && state.screen === 'interrupted') {
    if (state.recoveryCode.trim().toUpperCase() !== DEMO.reference)
      return {
        ...state,
        recoveryError: 'Use TEST-1042 to restore the fictional draft.',
      }
    return {
      ...state,
      screen: 'form',
      recoveryCode: '',
      recoveryError: '',
      events: [...state.events, 'draft-recovered'],
    }
  }
  if (action.type === 'DISCARD' && state.screen === 'interrupted')
    return { ...createExhibit(), events: [...state.events, 'draft-discarded'] }
  return state
}

export function validExhibit(exhibit) {
  return (
    exhibit &&
    ['form', 'interrupted', 'receipt'].includes(exhibit.screen) &&
    exhibit.values &&
    ['name', 'reference', 'support', 'contact'].every(
      (key) => typeof exhibit.values[key] === 'string',
    ) &&
    typeof exhibit.values.declaration === 'boolean' &&
    exhibit.errors &&
    Object.values(exhibit.errors).every(
      (value) => value == null || typeof value === 'string',
    ) &&
    typeof exhibit.recoveryCode === 'string' &&
    typeof exhibit.recoveryError === 'string' &&
    Array.isArray(exhibit.events) &&
    exhibit.events.every((value) =>
      [
        'validation-shown',
        'task-completed',
        'session-interrupted',
        'draft-recovered',
        'draft-discarded',
      ].includes(value),
    )
  )
}
