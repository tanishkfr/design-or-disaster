import { useEffect, useRef } from 'react'
import {
  TRANSACTIONS,
  LISTINGS,
  PRODUCTS,
  visibleListings,
} from '../../investigation/exhibitModels'
import styles from './CollectionExhibits.module.css'

function ExhibitShell({ children, frozen, className, label, screen }) {
  const root = useRef(null)
  useEffect(() => {
    if (!frozen && document.activeElement === document.body)
      root.current?.querySelector('h2[tabindex]')?.focus()
  }, [screen, frozen])
  return (
    <div
      ref={root}
      className={className}
      inert={frozen ? true : undefined}
      aria-label={label}
    >
      {children}
    </div>
  )
}
export function Banking({ state: s, onAction: a, frozen }) {
  const action = (value) => a?.(value)
  const selected = TRANSACTIONS.find((t) => t.id === s.transaction)
  return (
    <ExhibitShell
      frozen={frozen}
      className={styles.bank}
      label="Fictional banking reconstruction"
      screen={s.screen}
    >
      <header>
        <strong>current.</strong>
        <span>DEMO ACCOUNT</span>
      </header>
      <nav aria-label="Bank navigation" data-evidence-region="bank-nav">
        <button aria-pressed={s.screen === 'dashboard'} onClick={() => action({ type: 'OPEN', screen: 'dashboard' })}>
          Overview
        </button>
        <button
          aria-pressed={s.screen === 'transactions'}
          onClick={() => action({ type: 'OPEN', screen: 'transactions' })}
        >
          Activity
        </button>
        <button aria-pressed={s.screen === 'transfer'} onClick={() => action({ type: 'OPEN', screen: 'transfer' })}>
          Transfer
        </button>
      </nav>
      <div className={styles.bankBody}>
        {s.screen === 'dashboard' && (
          <>
            <section className={styles.balance} data-evidence-region="balance">
              <p>Available balance / fictional</p>
              <strong>£2,847.50</strong>
              <span>Current account • 4521</span>
            </section>
            <div className={styles.quick} data-evidence-region="quick-actions">
              <button
                onClick={() => action({ type: 'OPEN', screen: 'transfer' })}
              >
                Send money
              </button>
              <button
                onClick={() => action({ type: 'OPEN', screen: 'transactions' })}
              >
                Find a payment
              </button>
              <button
                onClick={() => action({ type: 'OPEN', screen: 'transactions' })}
              >
                Account activity
              </button>
            </div>
            <h2>Recent activity</h2>
          </>
        )}
        {(s.screen === 'transactions' || s.screen === 'dashboard') && (
          <section data-evidence-region="transactions">
            {s.screen === 'transactions' && (
              <label>
                Find a transaction
                <input
                  value={s.query}
                  onChange={(e) =>
                    action({ type: 'SEARCH', value: e.target.value })
                  }
                  placeholder="Try Northline"
                />
              </label>
            )}
            {TRANSACTIONS.filter(
              (t) =>
                s.screen === 'dashboard' ||
                t.name.toLowerCase().includes(s.query.toLowerCase()),
            ).map((t) => (
              <button
                key={t.id}
                className={styles.transaction}
                onClick={() => action({ type: 'TRANSACTION', id: t.id })}
              >
                <span>
                  {t.name}
                  <small>{t.category}</small>
                </span>
                <strong>{t.amount}</strong>
              </button>
            ))}
            {selected && (
              <div className={styles.bankDetail} role="status">
                <h3>{selected.name}</h3>
                <p>{selected.amount} / Fictional completed transaction</p>
                <p>
                  Reference DEMO-{selected.id.toUpperCase()}. No real account is
                  connected.
                </p>
              </div>
            )}
            {s.screen === 'transactions' && !TRANSACTIONS.some((t) => t.name.toLowerCase().includes(s.query.toLowerCase())) && (
              <p role="status">No matching transactions. Change or clear your search.</p>
            )}
          </section>
        )}
        {s.screen === 'transfer' && (
          <form
            data-evidence-region="transfer"
            onSubmit={(e) => {
              e.preventDefault()
              action({ type: 'TRANSFER' })
            }}
          >
            <h2>Send a fictional payment</h2>
            <p>Demo task: Alex Demo / £12.40. No money moves.</p>
            <label>
              Demo recipient
              <input
                value={s.recipient}
                onChange={(e) =>
                  action({
                    type: 'FIELD',
                    field: 'recipient',
                    value: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Demo amount (£)
              <input
                inputMode="decimal"
                value={s.amount}
                onChange={(e) =>
                  action({
                    type: 'FIELD',
                    field: 'amount',
                    value: e.target.value,
                  })
                }
              />
            </label>
            {s.error && (
              <p role="alert" className={styles.error}>
                {s.error}
              </p>
            )}
            <button className={styles.bankSubmit}>Confirm demo transfer</button>
          </form>
        )}
        {s.screen === 'receipt' && (
          <section data-evidence-region="transfer">
            <h2 tabIndex="-1">Demo transfer confirmed.</h2>
            <p>£12.40 to Alex Demo</p>
            <p>This is local feedback. No payment was sent.</p>
            <button
              className={styles.bankSubmit}
              onClick={() => action({ type: 'OPEN', screen: 'dashboard' })}
            >
              Return to overview
            </button>
          </section>
        )}
      </div>
      <footer>Authored simulation / no financial service connection.</footer>
    </ExhibitShell>
  )
}
const PROJECTS = {
  tidal: {
    name: 'TIDAL',
    role: 'Interaction design + frontend',
    text: 'A fictional tidal reading instrument. Role: interaction design, prototyping and frontend implementation. Built as a self-directed concept.',
    color: '#afd0bb',
  },
  signal: {
    name: 'SIGNAL',
    role: 'Visual identity + motion',
    text: 'An authored identity study for a fictional radio station. Role: visual identity and motion direction. No client or commercial outcome is claimed.',
    color: '#e4b28b',
  },
  archive: {
    name: 'INDEX / 24',
    role: 'Editorial design',
    text: 'A fictional small-press archive. Role: information architecture and editorial design. A concept project, not a commissioned publication.',
    color: '#b6b5d4',
  },
}
export function Portfolio({ state: s, onAction: a, frozen }) {
  const root = useRef(null)
  useEffect(() => {
    if (!frozen && document.activeElement === document.body)
      root.current?.querySelector('h2')?.focus({ preventScroll: true })
  }, [s.screen, s.project, frozen])
  const p = PROJECTS[s.project]
  return (
    <ExhibitShell
      frozen={frozen}
      className={`${styles.portfolio} ${s.motion && !frozen ? styles.motion : ''}`}
      label="Authored expressive portfolio"
    >
      <div ref={root}>
        <header>
          <strong>MAE / STUDIO</strong>
          <button
            onClick={() => a?.({ type: 'MOTION' })}
            aria-pressed={!s.motion}
          >
            Motion {s.motion ? 'on' : 'off'}
          </button>
        </header>
        <nav
          aria-label="Portfolio navigation"
          data-evidence-region="portfolio-nav"
        >
          {['home', 'work', 'contact'].map((screen) => (
            <button
              key={screen}
              aria-pressed={s.screen === screen}
              onClick={() => a?.({ type: 'NAV', screen })}
            >
              {screen}
            </button>
          ))}
        </nav>
        {s.screen === 'home' ? (
          <section
            className={styles.portfolioHero}
            data-evidence-region="expression"
          >
            <p>Independent design / fictional portfolio</p>
            <h2 tabIndex="-1">
              Make room
              <br />
              <em>for the unexpected.</em>
            </h2>
            <div className={styles.kinetic} aria-hidden="true">
              <span>↗</span>
              <span>↗</span>
              <span>↗</span>
            </div>
            <button onClick={() => a?.({ type: 'PROJECT', id: 'tidal' })}>
              Open Tidal / interaction design →
            </button>
          </section>
        ) : s.screen === 'work' ? (
          <section className={styles.work} data-evidence-region="expression">
            <div className={styles.projectTabs} data-evidence-region="projects">
              {Object.entries(PROJECTS).map(([id, item]) => (
                <button
                  key={id}
                  aria-pressed={s.project === id}
                  onClick={() => a?.({ type: 'PROJECT', id })}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div
              className={styles.projectArtwork}
              style={{ background: p.color }}
              aria-hidden="true"
            >
              {p.name}
              <span>↗</span>
            </div>
            <h2 tabIndex="-1">{p.name}</h2>
            <div data-evidence-region="project-role">
              <strong>{p.role}</strong>
              <p>{p.text}</p>
            </div>
          </section>
        ) : (
          <section
            className={styles.contact}
            data-evidence-region="project-role"
          >
            <h2 tabIndex="-1">Start a conversation.</h2>
            <p>Fictional contact: mae@example.test</p>
            <p>
              This exhibit does not send a message. The address is intentionally
              non-deliverable.
            </p>
            <button onClick={() => a?.({ type: 'NAV', screen: 'work' })}>
              Back to selected work →
            </button>
          </section>
        )}
        <footer>
          Authored portfolio / motion is optional / native scrolling.
        </footer>
      </div>
    </ExhibitShell>
  )
}
export function Bulletin({ state: s, onAction: a, frozen }) {
  const listing = LISTINGS.find((item) => item.id === s.listing)
  const found = visibleListings(s)
  return (
    <ExhibitShell
      frozen={frozen}
      className={styles.bulletin}
      label="Fictional classifieds reconstruction"
      screen={s.screen}
    >
      <header>
        <strong>bulletin</strong>
        <span>the local noticeboard / demo town</span>
      </header>
      <nav data-evidence-region="categories" aria-label="Listing categories">
        {['All', 'Furniture', 'Home', 'Transport', 'Community'].map(
          (category) => (
            <button
              key={category}
              aria-pressed={s.category === category}
              onClick={() =>
                a?.({ type: 'FILTER', field: 'category', value: category })
              }
            >
              {category}
            </button>
          ),
        )}
      </nav>
      <div className={styles.bulletinBody}>
        {s.screen === 'browse' ? (
          <>
            <div
              className={styles.search}
              data-evidence-region="listing-search"
            >
              <label>
                Search listings
                <input
                  value={s.query}
                  placeholder="desk, lamp, workshop…"
                  onChange={(e) =>
                    a?.({
                      type: 'FILTER',
                      field: 'query',
                      value: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Maximum demo price (£)
                <input
                  type="number"
                  min="0"
                  value={s.budget}
                  onChange={(e) =>
                    a?.({
                      type: 'FILTER',
                      field: 'budget',
                      value: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <p>
              {found.length} fictional listings / {s.saved.length} saved
            </p>
            <section data-evidence-region="listing-results">
              {found.map((item) => (
                <button
                  className={styles.listing}
                  key={item.id}
                  onClick={() => a?.({ type: 'LISTING', id: item.id })}
                >
                  <strong>{item.title}</strong>
                  <span>£{item.price}</span>
                  <span>
                    {item.area} / {item.category}
                  </span>
                </button>
              ))}
              {!found.length && (
                <p>No matches. Clear the search or raise the price limit.</p>
              )}
            </section>
            <aside data-evidence-region="listing-trust">
              Listings are fictional. A “community desk” label describes this
              scenario's collection point; it is not identity verification.
            </aside>
          </>
        ) : (
          listing && (
            <article data-evidence-region="listing-results">
              <button onClick={() => a?.({ type: 'BACK' })}>
                ← Results, filters retained
              </button>
              <h2 tabIndex="-1">{listing.title}</h2>
              <p className={styles.listingPrice}>
                £{listing.price} / {listing.area}
              </p>
              <p>{listing.detail}</p>
              <div data-evidence-region="listing-trust">
                <h3>Before arranging collection</h3>
                <p>
                  {listing.verified
                    ? 'Demo community-desk collection point.'
                    : 'Private demo listing. The seller identity has not been verified.'}{' '}
                  No real seller or payment exists.
                </p>
              </div>
              <button
                className={styles.save}
                onClick={() => a?.({ type: 'SAVE' })}
              >
                {s.saved.includes(listing.id)
                  ? 'Saved to demo shortlist'
                  : 'Save to demo shortlist'}
              </button>
            </article>
          )
        )}
      </div>
      <footer>
        All listings and tasks are authored. Nothing is bought or sold.
      </footer>
    </ExhibitShell>
  )
}
function Garment({ product }) {
  return (
    <div
      className={styles.garment}
      style={{ '--cloth': product.color }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 240">
        <path
          d={
            product.id === 'bag'
              ? 'M55 75H185L200 210H40Z M80 80V50Q120 5 160 50V80'
              : product.id === 'shirt'
                ? 'M78 30L30 60L15 110L60 130L70 210H170L180 130L225 110L210 60L162 30L120 55Z'
                : 'M78 20L35 55L20 145L65 155L65 220H175L175 155L220 145L205 55L162 20L120 45Z'
          }
          fill="var(--cloth)"
          stroke="#111"
          strokeWidth="3"
        />
        <path d="M120 55V205" fill="none" stroke="#111" strokeWidth="2" />
      </svg>
    </div>
  )
}
export function Fashion({ state: s, onAction: a, frozen }) {
  const product = PRODUCTS.find((p) => p.id === s.product)
  return (
    <ExhibitShell
      frozen={frozen}
      className={styles.fashion}
      label="Fictional fashion store"
      screen={s.screen}
    >
      <header>
        <button onClick={() => a?.({ type: 'NAV', screen: 'collection' })}>
          FORM / FIELD
        </button>
        <button onClick={() => a?.({ type: 'NAV', screen: 'bag' })}>
          BAG [{s.bag.length}]
        </button>
      </header>
      <div
        className={styles.storeManifesto}
        data-evidence-region="brand-expression"
      >
        CLOTHES WITH
        <br />
        <em>NOTHING TO HIDE.</em>
      </div>
      {s.screen === 'collection' ? (
        <section
          className={styles.products}
          data-evidence-region="product-discovery"
        >
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => a?.({ type: 'PRODUCT', id: p.id })}
            >
              <Garment product={p} />
              <strong>{p.name}</strong>
              <span>£{p.price} / fictional</span>
            </button>
          ))}
        </section>
      ) : s.screen === 'product' ? (
        <article className={styles.productDetail}>
          <Garment product={product} />
          <section data-evidence-region="product-information">
            <button onClick={() => a?.({ type: 'NAV', screen: 'collection' })}>
              ← COLLECTION
            </button>
            <h2 tabIndex="-1">{product.name}</h2>
            <p>£{product.price} / demonstration price</p>
            <p>{product.detail}</p>
            <p>
              Fit: relaxed. Demo delivery: £5. Returns: within 14 days in this
              fictional scenario. No policy applies to a real shop.
            </p>
            <label>
              Choose demo size
              <select
                value={s.size}
                onChange={(e) => a?.({ type: 'SIZE', value: e.target.value })}
              >
                <option value="">Select size</option>
                {product.sizes.map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </label>
            {s.error && <p role="alert">{s.error}</p>}
            <button className={styles.add} onClick={() => a?.({ type: 'ADD' })}>
              ADD TO DEMO BAG
            </button>
          </section>
        </article>
      ) : (
        <section
          className={styles.bag}
          data-evidence-region="product-information"
        >
          <h2 tabIndex="-1">Your demo bag.</h2>
          {s.bag.length ? (
            s.bag.map((item, index) => (
              <div key={index}>
                <p>
                  {PRODUCTS.find((p) => p.id === item.product).name} /{' '}
                  {item.size}
                </p>
                <button onClick={() => a?.({ type: 'REMOVE', index })}>
                  Remove item {index + 1}
                </button>
              </div>
            ))
          ) : (
            <p>The bag is empty.</p>
          )}
          <p>No checkout, payment or purchase will occur.</p>
          <button onClick={() => a?.({ type: 'NAV', screen: 'collection' })}>
            CONTINUE EXPLORING
          </button>
        </section>
      )}
      <footer>
        Authored store / fictional products / no purchase or payment.
      </footer>
    </ExhibitShell>
  )
}
