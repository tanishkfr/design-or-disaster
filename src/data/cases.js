// cases.js — Design or Disaster
//
// Ten cases in four movements:
//   Movement I   — Opening readings (3): authored voices introduce the lenses
//   Movement II  — The Divide (3): contested cases; the safety net is removed
//   Movement III — The Landmarks (3): legacy visual-history debates; outcomes are not measured here
//   Finale       — The Sealed Case (1): no panel verdict is entered; yours is the ruling of record
//
// These are authored projections, not live telemetry — declared in the methodology note.
//
// Case names are fictional; three former supplied captures now use original fictional reconstructions.
// Images and authored readings do not establish product history or user outcomes.
// Annotations coordinates (x, y, width, height as % of image dimensions).
//
// Voice rules (locked after Phase 7 validation pass):
//   Scanner   — visible structure, forensic, never moralises
//   Advocate  — names populations, names the asymmetric cost
//   Operator  — starts from the task, counts steps, measures friction
//   Skeptic   — investigates incentives and contradictions, one level deeper
//   Romantic  — meaning, expression, honesty; design critic not enthusiast

export const CASES = [

  // ─── CASE #001 ───────────────────────────────────────────────────────────────
  // Cold open case. Played first on every new session, also accessible from archive.
  {
    id: 'case-001',
    number: 'CASE #001',
    title: 'Mobile Banking Dashboard',
    context: 'Authored finance scenario / mobile',
    category: 'Visual Hierarchy',
    movement: 1,

    screenshot: '/screenshots/case-001.jpg',
    screenshotAspect: '375/812',
    screenshotDescription: 'A mobile current-account dashboard with a balance card, four equal-weight quick actions, a recent-transactions list, and bottom navigation.',
    evidenceTargets: [
      { x: 50, y: 19, label: 'Current-account balance card' },
      { x: 50, y: 40, label: 'Quick actions row' },
      { x: 50, y: 65, label: 'Recent transactions list' },
      { x: 50, y: 94, label: 'Bottom navigation' },
    ],

    officialVerdict: 'needs_revision',
    caseStatus: 'contested',
    contestedSummary: null,

    curatorNote: 'Selected as the cold open case because it divides precisely: two jurors see professional restraint, two see a failed hierarchy, one sees both simultaneously. The split is authored and does not diagnose the visitor.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'The action row presents four items at equal visual weight — the layout is organized as a spatial grid for users who have memorized it, but provides no affordance on first contact; the primary task carries no visual distinction from maintenance tasks a user opens quarterly.',
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          "The secondary transaction labels look faint relative to the primary text. This is an authored readability concern, not a measured contrast ratio or a conformance finding.",
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          "If sending money is the task, its position in the equal-weight action row offers little distinction from the actions beside it. A refund search would give the same hierarchy a different test.",
      },
      {
        juror: 'trust',
        ruling: 'not_guilty',
        reasoning:
          'The restrained palette, professional card treatment, and measured balance scale communicate financial competence without performing it — this is the correct register for a product that holds something real; familiarity and restraint are doing substantive work here.',
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          "The interface does not ask for attention it has not earned — no gratuitous animation, no manufactured urgency, no dark-pattern acceleration; restraint in financial interfaces is not an absence of design decisions, it is the appropriate one.",
      },
    ],

    annotations: [
      {
        x: 4, y: 13, width: 92, height: 23,
        label: 'Professional restraint — the card communicates financial quality through material weight and measured scale; the balance reads as confirmation, not announcement; the correct register for a product that holds something real',
        juror: 'trust',
        type: 'not_guilty',
      },
      {
        x: 4, y: 38, width: 92, height: 12,
        label: "Four actions share visual weight. Stable positions may help a returning visitor; no learning-time or repeat-use result is established by this image.",
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 4, y: 39, width: 22, height: 11,
        label: "Send Money has similar visual weight to Manage Cards. Whether it deserves priority depends on the task; no population task-frequency data is supplied.",
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 18, y: 58, width: 42, height: 7,
        label: "Secondary category and date labels: inspect their legibility against the primary transaction text. No contrast ratio has been measured for this capture.",
        juror: 'accessibility',
        type: 'mixed',
      },
      {
        x: 4, y: 5, width: 92, height: 90,
        label: 'The interface declines urgency theatre: no animated balance, promotional interruption, or celebratory transfer state competes with the account itself.',
        juror: 'delight',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #004 ───────────────────────────────────────────────────────────────
  // A benchmark in editorial hierarchy for news applications.
  // The type scale is doing navigational work.
  {
    id: 'case-004',
    number: 'CASE #002',
    title: 'The Broadsheet App',
    context: 'Authored news-app reading / mobile',
    category: 'Visual Hierarchy',
    movement: 1,

    screenshot: '/screenshots/case-004.jpg',
    screenshotAspect: '375/812',
    screenshotDescription: 'A mobile news home page with a publication masthead, category navigation, one dominant lead story, and a dense list of secondary stories.',
    evidenceTargets: [
      { x: 50, y: 6, label: 'Publication header and navigation' },
      { x: 48, y: 24, label: 'Lead story' },
      { x: 50, y: 47, label: 'Secondary stories' },
      { x: 50, y: 76, label: 'Lower story list' },
    ],

    officialVerdict: 'strong_design',
    caseStatus: 'contested',
    contestedSummary: null,

    curatorNote: 'Included as a counterweight to the archive\'s failures. The type scale does the work that most interfaces delegate to icons, colours, and progressive disclosure. What makes it useful as a case is not just that it succeeds, but that its success is legible — the decisions are visible and the reasoning is traceable without needing to know anything about the product\'s history.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          'The headline-summary-metadata hierarchy assigns a clear scan path — the eye moves from largest type to smallest without a competing element at any level, and story importance is communicated through size and position before the content is read.',
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          'The visual density rewards users who have already developed a scanning pattern for news interfaces; a first-time user encounters no structural orientation cues and no indication of how many stories exist between the header and the fold.',
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          "Visible story headings suggest direct routes to articles. The hierarchy may reduce searching, but the image cannot establish the behavior or tap count of those routes.",
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          'The prominence assigned to a story communicates editorial judgment about importance; the interface presents this as neutral information architecture when it is a continuous sequence of decisions about what deserves to be read first.',
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'Most news interfaces suggest a reading order; this one insists on one, and the willingness to insist — to make an argument about importance through type scale alone — is the quality that distinguishes it.',
      },
    ],

    annotations: [
      {
        x: 2, y: 16, width: 96, height: 30,
        label: 'The lead story runs at display weight with no image; the secondary stories step down to a measurably smaller scale; the step is visible without measurement; no colour coding, no icon, no visual affordance beyond size reduction communicates the priority relationship — the type scale is doing all navigational work',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 0, y: 14, width: 100, height: 23,
        label: 'The section label and the headline scale communicate that this story is the most important thing happening today; this is an editorial judgment — editors decided it — but the visual presentation has no mechanism to distinguish editorial choice from editorial fact; the interface presents curation as neutral architecture',
        juror: 'trust',
        type: 'mixed',
      },
      {
        x: 0, y: 9, width: 100, height: 5,
        label: 'Seven section tabs — For You, Top Stories, Politics, Business, Arts, Science, Opinion — with no indication of how many stories exist in each and no structural orientation for a user opening this application for the first time; the density rewards users who have already developed a scanning pattern and does not acknowledge those who have not',
        juror: 'accessibility',
        type: 'mixed',
      },
      {
        x: 0, y: 38, width: 100, height: 58,
        label: "Story headings expose possible article routes directly. Their destinations and interaction cost cannot be verified from this captured surface.",
        juror: 'usability',
        type: 'not_guilty',
      },
      {
        x: 0, y: 14, width: 100, height: 82,
        label: 'Most news interfaces suggest a reading order through image size and placement; this one communicates it through typography alone and is willing to insist — the lead story runs without an image because it needs none; the decision to back editorial confidence over visual convention is the quality that distinguishes this interface from its peers',
        juror: 'delight',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #006 ───────────────────────────────────────────────────────────────
  // A welfare application form where the people most likely to use it are
  // the most poorly served by its design.
  {
    id: 'case-006',
    number: 'CASE #003',
    title: 'The Benefits Form',
    context: 'Authored assistance scenario / desktop',
    category: 'Accessibility',
    movement: 1,

    screenshot: '/screenshots/case-006.jpg',
    screenshotAspect: '680/510',
    screenshotDescription: 'A desktop emergency-assistance form with a session-timeout warning, an error summary, long text fields, and no visible progress indicator.',
    evidenceTargets: [
      { x: 50, y: 13, label: 'Session-timeout warning' },
      { x: 48, y: 31, label: 'Error summary' },
      { x: 48, y: 60, label: 'Name field' },
      { x: 48, y: 78, label: 'Insurance-number field' },
    ],

    officialVerdict: 'design_disaster',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: "Authored scenario: a shared-computer privacy requirement and an application task may conflict. The screenshot does not establish who set a timeout or how a real organisation coordinated its teams. The working Second Look reconstruction lets you test an illustrative interruption and recovery.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          "The visible fields form a continuous vertical sequence. The image does not establish the full field count, completion time, or grouping below the captured area.",
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          "A person seeking assistance may be working under pressure or reading in another language. The visible error summary offers correction links; the image cannot establish inline validation or whether saving and returning is possible.",
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          "A timeout warning raises a recovery question: what happens if the applicant pauses? A static image cannot establish the timeout duration, task time, or whether work is lost.",
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          "Complexity may discourage an applicant. This authored concern is not evidence of reduced claims, institutional intent, or an observed policy outcome.",
      },
      {
        juror: 'delight',
        ruling: 'guilty',
        reasoning:
          'There is nothing in this form that acknowledges the person filling it in — no indication that the institution understands what it is asking or from whom; the design communicates bureaucratic indifference as a visual fact.',
      },
    ],

    annotations: [
      {
        x: 0, y: 13, width: 100, height: 6,
        label: "The session warning introduces a possible conflict between shared-computer privacy and retaining work. No completion-time study or organisational history is supplied for this scenario.",
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 6, y: 24, width: 88, height: 7,
        label: "No progress indicator is visible in this capture. The full task length and remaining work cannot be established from the image.",
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 6, y: 34, width: 88, height: 21,
        label: "The linked error summary makes correction routes visible. This capture does not establish when validation occurs or whether the interface meets an accessibility standard.",
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 6, y: 57, width: 88, height: 29,
        label: "Error messages ask the applicant to revisit fields. The image cannot establish the time cost, coordination between teams, or an administrative outcome.",
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 6, y: 88, width: 88, height: 5,
        label: "The image shows only part of a form. Consider what it communicates about scope; no unseen field count or claimant population is established.",
        juror: 'delight',
        type: 'guilty',
      },
    ],
  },


  // ─── CASE #005 ───────────────────────────────────────────────────────────────
  // Contested. A full-featured travel booking site using a hamburger menu as its
  // primary navigation on desktop. The jury is 3/2 on whether the convention
  // justifies the hidden structure.
  {
    id: 'case-005',
    number: 'CASE #004',
    title: 'The Hamburger Navigation',
    context: 'Authored travel-booking reading / desktop',
    category: 'Navigation',
    movement: 2,

    screenshot: '/screenshots/case-005.jpg',
    screenshotAspect: '680/510',
    screenshotDescription: 'A desktop travel-booking page with a brand header, a hamburger-menu trigger, a prominent search form, and destination cards.',
    evidenceTargets: [
      { x: 50, y: 10, label: 'Brand header' },
      { x: 94, y: 10, label: 'Menu trigger' },
      { x: 50, y: 42, label: 'Travel search form' },
      { x: 50, y: 78, label: 'Destination cards' },
    ],

    officialVerdict: 'needs_revision',
    caseStatus: 'contested',

    contestedSummary:
      "In this authored debate, one position values visible navigation and another values reduced visual complexity. Whether a collapsed menu helps depends on the task and the available routes. No study results or conversion measurements are supplied for this case.",

    curatorNote: "The split records disagreement among authored voices. It is not a summary of research literature or evidence of decisions made by real product teams.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          "Navigation is not a feature of an interface — it is the product's structure made legible; a navigation hidden behind a trigger is a skeleton concealed from the body it organises, and the user must act before they can orient.",
      },
      {
        juror: 'accessibility',
        ruling: 'not_guilty',
        reasoning:
          "A single navigation trigger reduces the persistent controls shown. It may simplify the surface, while adding a reveal action. Keyboard behavior and effects on attention would require testing.",
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'A travel booking product sells across at least four distinct categories — flights, hotels, cars, packages; hiding those categories behind a trigger requires the user to open navigation to recall what the product even offers before the task can begin.',
      },
      {
        juror: 'trust',
        ruling: 'not_guilty',
        reasoning:
          "A familiar menu trigger can be a reasonable compact route. Familiarity still varies, and the image supplies no evidence that every visitor recognizes it or knows what it contains.",
      },
      {
        juror: 'delight',
        ruling: 'guilty',
        reasoning:
          'A travel product that conceals its destinations is selling the feeling of being lost rather than the pleasure of going somewhere — that is the wrong emotional register for a product asking for trust with a two-hundred-dollar purchase.',
      },
    ],

    annotations: [
      {
        x: 88, y: 6, width: 12, height: 8,
        label: 'The trigger contains every product category this platform sells — flights, hotels, rental cars, holiday packages; a user on first arrival cannot name any of them from the visible surface; the site asks for trust before it has communicated what it is offering',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 13, y: 6, width: 75, height: 8,
        label: 'Several hundred pixels of horizontal navigation space between logo and trigger at desktop viewport width; a category tab row — Flights, Hotels, Cars, Packages — would occupy this space at no visual or layout cost; the hamburger is a mechanism for solving space constraints on narrow screens; this is not a narrow screen; the constraint being solved does not exist here',
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 8, y: 37, width: 84, height: 9,
        label: 'The primary task — entering destination and travel dates — completes from this surface without opening the navigation; for users arriving with formed intent, the stripped interface removes competing interactive elements and simplifies orientation; the Advocate holds that this surface is complete for the task it optimises for, and that optimising for a primary task is not a failure',
        juror: 'accessibility',
        type: 'not_guilty',
      },
      {
        x: 0, y: 5, width: 100, height: 9,
        label: "A familiar-looking menu icon may be recognizable to some visitors. This image does not establish familiarity across a population or remove discoverability concerns.",
        juror: 'trust',
        type: 'not_guilty',
      },
      {
        x: 0, y: 14, width: 100, height: 43,
        label: 'Travel is anticipation — the consideration of where you might go, what that journey could feel like; this surface communicates the mechanics of search before any emotional argument for booking; no destination category is named, no range of possibility is suggested, no specific emotional argument for booking here is made; a travel product that opens with opacity is selling the wrong thing',
        juror: 'delight',
        type: 'guilty',
      },
    ],
  },


  // ─── CASE #010 ───────────────────────────────────────────────────────────────
  // Contested. A personal designer portfolio built with scroll-jacking, custom
  // cursor, and entrance animations on every section. The jury is 3/2 on whether
  // technical sophistication constitutes professional judgment.
  {
    id: 'case-010',
    number: 'CASE #005',
    title: 'The Animated Portfolio',
    context: 'Authored portfolio scenario / desktop',
    category: 'Delight vs Usability Tradeoffs',
    movement: 2,

    screenshot: '/screenshots/case-010.jpg',
    screenshotAspect: '680/510',
    screenshotDescription: 'A dark animated portfolio with sparse top navigation, an oversized designer name, a scroll cue, and motion-led project tiles.',
    evidenceTargets: [
      { x: 50, y: 10, label: 'Top navigation' },
      { x: 38, y: 29, label: 'Designer name and role' },
      { x: 17, y: 48, label: 'Scroll cue' },
      { x: 50, y: 78, label: 'Project tiles' },
    ],

    officialVerdict: 'needs_revision',
    caseStatus: 'contested',

    contestedSummary:
      "These authored positions disagree about expression and retrieval. The Operator and Romantic treat visual character as evidence of capability; the Scanner and Advocate ask what a visitor can read and control. A still image cannot establish animation timing or scroll behavior. The working Second Look exhibit offers a separate, finite and optional motion sequence.",

    curatorNote: "Three authored positions favor revision; the Operator and Romantic defend expressive demonstration. This constructed split is not an expert vote or evidence of actual motion behavior. A compelling image and an operable portfolio are related questions, not interchangeable proof.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          "The oversized headline commands the opening. If motion delays its reading, expression could compete with hierarchy; this still image cannot establish whether or how long that happens.",
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          "The scroll cue makes control worth investigating. This image cannot demonstrate scroll hijacking, keyboard access or reduced-motion behavior; those require a working interface.",
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          "A portfolio also demonstrates visual judgment. The composition can be relevant evidence of that capability, while timing and task friction remain questions for a working version.",
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          "A polished image alone cannot establish whether the designer knows when to stop moving. I would look for pacing controls and explicit project responsibilities before treating expression as proof of judgment.",
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'A designer who removes their own voice from their portfolio in deference to usability convention has already answered the question every creative director asks about them; the position is not a mistake, even when the execution is imperfect.',
      },
    ],

    annotations: [
      {
        x: 5, y: 20, width: 68, height: 13,
        label: "The headline dominates the composition. A captured pose cannot tell us whether its arrival delays reading.",
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 5, y: 45, width: 28, height: 7,
        label: "A scroll cue invites exploration but does not prove scroll hijacking. Keyboard and motion behavior need a working implementation to evaluate.",
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 5, y: 57, width: 90, height: 40,
        label: "The project field makes expression part of the work on display. The image records its composition, not simultaneous animation or technical execution.",
        juror: 'usability',
        type: 'not_guilty',
      },
      {
        x: 0, y: 0, width: 100, height: 58,
        label: "The expressive surface prompts a question about restraint. Continuous motion cannot be established from this image.",
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 5, y: 58, width: 90, height: 38,
        label: 'The project field turns browsing into encounter; movement makes the portfolio feel authored rather than assembled from a template.',
        juror: 'delight',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #011 ───────────────────────────────────────────────────────────────
  // A dating platform's decision to expand gender and orientation identity fields
  // beyond binary options — an accessibility case about who the product models
  // as its user, and what happens when that model is wrong.
  {
    id: 'case-011',
    number: 'CASE #006',
    title: 'The Identity Form',
    context: 'Original fictional identity form / reconstruction',
    imageNotice: 'This original fictional reconstruction replaces a supplied capture. Earlier saved observations and coordinates are retained unchanged and may describe the former image. No historical screenshot or personal response is reproduced.',
    category: 'Accessibility',
    movement: 2,

    screenshot: '/screenshots/case-011.jpg',
    screenshotAspect: '570/364',
    screenshotDescription: 'A desktop identity form with a primary dropdown, a secondary selector, and a large wrapping set of identity-option buttons.',
    evidenceTargets: [
      { x: 43, y: 8, label: 'Primary identity dropdown' },
      { x: 43, y: 22, label: 'Secondary selector' },
      { x: 50, y: 58, label: 'Identity-option buttons' },
    ],

    officialVerdict: 'strong_design',
    caseStatus: 'contested',
    contestedSummary:
      'Three jurors rule for the design without reservation. Two hold genuine positions — one that the tradeoff is real even if the outcome is correct, one that principled design and strategic timing are not always separable and that the distinction matters. The majority verdict is Strong Design. The minority is not wrong to ask the question.',

    curatorNote: "This visual reading asks how a form represents identity. The capture shows selectors and a set of options, not a complete data model. It does not establish separate pronoun fields, matching accuracy or downstream processing.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          "The selectors and option list make a more specific vocabulary visible than a single binary choice. The capture does not establish a prior form, separate pronoun fields or the matching system behind it.",
      },
      {
        juror: 'accessibility',
        ruling: 'not_guilty',
        reasoning:
          "A binary-only choice can leave someone without an accurate way to describe themselves. This expanded vocabulary offers more possibilities; whether these options meet individual needs still requires listening to the people using them.",
      },
      {
        juror: 'usability',
        ruling: 'mixed',
        reasoning:
          "More options introduce reading and selection work while potentially allowing a more accurate self-description. Any effect on matching remains untested; extra fields do not prove a better result.",
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          "Specific identity language communicates a product position. Whether it reflects principle, differentiation or both is an interpretive question; the image cannot establish the team motives or release history.",
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'A form that asks who you are rather than which box you fit in is making a commitment about what the product believes identity to be. Most dating platforms are not making that commitment — they are making a simpler one, and the simplicity serves them. The significance of this form is not that it is correct but that it takes a position, which most forms at this scale decline to do.',
      },
    ],

    annotations: [
      {
        x: 3, y: 3, width: 58, height: 32,
        label: "The visible selector and option list suggest a broader vocabulary. Their selection rules and downstream data processing require a working implementation to verify.",
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 3, y: 35, width: 93, height: 62,
        label: "The visible option set expands the vocabulary available for self-description. No complete field schema or matching algorithm is established by this image.",
        juror: 'accessibility',
        type: 'not_guilty',
      },
      {
        x: 18, y: 0, width: 58, height: 100,
        label: "Additional choices require intake effort. Whether they prevent later mismatches is a question for research, not a finding from this capture.",
        juror: 'usability',
        type: 'mixed',
      },
      {
        x: 18, y: 0, width: 58, height: 24,
        label: 'The form takes an explicit position on identity; whether that commitment is principle, strategy, or both remains visible.',
        juror: 'trust',
        type: 'mixed',
      },
      {
        x: 18, y: 22, width: 78, height: 74,
        label: 'Specific language replaces the familiar experience of being forced into an inaccurate category with one of recognition.',
        juror: 'delight',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #002 ───────────────────────────────────────────────────────────────
  // Fictional ranked-contact scenario. No historical rollout or public outcome
  // is established. The former supplied capture is not part of this artifact.
  {
    id: 'case-002',
    number: 'CASE #007',
    title: 'Flare — Ranked Friends',
    context: 'Original fictional social feed / reconstruction',
    imageNotice: 'This original fictional reconstruction uses invented contacts and replaces a supplied capture. Earlier saved observations and coordinates are retained unchanged and may describe the former image. No real contact names, avatars or historical product claims are reproduced.',
    category: 'Wildcard / Controversial',
    movement: 3,

    screenshot: '/screenshots/case-002.jpg',
    screenshotAspect: '249/576',
    screenshotDescription: 'An original fictional social feed with a purple Friends header, eight invented numbered contacts with activity metadata, and a floating compose control.',
    evidenceTargets: [
      { x: 50, y: 7, label: 'Friends header' },
      { x: 48, y: 38, label: 'Upper contact list' },
      { x: 48, y: 70, label: 'Lower contact list' },
      { x: 51, y: 92, label: 'Floating action control' },
    ],

    officialVerdict: 'design_disaster',
    caseStatus: 'landmark',
    contestedSummary: null,

    curatorNote: "This legacy exhibit is an authored debate about separating personal and publisher content. Its fictional product name is not a historical source. No petition total, business metric, or causal outcome is established by this case.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          "The ranked contact list raises a question about social proximity versus activity. The capture does not show a previous navigation model or establish a merged publisher feed.",
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          "Ranking could make quieter contacts less visible. This image cannot establish how the ranking works, whose content is deprioritized, or effects on smaller networks.",
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          "A changed navigation model may require relearning. No prior-use study, migration history or measured relearning cost is supplied with this image.",
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          "The Friends heading promises a personal space. Whether that promise matches the ranking is worth investigating; this archive establishes no company statement or algorithm.",
      },
      {
        juror: 'delight',
        ruling: 'mixed',
        reasoning:
          "The personal contact list can be read as an attempt to foreground intimate sharing. That is an interpretation of the surface, not a verified product intention or public response.",
      },
    ],

    annotations: [
      {
        x: 5, y: 12, width: 90, height: 32,
        label: "Contact names and activity metadata share a ranked list. The image cannot establish the algorithm or a merger with publisher content.",
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 5, y: 62, width: 90, height: 20,
        label: "Different contact activities share the same list. Prior swipe behavior and the cost of changing it are not established here.",
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 4, y: 10, width: 92, height: 78,
        label: "Ranking invites a question about whose activity becomes visible. Effects on smaller networks require evidence beyond this capture.",
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 0, y: 0, width: 100, height: 20,
        label: "The Friends heading frames expectations of a personal space. No company rationale or ranking implementation is supplied.",
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 4, y: 12, width: 92, height: 74,
        label: "The contact-focused surface may suggest intimacy. The archive offers an interpretation, not evidence of product intent.",
        juror: 'delight',
        type: 'mixed',
      },
    ],
  },


  // ─── CASE #009 ───────────────────────────────────────────────────────────────
  // Landmark. A mobile OS design overhaul that removed skeuomorphism entirely.
  // The industry's most significant visual shift in mobile design history.
  // The problems were real. The direction was right.
  {
    id: 'case-009',
    number: 'CASE #008',
    title: 'Nova OS 7',
    context: 'Legacy operating-system reading / supplied capture',
    category: 'Visual Hierarchy',
    movement: 3,

    screenshot: '/screenshots/case-009.jpg',
    screenshotAspect: '375/812',
    screenshotDescription: 'A mobile operating-system home screen with a six-row icon grid, a translucent four-app dock, and page-position dots.',
    evidenceTargets: [
      { x: 50, y: 25, label: 'Upper application icons' },
      { x: 50, y: 56, label: 'Lower application icons' },
      { x: 50, y: 88, label: 'Application dock' },
      { x: 50, y: 96, label: 'Page-position dots' },
    ],

    officialVerdict: 'needs_revision',
    caseStatus: 'landmark',
    contestedSummary: null,

    curatorNote: "Included as an authored comparison of changing visual conventions. A captured image can support a visual reading, but it cannot establish industry adoption, a historical ranking, or a design direction being proved correct.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          "The flat icon treatment reduces simulated depth. Whether its shapes and labels remain recognizable actions is a question to investigate, not proof that all controls became indistinguishable.",
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          "Ultralight text can be difficult to read in some conditions. This authored reading does not establish measured contrast failures or a manufacturer correction timeline.",
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          "Text-only controls may ask visitors to distinguish a label from an action. The scale of that interpretive cost across a population has not been measured here.",
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          "A restrained visual language can still ask a lot of its labels. This image does not establish manufacturer testing, an accessibility correction or a release timeline.",
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          "The flat visual language departs from simulated physical controls. Its expressive ambition and readability can be considered independently; subsequent adoption would not itself prove a correct design decision.",
      },
    ],

    annotations: [
      {
        x: 0, y: 0, width: 100, height: 3,
        label: 'Status bar — rendered at the same ultralight weight as every icon label below it; the typography makes no distinction between system status and tap-target identifiers',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 4, y: 3, width: 92, height: 82,
        label: 'Flat icon grid — twenty tap targets with no shadow, bevel, or gloss; nothing visually distinguishes interactive elements from the static wallpaper behind them',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 4, y: 17, width: 92, height: 54,
        label: "The icons share color, outline and shape conventions. No industry adoption timeline is established by this capture.",
        juror: 'delight',
        type: 'not_guilty',
      },
      {
        x: 4, y: 78, width: 92, height: 7,
        label: "Ultralight labels raise a readability concern. Exact text size, contrast compliance, and manufacturer response have not been verified here.",
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 2, y: 4, width: 96, height: 86,
        label: 'When labels and actions share the same flat treatment, every tap begins with interpretation instead of recognition.',
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 2, y: 4, width: 96, height: 90,
        label: "The image raises questions about recognition and readability; it cannot establish a system-wide correction or the conditions of release.",
        juror: 'trust',
        type: 'mixed',
      },
    ],
  },


  // ─── CASE #012 ───────────────────────────────────────────────────────────────
  // The counterintuitive verdict. Bulletin violates nearly every modern design
  // convention and remains one of the most-visited sites in its country.
  // The jury rules Strong Design. This is the case people argue about.
  {
    id: 'case-012',
    number: 'CASE #009',
    title: 'Bulletin',
    context: 'Authored classifieds scenario / desktop',
    imageNotice: 'This original fictional category directory replaces a supplied classifieds capture. Earlier saved observations and coordinates are retained unchanged and may describe the former image. The working Second Look Bulletin is a separate authored exhibit.',
    category: 'Wildcard / Controversial',
    movement: 3,

    screenshot: '/screenshots/case-012.jpg',
    screenshotAspect: '1440/900',
    screenshotDescription: 'A desktop classifieds home page with a compact masthead, search and account tools, dense multi-column category links, side utilities, and a footer.',
    evidenceTargets: [
      { x: 50, y: 7, label: 'Masthead and search' },
      { x: 50, y: 38, label: 'Primary category columns' },
      { x: 14, y: 48, label: 'Left utility column' },
      { x: 88, y: 45, label: 'Right utility column' },
    ],

    officialVerdict: 'strong_design',
    caseStatus: 'landmark',
    contestedSummary: null,

    curatorNote: "The authored readings challenge the assumption that visual sophistication guarantees a useful interface. Density and direct text links may aid retrieval, while readability and trust remain open questions. No traffic ranking is claimed.",

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          'A user evaluating classifieds needs to assess dozens of options simultaneously; the flat text-link layout enables that scan precisely because it assigns no visual weight that would bias the read before the user has processed the content.',
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          "Small, densely packed text raises a readability question. No contrast measurement or conformance test is supplied. Familiar text links may also provide a direct navigation model.",
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          "The visible links suggest direct category routes. This capture cannot establish transaction step counts or superiority to other marketplaces.",
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          "No verification or dispute route is visible in this capture. That absence raises a trust question, but does not establish what the full service provides or how real transactions fare.",
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          "The blunt text treatment can feel direct and unperformed. This is an authored interpretation of expression, not evidence about traffic, algorithms, or the absence of dark patterns.",
      },
    ],

    annotations: [
      {
        x: 23, y: 5, width: 57, height: 10,
        label: "Category headings and text weight offer a simple scanning structure. Its speed relative to other navigation systems has not been measured.",
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 23, y: 5, width: 57, height: 88,
        label: "Visible links expose several possible routes. The image does not establish transaction depth, account requirements, or end-to-end task friction.",
        juror: 'usability',
        type: 'not_guilty',
      },
      {
        x: 23, y: 52, width: 22, height: 14,
        label: "Compact blue text raises a readability question. Its contrast and accessibility conformance have not been measured here.",
        juror: 'accessibility',
        type: 'mixed',
      },
      {
        x: 1, y: 1, width: 98, height: 96,
        label: "No verification or dispute route is visible here. The screenshot does not establish their absence from the full service.",
        juror: 'trust',
        type: 'mixed',
      },
      {
        x: 1, y: 1, width: 98, height: 96,
        label: 'The refusal to optimize attention is its emotional signature: blunt, stable, and unusually free of manufactured urgency.',
        juror: 'delight',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #015 ───────────────────────────────────────────────────────────────
  // Contested. An independent fashion retailer built in full brutalist style:
  // oversized type, navigation at the page bottom, no standard cart affordances.
  // Notably: The Romantic is the juror who condemns it.
  {
    id: 'case-015',
    number: 'CASE #010',
    title: 'Brutalist Fashion Store',
    context: 'Authored fashion scenario / desktop',
    category: 'Delight vs Usability Tradeoffs',
    movement: 4,

    screenshot: '/screenshots/case-015.jpg',
    screenshotAspect: '680/510',
    screenshotDescription: 'A high-contrast brutalist fashion storefront with an oversized CRUDE masthead, a dark product image, sparse product details, a price and add control, and bottom navigation.',
    evidenceTargets: [
      { x: 20, y: 15, label: 'CRUDE masthead' },
      { x: 24, y: 58, label: 'Product image' },
      { x: 69, y: 42, label: 'Product information' },
      { x: 70, y: 76, label: 'Price and add control' },
      { x: 50, y: 96, label: 'Bottom navigation' },
    ],

    officialVerdict: null,  // sealed — no panel verdict entered; the investigator's ruling stands alone
    caseStatus: 'sealed',

    jurorRulings: [],
    annotations: [],
  },

];

export const getCaseById = (id) => CASES.find((c) => c.id === id) ?? null;
