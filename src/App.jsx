// Phase 1 verification shell — confirms tokens and fonts render correctly.
// Replace with full component tree in Phase 2+.

export default function App() {
  return (
    <div style={{ padding: '64px', maxWidth: '800px', margin: '0 auto' }}>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-case-number)',
        letterSpacing: 'var(--ls-mono)',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        marginBottom: '16px',
      }}>
        CASE #001 &nbsp;·&nbsp; Phase 1 Token Verification
      </p>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--t-headline)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '8px',
        lineHeight: 1.1,
      }}>
        Design or Disaster
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--t-body-sm)',
        color: 'var(--text-secondary)',
        marginBottom: '48px',
      }}>
        Mobile Banking Dashboard &nbsp;·&nbsp; iOS, 2022
      </p>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
        {[
          { label: 'Strong Design', color: 'var(--clear)', bg: 'var(--clear-dim)' },
          { label: 'Needs Revision', color: 'var(--mixed)', bg: 'var(--mixed-dim)' },
          { label: 'Design Disaster', color: 'var(--guilty)', bg: 'var(--guilty-dim)' },
        ].map(({ label, color, bg }) => (
          <div key={label} style={{
            flex: 1,
            padding: '16px',
            border: `1px solid ${color}`,
            borderRadius: 'var(--radius-lg)',
            background: bg,
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--t-body-med)',
            fontWeight: 600,
            color: color,
            textAlign: 'center',
          }}>
            {label}
          </div>
        ))}
      </div>

      <div style={{
        padding: '24px',
        background: 'var(--surface-raised)',
        borderLeft: '2px solid var(--guilty)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-label)',
          letterSpacing: 'var(--ls-label)',
          color: 'var(--guilty)',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          HIERARCHY &nbsp;·&nbsp; The Scanner &nbsp;&nbsp; GUILTY ●
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--t-body)',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
        }}>
          "The account balance competes with three equally-weighted action buttons,
          leaving the eye with no clear entry point."
        </p>
      </div>

      <div style={{
        padding: '16px 24px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '32px',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-case-number)',
          letterSpacing: 'var(--ls-mono)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
        }}>
          ○ PENDING &nbsp;&nbsp; ● RESOLVED &nbsp;&nbsp; ◐ CONTESTED &nbsp;&nbsp; ◆ LANDMARK
        </p>
      </div>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--t-verdict)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        Needs Revision
      </p>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-label)',
        letterSpacing: 'var(--ls-wide)',
        color: 'var(--amber)',
        textTransform: 'uppercase',
      }}>
        STATUS: CONSENSUS
      </p>

    </div>
  )
}
