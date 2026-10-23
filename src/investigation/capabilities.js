import { banking, portfolio, bulletin, fashion } from './exhibitModels.js'
import { createExhibit, updateExhibit, validExhibit } from './benefitsModel.js'

export const CURATED_IDS = [
  'case-001',
  'case-006',
  'case-010',
  'case-012',
  'case-015',
]
const document = (id, kind, title, body, connection) => ({
  id,
  kind,
  title,
  body,
  connection,
  provenance: 'Authored scenario',
})
export const INVESTIGATIONS = {
  'case-006': {
    version: '2.1',
    exhibit: {
      id: 'benefits-form-v1',
      create: createExhibit,
      reduce: updateExhibit,
      validate: validExhibit,
    },
    title: 'The Benefits Form',
    context: [
      {
        id: 'person',
        kind: 'Intended user',
        provenance: 'Hypothetical scenario',
        title: 'A borrowed computer. A task to finish.',
        body: 'Alex Sample is using a shared library computer to prepare a fictional assistance application. There is time to work, but an interruption is possible. The task is to submit the supplied demo details, without leaving them visible when stepping away.',
        connection:
          'The session warning matters differently on a shared screen.',
      },
      {
        id: 'artifact',
        kind: 'Visible evidence',
        provenance: 'Authored reconstruction',
        title: 'What the image can—and cannot—tell you.',
        body: 'The supplied case image shows an eight-minute timeout warning, a linked error summary and long required fields. It cannot demonstrate whether a draft survives an interruption. This project has no verified source implementation or measured user outcomes for that behavior.',
        connection:
          'The warning and error summary are visible in the original exhibit. Runtime behavior is not.',
      },
      {
        id: 'behavior',
        kind: 'Observable behavior',
        provenance: 'Authored simulation',
        title: 'Try the boundary between privacy and recovery.',
        body: 'The next exhibit is a local, working reconstruction. You can trigger validation, interrupt the session, and restore a demo draft using TEST-1042. Interruption hides the fields; recovery retains the work. Those behaviors belong to this simulation, not to a verified government service.',
        connection:
          'Both the interruption and recovery are yours to test. Neither prescribes a verdict.',
      },
    ],
  },
}

