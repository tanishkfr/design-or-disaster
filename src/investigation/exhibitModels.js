export const TRANSACTIONS = [
  { id: 'rent', name: 'Studio rent', amount: '−£620.00', category: 'Home' },
  {
    id: 'train',
    name: 'Northline Rail',
    amount: '−£24.80',
    category: 'Travel',
  },
  {
    id: 'refund',
    name: 'Northline refund',
    amount: '+£12.40',
    category: 'Travel',
  },
  { id: 'market', name: 'Corner market', amount: '−£31.20', category: 'Food' },
]
export const LISTINGS = [
  {
    id: 'desk',
    title: 'Solid wood desk',
    category: 'Furniture',
    price: 45,
    area: 'North',
    detail:
      '110 × 60 cm. Collection Saturday. Surface scratches shown in the description.',
    verified: false,
  },
  {
    id: 'chair',
    title: 'Adjustable study chair',
    category: 'Furniture',
    price: 30,
    area: 'East',
    detail:
      'Height adjustment works. Collection weekdays after 6 pm. Fictional private seller.',
    verified: false,
  },
  {
    id: 'lamp',
    title: 'Reading lamp',
    category: 'Home',
    price: 12,
    area: 'North',
    detail:
      'Working LED lamp, 40 cm tall. Collection from the demo community centre.',
    verified: true,
  },
  {
    id: 'bike',
    title: 'City bicycle',
    category: 'Transport',
    price: 90,
    area: 'West',
    detail: 'Medium frame. Needs a brake check. No claim of roadworthiness.',
    verified: false,
  },
  {
    id: 'shelf',
    title: 'Low bookcase',
    category: 'Furniture',
    price: 25,
    area: 'North',
    detail: '80 × 30 × 90 cm. Available Sunday. Collection only.',
    verified: false,
  },
  {
    id: 'lesson',
    title: 'Weekend repair workshop',
    category: 'Community',
    price: 0,
    area: 'East',
    detail:
      'Saturday 10 am in the fictional workshop. Bring a broken household object.',
    verified: true,
  },
]
export const PRODUCTS = [
  {
    id: 'coat',
    name: 'FIELD COAT',
    price: 140,
    color: '#d7d0bb',
    detail: 'Reclaimed cotton canvas. Unlined. Two internal pockets.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'shirt',
    name: 'OFFSET SHIRT',
    price: 65,
    color: '#adbbbc',
    detail: 'Cotton poplin. Asymmetric closure. Relaxed fit.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'bag',
    name: 'FOLD BAG',
    price: 48,
    color: '#b6a38c',
    detail: 'Recycled nylon. Adjustable strap. No internal padding.',
    sizes: ['ONE SIZE'],
  },
]
export function visibleListings(state) {
  const query = state.query.trim().toLowerCase()
  return LISTINGS.filter(
    (item) =>
      (state.category === 'All' || item.category === state.category) &&
      (!query ||
        `${item.title} ${item.detail}`.toLowerCase().includes(query)) &&
      (!state.budget || item.price <= Number(state.budget)),
  )
}
const model = (create, reduce, validate) => ({ create, reduce, validate })
export const banking = model(
  () => ({
    screen: 'dashboard',
    query: '',
    transaction: null,
    recipient: '',
    amount: '',
    error: '',
    events: [],
  }),
  (s, a) => {
    if (
      a.type === 'OPEN' &&
      ['dashboard', 'transactions', 'transfer', 'receipt'].includes(a.screen) &&
      a.screen !== 'receipt'
    )
      return { ...s, screen: a.screen, error: '' }
    if (a.type === 'SEARCH')
      return { ...s, query: String(a.value).slice(0, 60) }
    if (a.type === 'TRANSACTION' && TRANSACTIONS.some((t) => t.id === a.id))
      return {
        ...s,
        transaction: a.id,
        events: [...s.events, 'transaction-opened'],
      }
    if (a.type === 'FIELD' && ['recipient', 'amount'].includes(a.field))
      return { ...s, [a.field]: String(a.value).slice(0, 40), error: '' }
    if (a.type === 'TRANSFER')
      return s.recipient === 'Alex Demo' && Number(s.amount) === 12.4
        ? {
            ...s,
            screen: 'receipt',
            events: [...s.events, 'demo-transfer-confirmed'],
          }
        : {
            ...s,
            error: 'Use Alex Demo and £12.40 for this fictional transfer.',
          }
    return s
  },
  (s) =>
    s &&
    ['dashboard', 'transactions', 'transfer', 'receipt'].includes(s.screen) &&
    ['query', 'recipient', 'amount', 'error'].every(
      (k) => typeof s[k] === 'string',
    ) &&
    (s.transaction === null ||
      TRANSACTIONS.some((t) => t.id === s.transaction)) &&
    Array.isArray(s.events) &&
    s.events.every((value) =>
      ['transaction-opened', 'demo-transfer-confirmed'].includes(value),
    ),
)
export const portfolio = model(
  () => ({ screen: 'home', project: 'tidal', motion: true, events: [] }),
  (s, a) => {
    if (a.type === 'NAV' && ['home', 'work', 'contact'].includes(a.screen))
      return {
        ...s,
        screen: a.screen,
        events: [...s.events, `${a.screen}-opened`],
      }
    if (a.type === 'PROJECT' && ['tidal', 'signal', 'archive'].includes(a.id))
      return {
        ...s,
        project: a.id,
        screen: 'work',
        events: [...s.events, 'project-opened'],
      }
    if (a.type === 'MOTION')
      return {
        ...s,
        motion: !s.motion,
        events: [...s.events, 'motion-control-used'],
      }
    return s
  },
  (s) =>
    s &&
    ['home', 'work', 'contact'].includes(s.screen) &&
    ['tidal', 'signal', 'archive'].includes(s.project) &&
    typeof s.motion === 'boolean' &&
    Array.isArray(s.events) &&
    s.events.every((value) =>
      [
        'home-opened',
        'work-opened',
        'contact-opened',
        'project-opened',
        'motion-control-used',
      ].includes(value),
    ),
)
export const bulletin = model(
  () => ({
    screen: 'browse',
    query: '',
    category: 'All',
    budget: '',
    listing: null,
    saved: [],
    events: [],
  }),
  (s, a) => {
    if (
      a.type === 'FILTER' &&
      ['query', 'category', 'budget'].includes(a.field)
    )
      return {
        ...s,
        [a.field]: String(a.value).slice(0, 60),
        screen: 'browse',
      }
    if (a.type === 'LISTING' && LISTINGS.some((l) => l.id === a.id))
      return {
        ...s,
        listing: a.id,
        screen: 'detail',
        events: [...s.events, 'listing-opened'],
      }
    if (a.type === 'BACK') return { ...s, screen: 'browse' }
    if (a.type === 'SAVE' && s.listing)
      return {
        ...s,
        saved: [...new Set([...s.saved, s.listing])],
        events: [...s.events, 'listing-saved'],
      }
    return s
  },
  (s) =>
    s &&
    ['browse', 'detail'].includes(s.screen) &&
    ['query', 'category', 'budget'].every((k) => typeof s[k] === 'string') &&
    ['All', 'Furniture', 'Home', 'Transport', 'Community'].includes(
      s.category,
    ) &&
    (s.listing === null || LISTINGS.some((l) => l.id === s.listing)) &&
    (s.screen !== 'detail' || s.listing !== null) &&
    Array.isArray(s.saved) &&
    s.saved.every((id) => LISTINGS.some((l) => l.id === id)) &&
    Array.isArray(s.events) &&
    s.events.every((value) =>
      ['listing-opened', 'listing-saved'].includes(value),
    ),
)
export const fashion = model(
  () => ({
    screen: 'collection',
    product: 'coat',
    size: '',
    bag: [],
    error: '',
    events: [],
  }),
  (s, a) => {
    if (a.type === 'PRODUCT' && PRODUCTS.some((p) => p.id === a.id))
      return {
        ...s,
        product: a.id,
        size: '',
        screen: 'product',
        error: '',
        events: [...s.events, 'product-opened'],
      }
    if (a.type === 'NAV' && ['collection', 'bag'].includes(a.screen))
      return { ...s, screen: a.screen, error: '' }
    if (a.type === 'SIZE') return { ...s, size: String(a.value), error: '' }
    if (a.type === 'ADD') {
      const p = PRODUCTS.find((p) => p.id === s.product)
      return p.sizes.includes(s.size)
        ? {
            ...s,
            bag: [...s.bag, { product: s.product, size: s.size }],
            error: '',
            screen: 'bag',
            events: [...s.events, 'demo-item-added'],
          }
        : {
            ...s,
            error: 'Choose an available size before adding this demo item.',
          }
    }
    if (a.type === 'REMOVE')
      return { ...s, bag: s.bag.filter((_, i) => i !== a.index) }
    return s
  },
  (s) =>
    s &&
    ['collection', 'product', 'bag'].includes(s.screen) &&
    PRODUCTS.some((p) => p.id === s.product) &&
    typeof s.size === 'string' &&
    (s.size === '' ||
      PRODUCTS.find((p) => p.id === s.product)?.sizes.includes(s.size)) &&
    typeof s.error === 'string' &&
    Array.isArray(s.bag) &&
    s.bag.every((item) =>
      PRODUCTS.some(
        (p) => p.id === item.product && p.sizes.includes(item.size),
      ),
    ) &&
    Array.isArray(s.events) &&
    s.events.every((value) =>
      ['product-opened', 'demo-item-added'].includes(value),
    ),
)
