import { useEffect, useRef } from 'react'
import { DEMO } from '../../investigation/benefitsModel'
import styles from './BenefitsForm.module.css'

export default function BenefitsForm({ state, onAction, frozen = false }) {
  const summary = useRef(null)
  const screenTitle = useRef(null)
  const previousScreen = useRef(state.screen)
  const hasErrors = Object.values(state.errors).some(Boolean)
  useEffect(() => {
    if (frozen) return
    if (hasErrors) summary.current?.focus()
  }, [hasErrors, state.events.length, frozen])
  useEffect(() => {
    if (!frozen && previousScreen.current !== state.screen)
      screenTitle.current?.focus()
    previousScreen.current = state.screen
  }, [state.screen, frozen])
  const field = (key, label, help) => (
    <div className={styles.field}>
      <label htmlFor={`demo-${key}`}>{label}</label>
      <p id={`demo-${key}-hint`}>{help}</p>
      {state.errors[key] && (
        <span className={styles.errorText} id={`demo-${key}-error`}>
          {state.errors[key]}
        </span>
      )}
      <input
        id={`demo-${key}`}
        value={state.values[key]}
        onChange={(event) =>
          onAction?.({
            type: 'FIELD',
            field: key,
            value: event.target.value.slice(0, 40),
          })
        }
        aria-invalid={Boolean(state.errors[key])}
        aria-describedby={`demo-${key}-hint${state.errors[key] ? ` demo-${key}-error` : ''}`}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
  return (
    <div className={styles.portal} inert={frozen ? true : undefined}>
      <header className={styles.header}>
        <strong>BENEFITS PORTAL</strong>
        <span>LOCAL DEMO</span>
      </header>
      <div className={styles.notice}>
        Fictional test application. No eligibility decision. Nothing is sent to
        a service.
      </div>
      <div className={styles.content}>
        {state.screen === 'interrupted' ? (
          <section className={styles.interrupted} data-evidence-region="form-recovery">
            <h2 ref={screenTitle} tabIndex="-1">
              Session interrupted.
            </h2>
            <p>
              The shared screen is locked. Your fictional draft is hidden, not
              discarded.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onAction?.({ type: 'RECOVER' })
              }}
            >
              <label htmlFor="demo-recovery">Demo recovery reference</label>
              <p>
                For this authored scenario, enter <strong>TEST-1042</strong>.
                This is a simulation of recovery, not real authentication.
              </p>
              <input
                id="demo-recovery"
                value={state.recoveryCode}
                onChange={(event) =>
                  onAction?.({
                    type: 'RECOVERY_CODE',
                    value: event.target.value.slice(0, 40),
                  })
                }
                autoComplete="off"
                aria-invalid={Boolean(state.recoveryError)}
                aria-describedby={
                  state.recoveryError ? 'demo-recovery-error' : undefined
                }
              />
              {state.recoveryError && (
                <p
                  id="demo-recovery-error"
                  role="alert"
                  className={styles.errorText}
                >
                  {state.recoveryError}
                </p>
              )}
              <button className={styles.submit} type="submit">
                Restore demo draft
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => onAction?.({ type: 'DISCARD' })}
              >
                Discard this demo draft
              </button>
            </form>
          </section>
        ) : state.screen === 'receipt' ? (
          <section className={styles.receipt} data-evidence-region="form-receipt">
            <h2 ref={screenTitle} tabIndex="-1">
              Demo application received.
            </h2>
            <p>
              Reference <strong>TEST-1042</strong>
            </p>
            <p>
              The local validation task is complete. This is an authored
              outcome, not a benefits application or eligibility decision.
            </p>
            <dl>
              <dt>Demo applicant</dt>
              <dd>{state.values.name}</dd>
              <dt>Assistance</dt>
              <dd>{state.values.support}</dd>
              <dt>Reply route</dt>
              <dd>{state.values.contact}</dd>
            </dl>
          </section>
        ) : (
          <>
            <h2 ref={screenTitle} tabIndex="-1">
              Emergency Assistance Application
            </h2>
            <p>Complete the fictional task. All fields are required.</p>
            <div className={styles.warning} data-evidence-region="form-warning">
              <strong>Shared computer?</strong> You can interrupt this demo
              session without a countdown. Try recovering your progress
              afterwards.
              <button
                type="button"
                onClick={() => onAction?.({ type: 'INTERRUPT' })}
              >
                Simulate interruption
              </button>
            </div>
            {hasErrors && (
              <div
                className={styles.errorSummary} data-evidence-region="form-errors"
                tabIndex="-1"
                ref={summary}
                aria-label="Application errors"
              >
                <h3>There is a problem</h3>
                <ul>
                  {Object.entries(state.errors)
                    .filter(([, message]) => message)
                    .map(([key, message]) => (
                      <li key={key}>
                        <a
                          href={`#demo-${key}`}
                          onClick={(event) => {
                            event.preventDefault()
                            document.getElementById(`demo-${key}`)?.focus()
                          }}
                        >
                          {message}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <form data-evidence-region="form-fields"
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                onAction?.({ type: 'SUBMIT' })
              }}
            >
              {field(
                'name',
                'Fictional applicant name',
                `Use ${DEMO.name}. Do not enter your own name.`,
              )}
              {field(
                'reference',
                'Demo reference',
                'Use TEST-1042. No identity or insurance number is needed.',
              )}
              <div className={styles.field}>
                <label htmlFor="demo-support">Assistance to explore</label>
                <select
                  id="demo-support"
                  value={state.values.support}
                  onChange={(event) =>
                    onAction?.({
                      type: 'FIELD',
                      field: 'support',
                      value: event.target.value,
                    })
                  }
                  aria-invalid={Boolean(state.errors.support)}
                  aria-describedby={
                    state.errors.support ? 'demo-support-error' : undefined
                  }
                >
                  <option value="">Choose assistance</option>
                  <option value="food">Food</option>
                  <option value="energy">Energy</option>
                  <option value="travel">Travel</option>
                </select>
                {state.errors.support && (
                  <span id="demo-support-error" className={styles.errorText}>
                    {state.errors.support}
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="demo-contact">Fictional reply route</label>
                <select
                  id="demo-contact"
                  value={state.values.contact}
                  onChange={(event) =>
                    onAction?.({
                      type: 'FIELD',
                      field: 'contact',
                      value: event.target.value,
                    })
                  }
                  aria-invalid={Boolean(state.errors.contact)}
                  aria-describedby={
                    state.errors.contact ? 'demo-contact-error' : undefined
                  }
                >
                  <option value="">Choose a reply route</option>
                  <option value="library">
                    Collect from the demo library desk
                  </option>
                  <option value="demo-inbox">
                    Send to the fictional demo inbox
                  </option>
                </select>
                {state.errors.contact && (
                  <span id="demo-contact-error" className={styles.errorText}>
                    {state.errors.contact}
                  </span>
                )}
              </div>
              <label className={styles.checkbox}>
                <input
                  id="demo-declaration"
                  type="checkbox"
                  checked={state.values.declaration}
                  onChange={(event) =>
                    onAction?.({
                      type: 'FIELD',
                      field: 'declaration',
                      value: event.target.checked,
                    })
                  }
                  aria-invalid={Boolean(state.errors.declaration)}
                  aria-describedby={
                    state.errors.declaration
                      ? 'demo-declaration-error'
                      : undefined
                  }
                />
                I am using fictional details for this demonstration.
              </label>
              {state.errors.declaration && (
                <span id="demo-declaration-error" className={styles.errorText}>
                  {state.errors.declaration}
                </span>
              )}
              <button type="submit" className={styles.submit}>
                Submit demo application
              </button>
            </form>
          </>
        )}
      </div>
      <footer className={styles.footer}>
        Authored reconstruction / behavior is illustrative, not a verified
        source service.
      </footer>
    </div>
  )
}
