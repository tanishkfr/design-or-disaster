// Case #001 — Placeholder case for Phase 1 development.
// Screenshot is a temporary stand-in. Final content sourced in Phase 7.

export const CASES = [
  {
    id: 'case-001',
    number: 'CASE #001',
    title: 'Mobile Banking Dashboard',
    context: 'Personal finance app, iOS, 2022',
    category: 'Visual Hierarchy',

    screenshot: '/screenshots/case-001-placeholder.svg',

    officialVerdict: 'needs_revision',  // "strong_design" | "needs_revision" | "design_disaster"
    caseStatus: 'consensus',            // "consensus" | "contested" | "landmark"
    contestedSummary: null,

    jurorRulings: [
      {
        juror: 'hierarchy',
        ruling: 'guilty',
        reasoning:
          'The account balance competes with three equally-weighted action buttons, leaving the eye with no clear entry point.',
      },
      {
        juror: 'accessibility',
        ruling: 'mixed',
        reasoning:
          'Body text passes WCAG AA, but the secondary action labels fall below the 4.5:1 ratio required at this size.',
      },
      {
        juror: 'usability',
        ruling: 'guilty',
        reasoning:
          'The primary action — Send Money — is buried in the fourth position of a flat navigation row with no visual distinction.',
      },
      {
        juror: 'trust',
        ruling: 'not_guilty',
        reasoning:
          'The interface correctly surfaces the account balance immediately and uses familiar banking conventions throughout.',
      },
      {
        juror: 'delight',
        ruling: 'not_guilty',
        reasoning:
          'The restrained palette and tight spacing signal professionalism — appropriate for a product that holds people\'s money.',
      },
    ],

    // Annotation coordinates as percentages of image dimensions (0–100).
    // These are approximate placeholders — final values set after real screenshot is locked.
    annotations: [
      {
        x: 10,
        y: 15,
        width: 80,
        height: 20,
        label: 'Balance competes with actions',
        juror: 'hierarchy',
        type: 'guilty',
      },
      {
        x: 10,
        y: 70,
        width: 80,
        height: 10,
        label: 'Secondary labels below contrast threshold',
        juror: 'accessibility',
        type: 'mixed',
      },
      {
        x: 55,
        y: 80,
        width: 25,
        height: 12,
        label: 'Primary action buried — fourth position',
        juror: 'usability',
        type: 'guilty',
      },
    ],
  },
];

export const getCaseById = (id) => CASES.find((c) => c.id === id) ?? null;
