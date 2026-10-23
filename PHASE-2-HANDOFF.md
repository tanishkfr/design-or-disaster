# Phase 2.0 delivery

Verdict: PASS for implemented Phase 2.0 and the tested Chromium environment. No production deployment or cross-browser acceptance is claimed.

## Repository state

- Branch: `codex/phase-2-editorial`.
- Starting and ending HEAD: `5ded59cbc51db7197ba5eee7ecd8a70a2787b073`.
- Implementation is uncommitted. The original working tree already contained three untracked images: SnapchatImage.png, arcimage.png and ioscalendar.png. They were preserved untouched.
- Source, design documentation, validation scripts and screenshot evidence are present locally. Nothing was pushed, published or deployed.

## Design and screens

The cover uses large Archivo typography, a D/D slash and a real annotated banking exhibit. The selected dark palette replaces the old purple-black and amber interface accents with neutral dark surfaces and signal red. Lens and verdict colors retain their semantic roles.

The case index uses numbered editorial rows, movement labels, saved-state labels, a selected exhibit preview on desktop/tablet, and direct case entry on mobile. Progression remains intact; pending cases do not reveal their verdict.

The workbench prioritizes the exhibit, groups instruments and lenses above it, and places the ruling inspector beside it on wider screens. Compact screens use an observe-then-rule sequence with a direct inspector jump. The cold open uses the same instrument system.

Comparison uses restrained perspective tabs and open editorial reasoning entries. The report uses an authored document composition. Saved investigations reopen their existing comparison rather than asking visitors to submit again. Report reset requires a second action.

## Interaction prototypes

- **Split:** mouse movement reveals an annotation layer over actual case imagery. A native range input provides touch and keyboard control. It never handles page scrolling.
- **Instrument:** point placement, drag rectangles in either direction, immediate numbered feedback, observation editing, coordinate/size editing and removal. Pointer capture supports dragging; named-region controls and arrow-key/Enter placement provide alternatives. The precision cursor exists only over the exhibit. Regions are editable through percentage fields; direct handle resizing is not implemented.
- **Reveal:** select an authored perspective, activate comparison, and drag the image divider or use the range control. Visitor marks occupy one side and selected authored evidence the other. Both layers share the same image bounds. Sealed cases have no outside layer. Perspective tabs support arrow/Home/End navigation.

These are functioning prototypes on static exhibits. They are not functional source interfaces or a Second Look engine.

## Executed verification

Baseline `npm ci` failed because the supplied lockfile was inconsistent. `npm install` reconciled it, after which the baseline lint, content validation and build passed.

Final verification:

- `npm run check`: lint, ten-case/five-perspective invariants, asset checks, encoding, CSS-module references and production build passed.
- `node --test scripts/evidenceGeometry.test.mjs`: three geometry tests passed: reverse drag, legacy point preservation and bounded edits.
- `node scripts/verify-phase2.mjs`: Chromium journeys at 1440×900, 768×1024 and 390×844 passed. Each captures cover, cold open, index, workbench, marked instrument, comparison and report. No horizontal overflow or page errors were observed. Submission, confidence, keyboard controls, reload persistence and saved-record reopening passed.
- `node scripts/verify-journeys.mjs`: primary cold-open journey, all ten cases, movement unlocks, meet-panel, intermission, sealed privacy, final report, two-action reset and five-minute path passed. Emulated touch point/rectangle input, resize preservation, mark removal and a legacy point-only profile passed. Normal-motion Split pointer response, reveal-all, juror arrow navigation and direct comparison-divider dragging passed.
- Rendered screenshots were visually inspected and revised for clipped cover copy, comparison spacing, juror presentation and submission visibility.
- Impeccable detector found a padding-transition warning; the transition was removed.
- `git diff --check`: no whitespace errors.

Screenshots and machine-readable results: `output/playwright/`. The browser scripts launch installed Windows Chrome and start/stop their own Vite server. They currently use the machine's Chrome executable path.

## Limits and remaining issues

- Browser acceptance covers installed Chromium/Chrome; Firefox, Safari, physical touch devices and assistive-technology testing were not performed.
- Existing dependency audit reports seven advisories: six high and one moderate, involving Vite and tooling/transitive packages. They were not silently upgraded during this UI phase.
- Google Fonts remains the existing external typography delivery path. System fallbacks remain available offline.
- Case drafts remain component-local; the existing persistence contract stores submitted rulings and the in-progress case identifier. Reload does not restore an unfinished draft.
- No production accessibility certification, performance benchmark, deployment or independent user research is claimed.

## Phase 2.1 contracts

1. Preserve stable case IDs, authored content, movement progression and sealed-case privacy. Do not reinterpret authored annotations as live expert data.
2. Keep `design-eye-profile`, existing submission fields, legacy `evidencePlate` reading and point-only `evidenceMap` records readable.
3. Evidence coordinates are percentages of the exact displayed screenshot. Legacy points use x/y as center; optional width/height make x/y the rectangle's top-left. Comparison must use the identical aspect ratio and object position.
4. Keep `EvidenceMap` controlled through `marks` / `onChange`. Submission requires at least one described mark, a written ruling and the existing verdict/confidence requirements. Confidence remains self-reported.
5. Keep report ties explicit. Phase 2.0 only adjusts presentation and singular/plural copy; report inference remains unchanged.
6. Build future Explore/Mark and Second Look logic around these data contracts. Do not imply the current static exhibit is interactive source UI.
7. Context reveal, judgment revision history, contradiction logic, report analytics/export and the production five-case v2 collection remain deferred.
