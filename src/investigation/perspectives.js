import { INVESTIGATIONS } from './capabilities.js'

export const PERSPECTIVE_NAMES = {
  hierarchy: 'The Scanner',
  accessibility: 'The Advocate',
  usability: 'The Operator',
  trust: 'The Skeptic',
  delight: 'The Romantic',
}
const position = (lens, region, reading) => ({
  id: lens,
  lens,
  region,
  reading,
})
const contradiction = (id, element, perspectives, question, uncertainty) => ({
  id,
  element,
  perspectives,
  question,
  uncertainty,
})
const MATERIAL = {
  'case-001': {
    positions: [
      position(
        'hierarchy',
        'quick-actions',
        'Equal action weight asks the visitor to choose from labels rather than a dominant call to action. That can feel calm or leave a priority unstated.',
      ),
      position(
        'accessibility',
        'bank-nav',
        'Persistent text navigation gives a route without relying on icons. This is not a claim that the whole interface meets an accessibility standard.',
      ),
      position(
        'usability',
        'transactions',
        'The refund task depends on a readable activity trail. Finding a positive entry may matter more than the largest number on the dashboard.',
      ),
      position(
        'trust',
        'balance',
        'The prominent balance can offer reassurance, but prominence alone does not explain the status of a particular transaction.',
      ),
      position(
        'delight',
        'quick-actions',
        'Restraint can communicate financial steadiness. A quiet row of familiar actions need not be a failure of expression.',
      ),
    ],
    contradictions: [
      contradiction(
        'bank-weight',
        'The equally weighted action row',
        ['hierarchy', 'delight'],
        'Does equal weight create calm or leave task priority unresolved?',
        'The value of familiarity depends on the visitor and task; this simulation provides no population result.',
      ),
    ],
  },
  'case-006': {
    positions: [
      position(
        'hierarchy',
        'form-errors',
        'The summary makes failure highly visible and gives error links a common starting point. Its prominence may compete with the application itself.',
      ),
      position(
        'accessibility',
        'form-errors',
        'Text links can provide direct recovery routes. Their usefulness still depends on focus handling and understandable field instructions.',
      ),
      position(
        'usability',
        'form-warning',
        'A deliberate interruption exposes the recovery path. Protecting a shared screen and retaining work are different task requirements.',
      ),
      position(
        'trust',
        'form-warning',
        'Hiding a shared screen has a defensible purpose. The demo reference is illustrative recovery, not proof of real authentication or security.',
      ),
      position(
        'delight',
        'form-fields',
        'A plain form can show respect through clear recovery rather than visual novelty. The cumulative reading effort can still feel demanding.',
      ),
    ],
    contradictions: [
      contradiction(
        'form-summary',
        'The linked error summary',
        ['hierarchy', 'accessibility'],
        'Is prominent failure feedback an obstacle or a useful route back into the task?',
        'We have a working reconstruction, not evidence of how a real claimant would experience it.',
      ),
      contradiction(
        'form-interruption',
        'The interruption notice',
        ['usability', 'trust'],
        'How should retained work and a protected shared screen be balanced?',
        'The recovery token in this simulation is not a secure authentication design.',
      ),
    ],
  },
  'case-010': {
    positions: [
      position(
        'hierarchy',
        'expression',
        'The expressive opening establishes a strong first impression. Its scale can delay the project information a task-focused reviewer needs.',
      ),
      position(
        'accessibility',
        'portfolio-nav',
        'Persistent navigation and an explicit motion control offer alternatives to following the visual sequence. Keyboard and reduced-motion behavior remain part of the work.',
      ),
      position(
        'usability',
        'portfolio-nav',
        'Home, work and contact are conventional routes. Clear labels can make a visually unusual portfolio predictable to operate.',
      ),
      position(
        'trust',
        'project-role',
        'A stated role constrains what the portfolio claims. A polished project image alone cannot establish authorship or commercial outcomes.',
      ),
      position(
        'delight',
        'expression',
        'The kinetic typography is a sample of the designer’s expressive ability. For a portfolio, that demonstration can itself be relevant evidence.',
      ),
    ],
    contradictions: [
      contradiction(
        'portfolio-expression',
        'The expressive project surface',
        ['hierarchy', 'delight'],
        'Is this composition evidence of capability or an interruption to the review task?',
        'The answer depends on what the reviewer came to assess; no viewing-time threshold is asserted.',
      ),
    ],
  },
  'case-012': {
    positions: [
      position(
        'hierarchy',
        'listing-results',
        'Many equally weighted links require active scanning. Grouping and repeated placement may still give the list a usable rhythm.',
      ),
      position(
        'accessibility',
        'listing-search',
        'Visible labels and native controls offer a familiar filter route. Dense text still deserves individual inspection at the visitor’s preferred scale.',
      ),
      position(
        'usability',
        'listing-results',
        'Prices and locations are visible before a detail page. That density can remove unnecessary navigation from a specific discovery task.',
      ),
      position(
        'trust',
        'listing-trust',
        'A findable listing is not a verified seller. The explicit uncertainty matters before interpreting successful search as purchase confidence.',
      ),
      position(
        'delight',
        'categories',
        'A familiar noticeboard grammar can have character and directness. Visual modernization is not a prerequisite for every useful task.',
      ),
    ],
    contradictions: [
      contradiction(
        'bulletin-density',
        'The dense results list',
        ['hierarchy', 'usability'],
        'Does equal-weight density increase effort or reduce navigation?',
        'A successful local task does not establish universal readability or preference.',
      ),
    ],
  },
}
export function perspectivesFor(caseId) {
  return INVESTIGATIONS[caseId]?.sealed
    ? { positions: [], contradictions: [] }
    : (MATERIAL[caseId] ?? { positions: [], contradictions: [] })
}
export function spatialPositions(caseId, snapshot) {
  return perspectivesFor(caseId).positions.map((position) => ({
    ...position,
    target:
      snapshot?.targets?.find(
        (target) =>
          target.id === position.region &&
          target.width > 0 &&
          target.height > 0,
      ) ?? null,
  }))
}

export function perspectiveFrames(record, caseData) {
  const config = INVESTIGATIONS[caseData.id]
  const first = Object.values(record.firstLook.snapshots ?? {}).map(
    (frame) => ({
      ...frame,
      look: 'First look',
      marks: record.firstLook.marks.filter((mark) => mark.frameId === frame.id),
    }),
  )
  if (config.firstLook !== 'interactive')
    first.push({
      id: 'supplied-image',
      image: caseData.screenshot,
      label: 'supplied image / original annotation geometry',
      look: 'First look',
      marks: record.firstLook.marks,
      targets: Object.entries(config.staticRegions ?? {}).flatMap(
        ([id, lens]) => {
          const region = caseData.annotations.find(
            (item) => item.juror === lens,
          )
          return region
            ? [
                {
                  id,
                  left: region.x,
                  top: region.y,
                  width: region.width,
                  height: region.height,
                },
              ]
            : []
        },
      ),
    })
  return [
    ...first,
    ...Object.values(record.secondLook.snapshots).map((frame) => ({
      ...frame,
      look: 'Second look',
      marks: record.secondLook.marks.filter(
        (mark) => mark.frameId === frame.id,
      ),
    })),
  ]
}
