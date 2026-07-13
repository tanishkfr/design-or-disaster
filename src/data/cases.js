// cases.js — Design or Disaster
//
// Ten cases in four movements:
//   Movement I   — Consensus (3): the lenses are learned on cases the jury agreed on
//   Movement II  — The Divide (3): contested cases; the safety net is removed
//   Movement III — The Landmarks (3): cases with documented public consequences
//   Finale       — The Sealed Case (1): no panel verdict is entered; yours is the ruling of record
//
// These are authored projections, not live telemetry — declared in the methodology note.
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
    context: 'Editorial news application, iOS, 2022',
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


  // ─── CASE #006 ───────────────────────────────────────────────────────────────
  // A welfare application form where the people most likely to use it are
  // the most poorly served by its design.
  {
    id: 'case-006',
    number: 'CASE #003',
    title: 'The Benefits Form',
    context: 'Government welfare services, desktop web, 2022',
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


  // ─── CASE #005 ───────────────────────────────────────────────────────────────
  // Contested. A full-featured travel booking site using a hamburger menu as its
  // primary navigation on desktop. The jury is 3/2 on whether the convention
  // justifies the hidden structure.
  {
    id: 'case-005',
    number: 'CASE #004',
    title: 'The Hamburger Navigation',
    context: 'Travel booking, desktop web, 2020',
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


  // ─── CASE #010 ───────────────────────────────────────────────────────────────
  // Contested. A personal designer portfolio built with scroll-jacking, custom
  // cursor, and entrance animations on every section. The jury is 3/2 on whether
  // technical sophistication constitutes professional judgment.
  {
    id: 'case-010',
    number: 'CASE #005',
    title: 'The Animated Portfolio',
    context: 'Personal designer portfolio, desktop, 2023',
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
      {
        x: 0, y: 0, width: 100, height: 58,
        label: 'The continuous motion demonstrates execution, but never shows that the designer can recognize when the work needs stillness.',
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
    context: 'Dating platform profile setup, mobile, 2014',
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
      {
        x: 18, y: 0, width: 58, height: 100,
        label: 'Additional fields create intake friction, but the information they collect prevents more costly mismatches later in the product.',
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
  // Landmark. A social messaging app merged friend Stories with Discover content
  // into a single algorithmically sorted feed. A user petition reached over a
  // million signatures. The company partially reversed the redesign months later.
  {
    id: 'case-002',
    number: 'CASE #007',
    title: "Flare's 2018 Redesign",
    context: 'Social messaging, iOS, 2018',
    category: 'Wildcard / Controversial',
    movement: 3,

    screenshot: '/screenshots/case-002.jpg',
    screenshotAspect: '249/576',
    screenshotDescription: 'A mobile social feed showing a blue Friends header, a vertically ranked list of contacts with activity metadata, and a floating action control.',
    evidenceTargets: [
      { x: 50, y: 7, label: 'Friends header' },
      { x: 48, y: 38, label: 'Upper contact list' },
      { x: 48, y: 70, label: 'Lower contact list' },
      { x: 51, y: 92, label: 'Floating action control' },
    ],

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
      {
        x: 4, y: 10, width: 92, height: 78,
        label: 'Algorithmic ranking makes quieter or smaller social networks less visible, concentrating the redesign cost on already marginal participants.',
        juror: 'accessibility',
        type: 'guilty',
      },
      {
        x: 0, y: 0, width: 100, height: 20,
        label: 'The stated separation of friends and media conflicts with a friends feed organized by the same ranking logic used for media.',
        juror: 'trust',
        type: 'guilty',
      },
      {
        x: 4, y: 12, width: 92, height: 74,
        label: 'The redesign tries to protect intimate sharing from publisher content; the intention survives even though the new structure does not.',
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
    context: 'Mobile operating system, 2013',
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
      {
        x: 2, y: 4, width: 96, height: 86,
        label: 'When labels and actions share the same flat treatment, every tap begins with interpretation instead of recognition.',
        juror: 'usability',
        type: 'guilty',
      },
      {
        x: 2, y: 4, width: 96, height: 90,
        label: 'A system-wide correction within months of release makes the launch feel like an experiment conducted at operating-system scale.',
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
    context: 'Classifieds marketplace, desktop web, 2024',
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
      {
        x: 1, y: 1, width: 98, height: 96,
        label: 'The site offers almost no verification, safety signaling, or dispute path; trust is delegated entirely to individual transactions.',
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
    context: 'Independent fashion retail, desktop, 2023',
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
