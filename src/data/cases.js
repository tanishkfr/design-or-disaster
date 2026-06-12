// cases.js — Design or Disaster
//
// All product names are fictional to avoid brand references.
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
    context: 'Personal finance app, iOS, 2022',
    category: 'Visual Hierarchy',

    screenshot: '/screenshots/case-001.jpg',
    screenshotAspect: '9/16',

    officialVerdict: 'needs_revision',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'Selected as the cold open case because it divides precisely: two jurors see professional restraint, two see a failed hierarchy, one sees both simultaneously. It is the case most likely to reveal the investigator\'s default orientation within the first thirty seconds.',

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
          'Transaction metadata — category labels and dates — renders at approximately 2.5:1 contrast against white; below the 4.5:1 WCAG AA threshold at this size; functional in ideal conditions and a real cost in ambient light or for users with reduced contrast sensitivity.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'Send Money is the primary task on a banking dashboard; it appears in the first position of a flat four-item row with no visual distinction from the three actions beside it; the repeat-user model is correct and the first-use experience pays for it.',
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
        label: 'Four actions at equal visual weight — a spatial grid organized for return-use navigation; after three sessions the positions are memorized and the scan stops; correct for the user who already knows the product',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 4, y: 39, width: 22, height: 11,
        label: 'Send Money — the primary task for most users, at identical visual weight to Manage Cards; on day one there is no affordance distinguishing frequency of use; the repeat-user model pays its cost at first contact',
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 18, y: 58, width: 42, height: 7,
        label: 'Category and date labels — approximately 2.5:1 contrast against white; fails WCAG AA at this size; functional in optimal conditions; a real cost for users with reduced contrast sensitivity or high-ambient-light environments',
        juror: 'accessibility',
        type: 'mixed',
      },
    ],
  },


  // ─── CASE #002 ───────────────────────────────────────────────────────────────
  // Landmark. A social messaging app merged friend Stories with Discover content
  // into a single algorithmically sorted feed. A user petition reached over a
  // million signatures. The company partially reversed the redesign months later.
  {
    id: 'case-002',
    number: 'CASE #002',
    title: "Flare's 2018 Redesign",
    context: 'Social messaging, iOS, 2018',
    category: 'Wildcard / Controversial',

    screenshot: '/screenshots/case-002.jpg',
    screenshotAspect: '9/16',

    officialVerdict: 'design_disaster',
    caseStatus: 'landmark',
    contestedSummary: null,

    curatorNote: 'One of the few cases where a design decision produced a public measurable response — over a million signatures, a partial reversal, and a documented decline in daily active users. Included not because the design was straightforwardly wrong, but because the jury\'s minority position deserves a fair hearing: the redesign was trying to solve a real problem about separating personal content from media content, and the failure was in the execution, not necessarily the intention.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'The original spatial grammar encoded social distance directly — friends left, world right, camera centre — and the redesign replaced that legible axis with a single algorithmically sorted stream where friend content and media content competed without distinction.',
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          'Algorithmic ranking applied to a peer-content feed introduces systemic inequality: users with smaller networks see their content deprioritised, and the people most likely to feel abandoned first are the casual users who kept the platform social.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'Users had accumulated precise spatial memory across years of use — swipe left, swipe right, camera centre; invalidating that vocabulary without a migration path is not a redesign cost, it is a relearning tax levied on every existing user at once.',
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          'Flare stated the redesign would separate friends from media content, then applied algorithmic ranking — the primary mechanism of media distribution — to the friends feed, making the stated rationale and the implemented system direct contradictions.',
      },
      {
        juror: 'delight',
        ruling: 'mixed',
        reasoning:
          'The original platform understood ephemerality as an intimacy mechanism — not a feature but a social contract between people who trusted each other with unpolished moments; the redesign was trying to protect that contract, and the failure deserves more considered reading than the petition gave it.',
      },
    ],

    annotations: [
      {
        x: 5, y: 12, width: 90, height: 32,
        label: 'Friend messages merged with media content — algorithmic ranking applied where social proximity had previously determined order; the signal of who sent this is structurally equivalent to the signal of what Discover recommends',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 5, y: 62, width: 90, height: 20,
        label: 'Story update merged with direct messages — broadcast content treated as chat; the original spatial separation of these two modes was the product\'s core navigational argument, encoded into left-right swipe vocabulary built over years',
        juror: 'usability',
        type: 'guilty',
      },
    ],
  },


  // ─── CASE #003 ───────────────────────────────────────────────────────────────
  // The checkout that gates purchase behind mandatory account creation.
  // One of the most widely documented conversion failures in e-commerce.
  {
    id: 'case-003',
    number: 'CASE #003',
    title: 'The Forced Account',
    context: 'E-commerce checkout, desktop web, 2021',
    category: 'Forms & Inputs',

    screenshot: '/screenshots/case-003.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'needs_revision',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'The forced account registration pattern has been studied extensively. A 2009 usability study found that removing the account requirement produced a 45% increase in purchases in the first year. This case exists in the archive as institutional memory: a pattern that costs measurably, taught a lesson decades ago, and persists in production anyway. The question worth asking is why.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'The checkout presents a registration form as its entry point — before a basket summary, before a price confirmation — so the visual hierarchy leads with an obligation rather than a transaction.',
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          'Account creation provides genuine long-term value to users who return — order history, saved addresses, faster future checkout — but the timing of the request, before any purchase has been completed, presents the trade-off as settled for users who have not yet decided whether to return.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'The task is completing a purchase; a guest checkout completes that task; the registration gate inserts a separate, prerequisite task — account creation — before the primary task is permitted to begin.',
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          'The company receives a permanent customer record from every buyer; the user receives an order history they could have tracked by saving the confirmation email; the exchange looks symmetric and is not.',
      },
      {
        juror: 'delight',
        ruling: 'guilty',
        reasoning:
          "A transaction that begins with 'create an account before we'll help you' has already communicated what kind of relationship this will be.",
      },
    ],

    annotations: [
      {
        x: 2, y: 22, width: 63, height: 10,
        label: 'The checkout presents the company\'s objective — "Create Your Account" — as the page heading; the user\'s objective — completing a purchase — is named nowhere in the primary column; the visual hierarchy leads with what the company requires before confirming what the user will receive',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 2, y: 37, width: 63, height: 47,
        label: 'Three fields gate the transaction — email, password, confirm password; completing this form is a prerequisite task before the primary task is permitted to begin; the user came to buy something; the system requires them to register first; guest checkout is present but requires scrolling past the form to locate it',
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 0, y: 15, width: 100, height: 82,
        label: 'The company receives a permanent customer record — email address, purchase history, behavioural data — from every buyer who completes this form; the user receives an order history they could have tracked with a confirmation email; the two-column layout encodes this exchange: the company\'s requirement occupies the dominant column, the user\'s goal occupies the secondary one',
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 3, y: 87, width: 58, height: 7,
        label: 'Guest checkout is available — it appears below an "or" divider in smaller text, styled as a link rather than a button; its visual treatment communicates the desired direction before the user has evaluated the exchange; users who read the link\'s subordinated weight as a less legitimate option pay the cost of a registration form they had no obligation to complete',
        juror: 'accessibility',
        type: 'mixed',
      },
      {
        x: 65, y: 62, width: 33, height: 14,
        label: 'The order summary states: shipping address and payment details will be entered after completing account setup; the user\'s actual checkout steps — the thing they came here to do — are explicitly deferred until the company\'s data collection requirement has been satisfied; the sequence is not incidental; it is the design\'s stated priority',
        juror: 'delight',
        type: 'guilty',
      },
    ],
  },


  // ─── CASE #004 ───────────────────────────────────────────────────────────────
  // A benchmark in editorial hierarchy for news applications.
  // The type scale is doing navigational work.
  {
    id: 'case-004',
    number: 'CASE #004',
    title: 'The Broadsheet App',
    context: 'Editorial news application, iOS, 2022',
    category: 'Visual Hierarchy',

    screenshot: '/screenshots/case-004.jpg',
    screenshotAspect: '9/16',

    officialVerdict: 'strong_design',
    caseStatus: 'consensus',
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
          'The task of reaching a specific story completes in one tap from the home view; the hierarchy is doing the navigation work that the user would otherwise need to perform manually.',
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
        label: 'Every story in the visible surface is one tap away; the hierarchy does the navigation work the user would otherwise perform manually — stories do not need to be searched for, filtered, or clicked through; the task of reaching specific content completes at the first viewport',
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


  // ─── CASE #005 ───────────────────────────────────────────────────────────────
  // Contested. A full-featured travel booking site using a hamburger menu as its
  // primary navigation on desktop. The jury is 3/2 on whether the convention
  // justifies the hidden structure.
  {
    id: 'case-005',
    number: 'CASE #005',
    title: 'The Hamburger Navigation',
    context: 'Travel booking, desktop web, 2020',
    category: 'Navigation',

    screenshot: '/screenshots/case-005.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'needs_revision',
    caseStatus: 'contested',

    contestedSummary:
      'The hamburger menu is among the most empirically tested patterns in interface design, and the evidence remains genuinely divided. Usability studies consistently measure lower first-visit navigation engagement with collapsed menus. Product teams at major technology companies reversed their implementations after analysing conversion. Yet some of the highest-traffic products on the internet maintain collapsed navigation without measurable harm. The Advocate and The Skeptic hold that the pattern is now culturally literate and reduces persistent visual complexity. The majority hold that any navigation requiring an action to reveal has already failed the first moment of orientation — and that this failure is more costly on desktop, where surface area is not the constraint.',

    curatorNote: 'The contested verdict reflects genuine disagreement among researchers and practitioners. The hamburger menu has been tested extensively, reversed by major organisations, and defended by others with equivalent conviction. This case exists in the archive to demonstrate that some design questions do not resolve — they develop. The jury\'s 3/2 split mirrors the state of the literature.',

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
          'Collapsing navigation to a single trigger reduces the number of persistent interactive elements on screen, which benefits users with attention regulation difficulties and creates a simpler keyboard navigation path through an otherwise dense page.',
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
          'The hamburger is among the most widely recognised interface conventions currently in use; invoking discoverability concerns for a pattern this culturally established attributes naivety to an audience that encounters it on every device they own.',
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
        label: 'By 2020, the hamburger icon appeared on streaming services, news platforms, productivity tools, and mobile operating systems encountered daily by the population this product serves; the pattern recognition gap that made collapsed navigation costly when the pattern was novel had largely closed; the Skeptic holds that invoking discoverability concerns for a convention this culturally established overestimates user naivety',
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


  // ─── CASE #006 ───────────────────────────────────────────────────────────────
  // A welfare application form where the people most likely to use it are
  // the most poorly served by its design.
  {
    id: 'case-006',
    number: 'CASE #006',
    title: 'The Benefits Form',
    context: 'Government welfare services, desktop web, 2022',
    category: 'Accessibility',

    screenshot: '/screenshots/case-006.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'design_disaster',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'The session timeout was set by the IT security team for a legitimate reason: preventing data exposure on shared public computers in libraries and job centres. The form was designed by a different team. No integration specification existed to reconcile the two requirements. This case was included not as an example of bad intention, but as a study in what happens when design responsibility is distributed without coordination across an organisation.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'The form distributes forty-three input fields across a continuous scroll without semantic grouping, visual progress indication, or any spatial signal of how much of the task remains.',
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          'The people this form exists to serve — those in financial crisis, with elevated cognitive load, potentially navigating it in a second language or without prior experience of government digital systems — encounter its highest barriers: no inline validation, no contextual help, no ability to save and return.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'The session timeout is shorter than the time the form requires to complete; a user who is interrupted, pauses to gather a document, or simply reads slowly loses their work and must begin again.',
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          'A welfare application that discourages completion through design complexity reduces the number of successful claims without requiring an explicit policy decision to do so; the interface performs administrative work that policy cannot.',
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
        label: 'Session expires in 8 minutes — a 43-field welfare application takes 19 to 26 minutes to complete; the timeout was configured by IT security to protect session data on shared computers in libraries and job centres; the form was designed by a different team; no integration test documented whether the two requirements were compatible',
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 6, y: 24, width: 88, height: 7,
        label: 'No progress indicator — the form names the task but not its scope; at this point the applicant has completed 6 of 43 required fields; this information is not available anywhere in the interface; on a second submission attempt with 8 minutes remaining the applicant cannot calculate whether completing the form is achievable before session expiry',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 6, y: 34, width: 88, height: 21,
        label: '9 errors surface simultaneously at the moment of first submission — none appeared during entry; the error summary satisfies WCAG 2.1 SC 3.3.1 Error Identification; it does not satisfy the purpose of that requirement; inline validation at the point of entry is the accessible pattern; deferring all errors to submission concentrates the correction task at the moment of maximum session pressure and minimum remaining time',
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 6, y: 57, width: 88, height: 29,
        label: 'Each error requires the applicant to locate the field, read the requirement, and re-enter valid data; the intersection of 9 simultaneous errors with 8 minutes on the clock is not the outcome of a policy decision; it is the residue of separate decisions made by separate teams with no shared specification; the interface performs administrative filtering that no policy document explicitly authorised',
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 6, y: 88, width: 88, height: 5,
        label: '37 more fields below — the form does not distinguish between a routine renewal and a first application submitted by someone in acute financial distress; it processes both identically; the clinical efficiency is not restraint; it is the design\'s failure to consider the range of people it was built to serve',
        juror: 'delight',
        type: 'guilty',
      },
    ],
  },


  // ─── CASE #007 ───────────────────────────────────────────────────────────────
  // University digital services built around departmental structure
  // rather than student tasks. A classic inside-out information architecture.
  {
    id: 'case-007',
    number: 'CASE #007',
    title: 'University Digital Services',
    context: 'University enrollment portal, desktop web, 2023',
    category: 'Information Architecture',

    screenshot: '/screenshots/case-007.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'design_disaster',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'The information architecture accurately mirrors the institution\'s organisational chart. This is the case, precisely. Systems built around internal structure rather than user tasks are not a design failure — they are an organisational failure expressed through design. The portal is doing exactly what the institution asked of it. The question the jury is actually answering is whether that is an acceptable answer.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          "The navigation maps the institution's departmental structure rather than any user's task; a student registering for a module passes through four distinct sites, each with its own navigation system, none of which acknowledge the others.",
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          'Students who most need institutional support — those with disabilities, those in their first term, those from under-represented backgrounds navigating an unfamiliar system — are most likely to encounter these services under time pressure and without the familiarity that makes the fragmentation workable.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'Enrolling in a single module requires visiting three systems, creating credentials in two, and locating documentation in a fourth — this is not a task with friction, it is four separate tasks that have been presented as one.',
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          "The fragmented architecture accurately reflects an organisation in which departments control their own digital infrastructure and the student's end-to-end experience is no single team's responsibility; this is the system working as designed.",
      },
      {
        juror: 'delight',
        ruling: 'guilty',
        reasoning:
          'The structure of this digital estate tells the student exactly what the institution believes about them: that they are a series of administrative transactions, distributed across the offices that process them.',
      },
    ],

    annotations: [
      {
        x: 0, y: 5, width: 100, height: 10,
        label: 'The portal accurately represents an institution in which departments control their own digital infrastructure and no single team owns the student\'s end-to-end experience; this is the design working correctly; the accuracy of the representation is the indictment',
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 2, y: 15, width: 82, height: 9,
        label: 'The navigation labels name six departments — Registrar\'s Office, Academic Services, Finance & Fees, IT Services, Faculty Portal; a student who arrives needing to enrol in a module cannot determine from these labels which tab to enter; the hierarchy is the institution\'s organisational chart presented as a student interface',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 2, y: 24, width: 64, height: 14,
        label: 'The student most likely to fail here is the one with no institutional literacy — first term, unfamiliar with departmental structure, operating under a registration deadline; the portal offers institutional welcome language and no task orientation; the cost of this taxonomy is paid most heavily by the user who most needs guidance',
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 2, y: 45, width: 65, height: 6,
        label: 'The portal offers four quick links: Academic Records, Pay Fees, IT Support, Student Welfare; each names an administrative category; none names a student action; the word \'enrol\' does not appear anywhere in the visible surface; the student is present in this system as the subject of processes, not as the person who has come here to do something',
        juror: 'delight',
        type: 'guilty',
      },
      {
        x: 1, y: 57, width: 98, height: 41,
        label: 'Each card offers a different login path — Log In to Registrar, Access Portal, Go to Finance, Open IT Services, Faculty Login, Student Support — communicating that these are separate systems with separate entry mechanisms; module enrolment requires visiting three of them; the portal presents this as a single unified service',
        juror: 'usability',
        type: 'guilty',
      },
    ],
  },


  // ─── CASE #008 ───────────────────────────────────────────────────────────────
  // A rare case where the form is designed for the user, not around the
  // company's data requirements. Progressive disclosure in practice.
  {
    id: 'case-008',
    number: 'CASE #008',
    title: "Relay's Onboarding",
    context: 'Payment infrastructure, desktop web, 2022',
    category: 'Forms & Inputs',

    screenshot: '/screenshots/case-008.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'strong_design',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'Three fields to first API key. The comparison is instructive: most comparable payment infrastructure products require business registration, compliance documentation, or identity verification before any value is demonstrated. The Skeptic\'s minority position is worth holding alongside the majority verdict: the simplicity is front-loaded, and the full compliance requirements arrive after integration when switching cost is real.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          'The form presents three fields on first load; every comparable payment infrastructure requires business registration, VAT details, or KYC documentation at signup; the right panel shows what these three fields purchase before the user has submitted them — form and evidence occupy the same viewport.',
      },
      {
        juror: 'accessibility',
        ruling: 'not_guilty',
        reasoning:
          'The password field responds with a strength indicator rather than a requirements checklist; feedback communicates outcome rather than obligation; there are no asterisks, no mandatory-field warnings, no error walls at submission — the form distributes the cost of correction across the process rather than concentrating it at the end.',
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          'A developer reaches a working API key within the time it takes to read the documentation displayed on the same page; test mode is enabled by default so no real charges occur during evaluation; the form does not ask for information before demonstrating why that information is needed.',
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          'The three-field form is accurate as far as it goes; the full compliance requirements — business verification, bank account, beneficial owner identity, payout activation — are extensive, deferred, and arrive after integration when switching cost is real; the simplicity is front-loaded, not representative of the complete process.',
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'This is the rare onboarding that treats the person filling it in as capable — it does not over-explain, does not request confirmation of things already confirmed, and declines to perform enthusiasm; the button says "Create account", not "Start your free journey"; the restraint is the hospitality.',
      },
    ],

    annotations: [
      {
        x: 0, y: 21, width: 54, height: 68,
        label: 'Three fields to first API key — email, password, company name; every comparable payment infrastructure requires business registration, VAT details, or KYC documentation at signup; this form\'s entire ask fits on a single screen',
        juror: 'usability',
        type: 'not_guilty',
      },
      {
        x: 0, y: 63, width: 54, height: 5,
        label: 'Inline strength indicator without a requirements wall — the form responds to what the user did, not what they must do next; "Strong" communicates outcome, not obligation; this is the design trusting the user before asking anything significant of them',
        juror: 'accessibility',
        type: 'not_guilty',
      },
      {
        x: 0, y: 68, width: 54, height: 14,
        label: '"Company or individual name" — this field will later require an exact match to legal business registration for KYC compliance; the form\'s silence here is not restraint; it is the simplicity being front-loaded; the compliance wall arrives after integration when switching cost is real',
        juror: 'trust',
        type: 'mixed',
      },
      {
        x: 54, y: 5, width: 46, height: 90,
        label: 'Proof of value in the same frame as the form — the developer sees what three fields purchase before submitting them; the API code is accessible immediately after registration; test mode is on by default; form and evidence occupy the same viewport',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #009 ───────────────────────────────────────────────────────────────
  // Landmark. A mobile OS design overhaul that removed skeuomorphism entirely.
  // The industry's most significant visual shift in mobile design history.
  // The problems were real. The direction was right.
  {
    id: 'case-009',
    number: 'CASE #009',
    title: 'Nova OS 7',
    context: 'Mobile operating system, 2013',
    category: 'Visual Hierarchy',

    screenshot: '/screenshots/case-009.jpg',
    screenshotAspect: '9/16',

    officialVerdict: 'needs_revision',
    caseStatus: 'landmark',
    contestedSummary: null,

    curatorNote: 'Included as a landmark because it is the case where the verdict most requires temporal context. Evaluating a 2013 design decision against current standards misses the argument: at the time of release, this was the most significant visual shift in mobile operating system design in a decade. The industry\'s wholesale adoption of the flat visual language in the years that followed confirmed the direction was right even where the first execution was not.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'The transition to a flat visual language removed the depth cues that had distinguished interactive elements from static content — buttons, labels, and navigation items became visually equivalent, and the surface offered no information about which elements responded to touch.',
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          'The ultralight typeface at small sizes in outdoor and high-ambient-light conditions produced contrast failures across multiple core applications; the manufacturer issued a system-wide type weight and size correction within six months of release.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'Users had to develop an entirely new model of interface legibility — any text element might also be a button — which is a high interpretive cost distributed simultaneously across every person using an operating system serving hundreds of millions of devices.',
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          "The manufacturer shipped a visual language that required an OS-level accessibility correction within six months; whether this reflects inadequate real-world testing or a decision to ship and revise is a question the timeline raises without answering.",
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'Nova OS 7 dismantled a visual language that had become a shared vernacular and replaced it with something genuinely new; the problems were real, the courage was also real, and the industry\'s wholesale adoption of the flat visual language in the years that followed confirmed the direction was right even where the first execution was not.',
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
        label: 'Systematic colour language — twenty objects sharing grammar, palette, and squircle form. The industry adopted this visual direction wholesale within two years.',
        juror: 'delight',
        type: 'not_guilty',
      },
      {
        x: 4, y: 78, width: 92, height: 7,
        label: 'Ultralight labels at 11px — contrast failure in ambient and outdoor conditions; the manufacturer issued an OS-level type correction within six months of release',
        juror: 'accessibility',
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
    number: 'CASE #010',
    title: 'The Animated Portfolio',
    context: 'Personal designer portfolio, desktop, 2023',
    category: 'Delight vs Usability Tradeoffs',

    screenshot: '/screenshots/case-010.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'needs_revision',
    caseStatus: 'contested',

    contestedSummary:
      "Portfolio sites sit at the exact point where usability principles and expressive design come into direct conflict. The case for animation is that, for this specific product type, demonstrating capability is the task — the interface does not exist to help a user complete an errand, it exists to answer a question about the designer's range. The Operator and The Romantic hold that the animated portfolio answers that question more honestly than a static grid. The majority hold that an interface controlling the user's attention pace is failing on its own terms — and that the more important question, whether this designer knows when restraint serves the work better, is the one the portfolio refuses to answer.",

    curatorNote: 'The contested verdict was 3/2, with The Operator and The Romantic on opposite sides of the same argument — that demonstrating capability is the task on a portfolio site, and therefore friction is the proof of concept. The Romantic\'s ruling is the one most likely to surprise: the juror who most defends expressive design is also the one most precise about when expression is honest and when it is performance.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'Hierarchy requires a reading surface that is at rest; this interface is never still, and the eye cannot evaluate what it is being shown while it is occupied tracking what is still arriving.',
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          "Scroll-jacking removes the user's control over their own navigation pace, which causes physical discomfort for users with vestibular conditions and breaks the standard navigation model for keyboard users and assistive technology without providing an alternative.",
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          'A portfolio is not a utility — it is a demonstration, and a designer who ships motion this precise is showing their capability at a fidelity no static case study can replicate; the friction is the proof of concept.',
      },
      {
        juror: 'trust',
        ruling: 'guilty',
        reasoning:
          'Every animation is executed; none appears considered — the interface demonstrates technical capability while leaving the more important question entirely unanswered: whether this person knows when not to do this.',
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
        label: 'Headline mid-reveal — the reading surface has not settled; the eye is tracking arrival rather than evaluating what arrived; hierarchy requires stillness before it can operate',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 5, y: 45, width: 28, height: 7,
        label: 'Scroll indicator implies scroll-jacked navigation — the user\'s control over their navigation pace has been removed; vestibular impact is real; keyboard navigation path is broken without an alternative',
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 5, y: 57, width: 90, height: 40,
        label: 'Four simultaneous entrance animations — the precision required to coordinate these is non-trivial; the Operator holds that this is capability demonstrated at viewport scale; a static grid cannot replicate the fidelity of this proof of concept',
        juror: 'usability',
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
    number: 'CASE #011',
    title: 'The Identity Form',
    context: 'Dating platform profile setup, mobile, 2014',
    category: 'Accessibility',

    screenshot: '/screenshots/case-011.jpg',
    screenshotAspect: '16/9',

    officialVerdict: 'strong_design',
    caseStatus: 'contested',
    contestedSummary:
      'Three jurors rule for the design without reservation. Two hold genuine positions — one that the tradeoff is real even if the outcome is correct, one that principled design and strategic timing are not always separable and that the distinction matters. The majority verdict is Strong Design. The minority is not wrong to ask the question.',

    curatorNote: 'Included as a case about structural decisions and their downstream effects. The form\'s merit is not the addition of options — adding options to a form is trivial. The merit is the structural decision to separate gender identity, sexual orientation, and pronouns into distinct fields, treating them as distinct variables rather than variations of a single category. That structural decision has implications for how any downstream system — matching algorithm, marketing segmentation, research data — receives and processes the information.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          'The expanded form uses three discrete fields where the original used one — gender identity, sexual orientation, and pronouns occupy separate rows in the profile setup flow. Splitting what the previous interface had collapsed communicates that these are distinct variables rather than variations of the same variable; that structural decision has downstream consequences for how the matching system receives and processes the data.',
      },
      {
        juror: 'accessibility',
        ruling: 'not_guilty',
        reasoning:
          'The binary gender field on a dating platform does not merely fail to represent non-binary users — it forces a choice between misrepresentation and invisibility. A user who selects Male or Female when neither is accurate receives match results calibrated to an identity they do not have. The cost is not friction at the form; it is the product\'s core function operating incorrectly for that population.',
      },
      {
        juror: 'usability',
        ruling: 'mixed',
        reasoning:
          'The task is finding a match. A form that collects accurate identity data produces more accurate matches. The expanded field set introduces real complexity at intake but reduces mismatch downstream — this is friction that does work, which is a different category from friction that does not. The tradeoff is real; it is not equal.',
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          'The expanded identity fields arrived when binary swiping had established itself as the default model for mobile dating. Whether this is a principled commitment to accurate user representation or a differentiation strategy aimed at a specific demographic segment — those two explanations are not mutually exclusive, which is precisely the question worth holding.',
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
        label: 'Multi-select dropdown — not a radio button, not a binary toggle; the structural choice communicates that the variable being collected is a spectrum, not a category; this distinction has direct consequences for how downstream systems process the data',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 3, y: 35, width: 93, height: 62,
        label: 'Twenty-two discrete options across three distinct fields — gender identity, sexual orientation, pronouns separated structurally; the form encodes that these are not variations of a single variable but three independently meaningful attributes; the matching algorithm receives three distinct inputs rather than one collapsed field',
        juror: 'accessibility',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #012 ───────────────────────────────────────────────────────────────
  // The counterintuitive verdict. Bulletin violates nearly every modern design
  // convention and remains one of the most-visited sites in its country.
  // The jury rules Strong Design. This is the case people argue about.
  {
    id: 'case-012',
    number: 'CASE #012',
    title: 'Bulletin',
    context: 'Classifieds marketplace, desktop web, 2024',
    category: 'Wildcard / Controversial',

    screenshot: '/screenshots/case-012.jpg',
    screenshotAspect: '16/10',

    officialVerdict: 'strong_design',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'The counterintuitive verdict. Bulletin violates nearly every current design convention — no visual hierarchy, default browser typography, link-based navigation, no onboarding — and remains one of the most-visited sites in its category. The case exists in the archive because the verdict challenges the assumption that design quality tracks with visual sophistication. The bluntness is the personality. The personality is honest.',

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
          'Default link contrast falls below WCAG AA and type sizes are smaller than current guidance, but the interface imposes no patterns to learn and no progressive disclosure to navigate — the accessibility trade-off runs in both directions.',
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          'Post a listing, search a category, contact a seller — every transaction Bulletin facilitates completes in fewer steps than on any modern classifieds platform that has attempted to improve on it.',
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          'Bulletin provides no verification mechanism, no safety signal, and no dispute path — this is not an oversight but a deliberate product position that places trust entirely between the two parties, which functions in low-stakes transactions and fails in high-stakes ones.',
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'Bulletin is almost alone among high-traffic consumer products in refusing to perform — no dark patterns, no manufactured scarcity, no algorithmic manipulation of attention; the bluntness is the personality, and the personality is an honest one.',
      },
    ],

    annotations: [
      {
        x: 23, y: 5, width: 57, height: 10,
        label: 'Category headers — no visual hierarchy beyond text weight; no nesting, no progressive disclosure; the scan completes without a mechanism to direct it; the interface trusts the user to find the category faster than any navigation system would',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 23, y: 5, width: 57, height: 88,
        label: 'Every transaction accessible in two clicks — no login required to search, no onboarding to navigate, no account to create before contacting a seller; the task completes without friction because no friction was added',
        juror: 'usability',
        type: 'not_guilty',
      },
      {
        x: 23, y: 52, width: 22, height: 14,
        label: 'Blue link text at default browser size — contrast below WCAG AA; type sizes below current guidance; the interface imposes no patterns to learn but the accessibility baseline is not met',
        juror: 'accessibility',
        type: 'mixed',
      },
    ],
  },


  // ─── CASE #013 ───────────────────────────────────────────────────────────────
  // A browser that proposes a fundamentally different model of navigation —
  // built around intention and completion rather than accumulation.
  {
    id: 'case-013',
    number: 'CASE #013',
    title: 'Orbit Browser',
    context: 'Web browser, macOS, 2023',
    category: 'Navigation',

    screenshot: '/screenshots/case-013.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'strong_design',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'The Advocate\'s mixed ruling is the one to hold. The navigation model — pinned tabs, transient tabs, automatic archiving — is genuinely more efficient than the conventional tab-bar model for users who learn it. The cost is paid at the beginning, not the end. The question the case raises is whether it is acceptable to impose a learning investment on users in service of a navigation model you believe is superior.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          'The sidebar collapses active tabs by domain, treating multiple pages from the same source as a single navigational unit; the spatial relationship between pinned and unpinned items communicates permanence versus transience without additional labelling.',
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          'The novel navigation model — pinned versus unpinned tabs, Spaces, automatic archiving — requires a learning period that disadvantages users with strong spatial memory built around conventional tab-bar navigation; the efficiency is real but not front-loaded.',
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          'After a brief orientation period, common tasks — switching contexts, finding recent pages, managing concurrent work — complete faster than in any tab-bar browser; the model rewards the investment it requires.',
      },
      {
        juror: 'trust',
        ruling: 'not_guilty',
        reasoning:
          "Orbit's navigation is built around the premise that browsing sessions have intention and completion — that you open the browser to accomplish something and then close it; this is either the correct model for how browsers should work or a strong institutional position about what browsing ought to be, and the product is honest about which it believes.",
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'Most browsers are instruments for accumulation; Orbit is the first one designed around the premise that letting things go is a reasonable response to the internet.',
      },
    ],

    annotations: [
      {
        x: 0, y: 22, width: 33, height: 20,
        label: 'Pinned tabs — three tools that persist across sessions; position above the divider communicates permanence without label, tooltip, or explanation; spatial grammar carries semantic meaning',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 0, y: 42, width: 33, height: 5,
        label: 'The divider — one line separating permanent from transient; the navigational model\'s entire argument is encoded here; above stays, below goes',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 1, y: 47, width: 32, height: 23,
        label: 'Domain-grouped today tabs — two pages from the same source collapse into one navigational unit; the efficiency is real but requires learning before it is legible; users with strong conventional tab-bar spatial memory will not find this immediately familiar',
        juror: 'accessibility',
        type: 'mixed',
      },
      {
        x: 33, y: 5, width: 67, height: 88,
        label: 'No top tab bar — the viewport is unusually clean for a session with five open tabs; navigation has moved entirely to the sidebar; this is either the cleanest browsing surface available or a model with no migration path for users who expect their tabs at the top',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
    ],
  },


  // ─── CASE #014 ───────────────────────────────────────────────────────────────
  // A furniture catalogue organised by room rather than product type —
  // one of the few commercial information architectures built around
  // how users actually think rather than how inventory is managed.
  {
    id: 'case-014',
    number: 'CASE #014',
    title: "Forma's Navigation",
    context: 'Furniture retail, desktop web, 2023',
    category: 'Information Architecture',

    screenshot: '/screenshots/case-014.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'strong_design',
    caseStatus: 'consensus',
    contestedSummary: null,

    curatorNote: 'Room-based taxonomy is not technically novel — a furniture catalogue organised by room rather than product type is an obvious decision once stated. What makes it worth examining is that most furniture catalogues are not organised this way. They are organised by product type, which reflects how inventory systems are structured rather than how people shop. The Skeptic\'s observation — that the taxonomy constructs a particular idea of domestic life — is the observation the designers almost certainly did not foreground.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          "The primary navigation organises by room rather than product type, aligning the category structure with the user's decision context; a person furnishing a bedroom is not thinking in product categories, they are thinking in spaces, and the taxonomy acknowledges this.",
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          'The room-based taxonomy assumes a conventional domestic configuration — it works well for users furnishing standard rooms but is less navigable for users with non-standard spaces or those shopping for a functional requirement that spans multiple rooms.',
      },
      {
        juror: 'usability',
        ruling: 'not_guilty',
        reasoning:
          'A user who knows they are furnishing a living room reaches the relevant category in two clicks; the search function handles users who know a product name, and the room navigation handles users who do not.',
      },
      {
        juror: 'trust',
        ruling: 'mixed',
        reasoning:
          'Organising a furniture catalogue by room rather than product type shapes the shopping experience around a lifestyle aspiration; the taxonomy is not neutral — it constructs a particular idea of domestic life and asks the user to shop within it.',
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'Most furniture catalogues ask what you want to buy; Forma asks what kind of home you want to live in — the difference is small in pixels and large in intent.',
      },
    ],

    annotations: [
      {
        x: 0, y: 0, width: 100, height: 15,
        label: 'Room-based primary navigation — the category structure maps to the user\'s decision context rather than the retailer\'s inventory system; a person furnishing a bedroom thinks in spaces, not product types',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 0, y: 15, width: 100, height: 20,
        label: 'Product subcategories within room context — two-click depth from landing to category; the taxonomy does the navigational work the user would otherwise perform manually',
        juror: 'usability',
        type: 'not_guilty',
      },
      {
        x: 0, y: 0, width: 100, height: 35,
        label: 'Conventional domestic assumption — non-standard spaces are underserved; a user shopping for a functional requirement that spans multiple rooms finds the taxonomy less useful than a user shopping room by room',
        juror: 'accessibility',
        type: 'mixed',
      },
    ],
  },


  // ─── CASE #015 ───────────────────────────────────────────────────────────────
  // Contested. An independent fashion retailer built in full brutalist style:
  // oversized type, navigation at the page bottom, no standard cart affordances.
  // Notably: The Romantic is the juror who condemns it.
  {
    id: 'case-015',
    number: 'CASE #015',
    title: 'Brutalist Fashion Store',
    context: 'Independent fashion retail, desktop, 2023',
    category: 'Delight vs Usability Tradeoffs',

    screenshot: '/screenshots/case-015.jpg',
    screenshotAspect: '4/3',

    officialVerdict: 'needs_revision',
    caseStatus: 'contested',

    contestedSummary:
      "Brutalist design in commerce proposes that friction can be a qualifying mechanism — the interface filters for buyers aligned with the brand's values and aesthetics. The Scanner and The Skeptic find this coherent: the hierarchy functions on its own terms, and a brand that knows its audience is demonstrating clarity, not confusion. The Advocate and The Operator find that unconventional affordances impose costs that are not borne equally — less technically confident users, users with visual processing differences, and first-time visitors all pay the premium. The Romantic, notably the juror most likely to defend expressive design, is not convinced the brutalism here is honest.",

    curatorNote: 'The Romantic\'s verdict is the case\'s most instructive element. The juror who most consistently defends expressive design — who ruled for the browser\'s navigation model, for the animated portfolio, for the identity form — rules against this one. The reason is precision: genuine brutalism is constrained by structure, not decorated with it. The harshness here is applied as atmosphere. That is not the same thing.',

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'not_guilty',
        reasoning:
          'Brutalist design enforces hierarchy through scale and silence rather than colour and convention — the reading order is unambiguous, the type commands a clear sequence, and the decisions are internally consistent even where they reject commercial defaults.',
      },
      {
        juror: 'accessibility',
        ruling: 'guilty',
        reasoning:
          'White text on black generates halation for users with dyslexia, and navigation placed against convention — at the bottom of the page, without standard affordances — creates a pattern-recognition barrier that experienced users absorb as friction and less experienced users read as the site not working; those two populations do not pay the same cost.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'The task is purchasing a product; on this interface, every step toward that task — finding the navigation, reading the interactive elements, identifying the checkout — requires interpretation that a standard affordance would have eliminated before the user noticed it was needed.',
      },
      {
        juror: 'trust',
        ruling: 'not_guilty',
        reasoning:
          "A brand that builds friction into its commerce interface is either making a statement about its audience or making a mistake; this one is making a statement — the question worth asking is whether that statement still holds for the buyer who arrives without already knowing the brief.",
      },
      {
        juror: 'delight',
        ruling: 'guilty',
        reasoning:
          'Brutalism earns its authority when the harshness is structural — when the constraints are imposed by the architecture rather than borrowed for atmosphere; this interface is loud without being precise, and genuine brutalism does not look like it is trying.',
      },
    ],

    annotations: [
      {
        x: 4, y: 5, width: 56, height: 20,
        label: 'Scale imposes reading order — hierarchy without convention; the type commands a sequence without colour, weight variation, or supporting visual structure; internally consistent on its own terms',
        juror: 'hierarchy',
        type: 'not_guilty',
      },
      {
        x: 1, y: 25, width: 42, height: 64,
        label: 'Inner frame border — decoration applied to brutalism, not a structural constraint imposed by the architecture; genuine brutalism does not add ornament; this border is not load-bearing',
        juror: 'delight',
        type: 'guilty',
      },
      {
        x: 43, y: 25, width: 56, height: 64,
        label: 'White on black throughout — halation risk for users with dyslexia; the contrast is high by WCAG measure but the halation effect is a real cost that WCAG does not capture',
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 0, y: 90, width: 100, height: 8,
        label: 'Navigation at page bottom — performing brutalism, not constrained by it; this placement is a convention of brutalist web design borrowed as atmosphere; it is not a structural requirement of the layout',
        juror: 'usability',
        type: 'guilty',
      },
    ],
  },

];

export const getCaseById = (id) => CASES.find((c) => c.id === id) ?? null;