Object.assign(INVESTIGATIONS, {
  'case-001': {
    version: '2.2',
    title: 'Mobile Banking Dashboard',
    firstLook: 'interactive',
    theme: 'Visual hierarchy / task hierarchy',
    instruction:
      'Look around the fictional account. What earns your attention?',
    task: 'Find the Northline refund, then try sending £12.40 to Alex Demo. No real payment occurs.',
    exhibit: { id: 'banking-v1', ...banking },
    context: [
      document(
        'bank-task',
        'Task brief',
        'A refund is not always a payment.',
        'Alex Demo needs to find a £12.40 Northline refund, then transfer that amount to a friend. A large balance may be reassuring, while the transaction history matters more to this particular task.',
        'Try search, transaction details and the transfer action. A calm layout may still support the work.',
      ),
      document(
        'bank-boundary',
        'Simulation boundary',
        'Familiarity can be useful evidence.',
        'This local dashboard uses fictional funds and transactions. Its routes, validation and confirmations are authored behavior, not a measurement of a real bank. There is no time limit, and no verdict is preferred.',
        'You can defend restraint, criticize discoverability, or hold both positions at once.',
      ),
    ],
  },
  'case-010': {
    version: '2.2',
    title: 'The Animated Portfolio',
    firstLook: 'interactive',
    theme: 'Expression / control',
    instruction: 'Explore the portfolio. You can pause its motion at any time.',
    task: 'Find Tidal, identify the designer’s role, then locate contact information. Notice what the expressive treatment contributes.',
    captureNote:
      'Mark uses a settled inspection pose. The captured layout is preserved; an animation phase is not.',
    exhibit: { id: 'portfolio-v1', ...portfolio },
    context: [
      document(
        'portfolio-task',
        'Commission brief',
        'A reviewer has a question, not a stopwatch.',
        'A fictional reviewer wants the Tidal project, the designer’s actual role and a contact route. The portfolio is also a demonstration of visual authorship. Efficient retrieval and expressive character may both matter.',
        'Inspect the work navigation, project description and motion control.',
      ),
      document(
        'portfolio-motion',
        'Interaction note',
        'Expression with an exit.',
        'The arrow sequence is authored, finite and optional. The Motion control stops it, and reduced-motion preferences remove it. Native scrolling and keyboard navigation remain available. The supplied still is also an authored reconstruction; it does not demonstrate runtime behavior.',
        'A restrained motion system can strengthen identity without earning every transition a free pass.',
      ),
    ],
  },
  'case-012': {
    version: '2.2',
    title: 'Bulletin',
    firstLook: 'interactive',
    theme: 'Density / discovery',
    instruction:
      'Browse a dense local noticeboard. All listings are fictional.',
    task: 'Find a desk under £50 in the North area. Check collection details and save it to the demo shortlist.',
    exhibit: { id: 'bulletin-v1', ...bulletin },
    context: [
      document(
        'bulletin-task',
        'Discovery task',
        'One useful listing, without a tour.',
        'Find a desk under £50 in the North area and inspect its collection details. The predictable list structure exposes prices and locations before opening a detail page. That density might help this task.',
        'Search and filter, then inspect whether the information is sufficient.',
      ),
      document(
        'bulletin-trust',
        'Evidence limit',
        'Finding is not verifying.',
        'Listings and sellers are fictional. The shortlist confirms a local action, not seller trustworthiness. A community collection label is not identity verification. Density may aid scanning while small text or limited assurance may still trouble you.',
        'Saving the right listing does not settle whether you would trust the service.',
      ),
    ],
  },
  'case-015': {
    version: '2.2',
    title: 'Brutalist Fashion Store',
    sealed: true,
    firstLook: 'interactive',
    theme: 'Expression / independent judgment',
    instruction:
      'Explore an authored clothing store. No purchase or payment is possible.',
    task: 'Inspect the Field Coat, choose a demo size and add it to the bag. Decide whether the information earns your confidence.',
    exhibit: { id: 'fashion-v1', ...fashion },
    context: [
      document(
        'fashion-brand',
        'Brand brief',
        'A small collection with a direct voice.',
        'In this fictional scenario, the store uses a blunt visual language for three limited-run garments. Its priority is material and shape rather than a broad catalogue. That intention is a constraint to consider, not an argument that the design succeeds.',
        'Look at how product information and expression sit together.',
      ),
      document(
        'fashion-task',
        'Your task',
        'Would you have enough to decide?',
        'Inspect the Field Coat’s material, available sizes, demo delivery and fictional return terms. Add a size to the local bag if you want. No checkout exists. There will be no panel interpretation after you submit.',
        'Your evidence and two judgments are the only interpretation this finale preserves.',
      ),
    ],
  },
})
INVESTIGATIONS['case-006'].staticRegions = {
  'form-errors': 'accessibility',
  'form-warning': 'usability',
  'form-fields': 'delight',
}
INVESTIGATIONS['case-006'].theme = 'Access / recovery'
INVESTIGATIONS['case-006'].instruction =
  'Start with the supplied image. One described observation is enough.'
INVESTIGATIONS['case-006'].task =
  'Use Alex Sample and TEST-1042. Trigger validation, interrupt the session and see what can be recovered.'
const EXHIBIT_CONTRACTS = {
  'case-001': {
    interactions: [
      'navigation',
      'transaction-search',
      'transaction-detail',
      'validated-demo-transfer',
    ],
    states: ['dashboard', 'transactions', 'transfer', 'receipt'],
  },
  'case-006': {
    interactions: [
      'field-entry',
      'validation',
      'interruption',
      'recovery',
      'draft-discard',
      'demo-submission',
    ],
    states: ['form', 'interrupted', 'receipt'],
  },
  'case-010': {
    interactions: [
      'native-scroll',
      'project-navigation',
      'role-inspection',
      'contact-navigation',
      'motion-control',
    ],
    states: ['home', 'work', 'contact'],
  },
  'case-012': {
    interactions: [
      'category-filter',
      'text-search',
      'price-filter',
      'listing-detail',
      'shortlist',
      'return-with-filters',
    ],
    states: ['browse', 'detail'],
  },
  'case-015': {
    interactions: [
      'product-discovery',
      'product-detail',
      'size-selection',
      'demo-bag',
      'bag-removal',
    ],
    states: ['collection', 'product', 'bag'],
  },
}
for (const [caseId, config] of Object.entries(INVESTIGATIONS)) {
  Object.assign(config.exhibit, EXHIBIT_CONTRACTS[caseId])
  config.exhibit.caseId = caseId
  config.exhibit.modes = ['explore', 'mark']
  config.exhibit.annotationCompatibility = 'captured-layout-v1'
  config.exhibit.recovery =
    'Controlled state survives mode changes and reload; a confirmed new attempt resets only this case.'
  config.exhibit.accessibility =
    'Native controls, keyboard marking, named regions and reduced motion.'
  config.exhibit.contextDependencies = config.context.map((item) => item.id)
}
export function investigationFor(caseData) {
  const config = INVESTIGATIONS[caseData?.id]
  return config && (caseData?.caseStatus !== 'sealed' || config.sealed)
    ? config
    : null
}
