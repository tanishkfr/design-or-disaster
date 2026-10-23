# Phase 2.2 — The Complete Experience

## 1. Verdict

**PASS for the implemented local Phase 2.2 scope and observed Windows Chrome environment.** All five curated investigations complete end to end at 1440 × 900, 768 × 1024 and 390 × 844. The original ten-case archive and compatible short route remain operable. Actual PNG and PDF exports were generated, opened, rendered and inspected.

This is not public-release, cross-browser, independent usability or assistive-technology acceptance. Those remain Phase 2.3 gates.

## 2. Repository state

- Workspace: `C:\Dev\Portfolio\Design or Disaster`.
- Branch: `codex/phase-2-2-complete`.
- Starting SHA: `ad18540eeec2edb4eff963c4ea9658ccde932aa3` (Phase 2.1).
- Main implementation: `d89efbd231f1a6313961d88dae7f38bec5cf91a1` — Complete five-case Second Look collection, perspectives and exports.
- Acceptance fixes / ending implementation SHA: `c3f12ecff7d0fe3d01a59ed8e18e0be83e3ec9b4` — Keep legacy archive status accurate and capture settled exhibit geometry.
- This handoff is saved in a separate local documentation commit. Its containing commit is the final repository HEAD; the delivery message records that final SHA. This avoids a self-referential commit hash in the file.
- Tracked implementation changes are committed. Three pre-existing untracked images remain untouched: `SnapchatImage.png`, `arcimage.png`, `ioscalendar.png`.
- Generated QA artifacts remain untracked under `output/`; they are not source assets or participant data.
- No dependency was added. Nothing was pushed, published or deployed.

## 3. Architecture and integration

`src/investigation/capabilities.js` declares the five curated IDs and each exhibit's identity, case association, supported interactions, relevant states, Explore/Mark modes, context dependencies, annotation compatibility, reset/recovery behavior and accessibility alternatives. Four small controlled simulation models live in `exhibitModels.js`; the established Benefits model is retained. Composable views are registered in `components/Investigation/exhibitViews.js`.

The shared engine keeps the existing sequence:

`FIRST_LOOK → FIRST_JUDGMENT → CONTEXT → SECOND_LOOK → SECOND_JUDGMENT → REFLECTION → COMPLETE`

Both judgments require explicit confidence, a verdict, a reason and described evidence. A sealed judgment owns a deep copy of its marks and reasoning. Four exhibits add controlled first-look state and snapshots; Benefits preserves its original supplied-image opening. The second examination starts from the first exhibit's current state without sharing mutable judgment data. Context must be explicitly opened. No transition rewards a changed verdict.

Persistence keeps schema version 1 and `design-disaster-investigations-v1`. Benefits retains investigation version `2.1`, so its existing records hydrate unchanged; the other four configurations use `2.2`. Original `design-eye-profile` rulings remain separate and readable. Completion projection preserves the prior unique-case compatibility behavior and never manufactures a second judgment. Archive copy distinguishes a Second Look completion from an actual single-look ruling.

Mark waits for font readiness, captures logical width/height, current exhibit state and named regions, then freezes the state. Points and rectangles carry frame IDs. Replaying scales the entire logical layout rather than allowing text to reflow beneath annotations. Container-relative CSS scaling also responds synchronously to print layout; ResizeObserver remains the screen fallback. A captured ID cannot be overwritten with different geometry. Requests that arrive after a mode or stage change are cancelled.

Hash routes preserve case/view selection, reload and browser back/forward. The compatible short route retains an explicit `path=short` marker on reload; its automatic intro is replaced in history when the report opens. Missing saved verdict links fall back safely.

## 4. Five-case review

| Case | Working behavior | Distinct question / context |
| --- | --- | --- |
| 001 — Mobile Banking Dashboard | Overview, transaction search, refund detail, validated fictional £12.40 transfer to Alex Demo, receipt and return navigation | A reassuring balance and equally weighted actions may coexist with a task whose real priority is finding a refund. Context supplies that task without prescribing a verdict. |
| 006 — The Benefits Form | Supplied-image first look; second-look form validation, fictional fields, interrupted shared session, reference recovery, draft discard and receipt | Privacy and recovery can pull in different directions. Context explicitly separates the supplied image, authored scenario and working simulation. Uses Alex Sample / TEST-1042, never real applicant data. |
| 010 — The Animated Portfolio | Native scrolling, finite optional arrow motion, motion control, three projects, designer-role information, contact route and return to work | Expression can demonstrate capability and still compete with a reviewer's information needs. Reduced-motion preferences remove animation. Mark uses a disclosed settled pose, not a saved animation phase. |
| 012 — Bulletin | Category and text filters, maximum price, listing details, retained filters, unique local shortlist | Dense, predictable text can support retrieval while leaving readability and trust unresolved. A community collection label is explicitly not identity verification. |
| 015 — Brutalist Fashion Store | Three fictional garments, product information, size validation, local bag, removal and return to collection; product detail stacks on narrow exhibit widths | Brand intent is a constraint, not proof of success. The visitor decides whether product information earns confidence. No checkout or payment exists. |

All five first/second judgments, evidence and optional reflections remain revisitable. The sealed finale has no juror positions, curated contradictions, panel vote, score, hidden verdict or post-submission authority reveal.

## 5. Perspectives and contradictions

The Scanner, Advocate, Operator, Skeptic and Romantic remain authored viewpoints. `perspectives.js` contains five positions for each non-sealed curated case and hand-authored contradictions naming a shared element, involved perspectives, competing interpretations and unresolved uncertainty.

The comparison selects one captured state at a time. Visitor marks and authored regions use that same geometry, with an adjustable Reveal divider and keyboard/touch controls. Switching perspective preserves the selected state and divider. A position whose region is absent explicitly says so; it does not invent a rectangle.

Benefits also exposes its supplied first-look image as a separately labeled state, using the original image's annotation geometry. It is never aligned with the working form. This allows spatial comparison even when the visitor marked only a receipt in the reconstruction.

Curated disagreements cover the banking action row, Benefits error summary and interruption notice, expressive portfolio surface, and dense classifieds results. Selecting one highlights its supporting regions. Overlapping readings can intentionally share a region; the adjacent text carries the individual arguments. These are not automatically generated conflicts or empirical panel findings.

## 6. Design Eye calculations and content rules

`report.js` derives its content from current saved attempts:

- Complete count: records whose stage is COMPLETE.
- Judgment-pair count: cases with both submitted judgments, including a pair awaiting completion of reflection.
- Verdict changes: unequal submitted verdict labels.
- Same verdict / different words: equal verdicts with different reasons after trimming and collapsing whitespace. This is a text comparison, not semantic analysis or a claim of learning.
- Same verdict and words: matching verdict and normalized reason, regardless of confidence changes.
- Confidence: counts of ordinal increases, decreases and equal explicit values. No speed, actions or marks infer confidence.
- Lens counts: only explicitly classified current first/second marks. Unclassified evidence remains separate. Equal maxima remain tied; an all-zero record has no leading lens.
- Legacy submissions: retained separately and excluded from all before/after counts.

Each case includes its actual reasons, all marked states and notes, opened context and optional reflection. Unstarted and unfinished cases say what is missing. Empty, partial, legacy-only, tied and full records are covered. Earlier completed attempts remain readable inside each investigation and are excluded from current-attempt counts. No expertise, psychometric or population inference is made.

## 7. Actual export verification

- `output/phase-2.2/design-eye-summary.png`: actual Chrome download, **1600 × 4036**, opened and visually inspected. Dark/paper/signal typography, descriptive counts, paired reasons and explicitly labeled first-note excerpts. Dynamic wrapping includes long uninterrupted words; no reason is silently truncated. The excerpt selection and full-document alternative are disclosed.
- `output/phase-2.2/design-eye-full.pdf`: actual browser print output, **14 A4 pages**, rendered with PDFium and inspected as page images. White paper presentation retains the original exhibit colors and complete captured layouts. Second looks begin on deliberate pages; larger context sections can continue on their own page.
- `output/phase-2.2/pdf-contact-sheet.png`: all rendered PDF pages.
- `output/phase-2.2/export-results.json`: text extraction confirmed **every saved note and both submitted reasons for all five cases**. No authored juror name appears in the exported personal record.
- `output/phase-2.2/pdf-fonts.json`: PDF text font resources contain embedded fonts or Type3 glyph programs. No missing-font boxes were observed in the rendered document.
- `output/phase-2.2/print-dom-check.json`: print capture content widths match their displayed containers; no horizontal clipping from stale screen scale.

The restricted process sandbox cancelled even a four-byte browser download. Repeating the minimal check outside it succeeded. The real export suite was therefore run outside that restriction; the product needed no paid service or alternate export backend. The PNG and PDF sample records are deterministic QA fixtures, not outside-participant results.

## 8. UX and visual decisions

The host retains the locked dark editorial identity, open numbered rows, sharp rules, Archivo, selective Instrument Serif, IBM Plex Mono and signal red. The exhibits have independent visual languages rather than repeating a generic form or card template.

Benefits alone keeps screenshot-first pacing. The others invite actual interaction immediately. Classification stays optional, evidence descriptions stay concise, context is an explicit reveal, and unchanged decisions are equally valid. The signature sequence remains Split → Instrument → Reveal, now extended into two independent readings and a personal document.

Original archive and short-path controls remain available. The primary collection directly opens/resumes its own records. Legacy archive counters and buttons now describe genuine single-look rulings rather than mislabeling a projected Second Look completion as one.

A separate implementation review pass found and corrected CSS leakage into frozen exhibits, stale print scaling, a missing static-image comparison state, ambiguous legacy completion labels and font/capture timing. This was an agent review within the implementation session, not independent participant research or an outside designer's critique.

## 9. Verification commands and observed results

| Command | Observed result |
| --- | --- |
| `npm run check` | PASS: lint, case/asset/encoding/CSS-module validation, **33 deterministic unit tests**, production build. Baseline before implementation was 22 tests. |
| `node scripts/verify-collection.mjs` | PASS: all **15 complete journeys** (five cases × three target viewports); task behavior, judgments, context, reloads, reflections, perspective controls, contradictions, sealed isolation, completed revisits, report and browser history. **63 screenshot/overflow checks**, zero runtime errors. Actual PNG download and PDF output. |
| `node scripts/verify-collection-contracts.mjs` | PASS: actual authored rectangle coordinates; touch perspective selection preserves Reveal; sealed deep-link isolation; legacy/v2 archive distinction; v2 touch point and rectangle; explicit classification; frozen-action isolation; actual resize geometry; reload; interactive cross-tab update; partial and legacy-only report; missing-verdict fallback. |
| `node scripts/verify-exports.mjs` | PASS: reloads the saved real-browser fixture, renders print output and records matching snapshot/container dimensions. |
| `node scripts/verify-investigation.mjs` | PASS at all three viewports: original Benefits journey, four reload stages, independent judgments, validation, interruption/recovery, Explore/Mark isolation, coordinates and completion projection. |
| `node scripts/verify-investigation-contracts.mjs` | PASS: unchanged existing legacy ruling, no duplicate count, confirmed restart, preserved history, read-only historical review, independent draft reload, cross-tab update and retained corrupted storage. |
| `node scripts/verify-journeys.mjs` | PASS: all ten original cases, unlocks, meet-panel, intermission, sealed privacy, original final report, two-action reset, short path including reload, touch geometry, legacy point-only record and normal-motion Split/Reveal. |
| `node scripts/verify-phase2.mjs` | PASS at all three viewports: cover, cold open, original archive, keyboard point, reverse rectangle, coordinate editing, explicit judgment/confidence, Reveal and persisted record reopening. |
| `git diff --check` | PASS. |

Unit coverage includes all five configurations, independent judgments, context gates, immutable frames, valid and corrupted hydration, stale revisions, idempotence, history, task behavior, curated contradiction associations, sealed absence, report ties/missing data and export line wrapping.

Browser scripts start and stop their own loopback Vite servers and use installed Windows Chrome. They exercise source through the development server; the production bundle is separately built. Mobile input is emulated. Reduced motion is tested on tablet/mobile and normal motion on desktop. Physical touch, Firefox, Safari and an independent screen reader were not tested.

Final verified build: JS approximately **390.70 kB / 119.44 kB gzip**, CSS **111.98 kB / 20.25 kB gzip**. No performance score is claimed. Impeccable's detector reported one advisory font match for the explicitly locked Instrument Serif family; it was retained in accordance with DESIGN.md. The detector result is an aid, not visual acceptance by itself.

## 10. Visual evidence

Open `output/phase-2.2/index.html` for the local artifact gallery. It links to the exports, JSON results and screenshots.

Main naming pattern: `{desktop|tablet|mobile}-case-{001|006|010|012|015}-{first|task|reflection|perspectives}.png` (no perspective image for the sealed case). Collection and report screenshots are included for every viewport. Supplementary images cover all layers, touch/resize, partial report, legacy-only report and legacy archive status with v2 records.

Earlier regression evidence remains in `output/phase-2.1/` and `output/playwright/`. Source commits intentionally exclude generated output and the three unrelated image files.

## 11. Content audit and remaining limitations

Unsupported contrast ratios and conformance assertions, invented Benefits completion times and team history, universal marketplace step-count claims, traffic rankings, and unsupported literature/manufacturer outcome statements were removed or qualified. Banking and the news case no longer claim panel consensus despite their mixed authored readings. Current curated contexts identify their authored provenance and simulation boundaries. The sealed case returns interpretation to the visitor.

The original archive remains a critical, authored narrative collection; it has not become a sourced historical dataset. Remaining legacy product-history and behavioral interpretations should be independently source-checked before being quoted as historical evidence in the portfolio case study. The original screenshot assets are retained; text inside a reconstruction image is exhibit content, not a newly verified metric. No participant findings or real service behavior were established here.

Portfolio captures preserve layout/state but use a settled motion pose, not an animation timestamp. An authored region can be unavailable in a chosen captured state; the interface names that limitation. A historic attempt's perspective can be reviewed during the session, while reloading the case URL selects the current attempt. Local storage is browser-specific and can be erased by browser controls; no cloud synchronization is claimed. Fonts retain the project's existing external Google Fonts loading and system fallbacks.

No unresolved failure was observed in the tested local Chrome acceptance scope. Formal visual critique, performance acceptance, broader print/browser variations and independent assistive-technology checks remain unverified rather than silently marked PASS.

## 12. Phase 2.3 handoff

1. Run outside-participant usability sessions across the complete collection. Observe how visitors distinguish evidence, contextual constraints and an authored reading. Do not recast deterministic QA fixtures as research data.
2. Obtain an independent visual-design critique, including the density and length of the report, overlapping perspective regions, annotation tools and mobile exhibit task flow.
3. Test Firefox, Safari, physical touch devices, keyboard-only navigation and screen-reader workflows. Check image descriptions, named regions, focus after stage/state changes, inactive snapshots and print output.
4. Measure production performance and asset/font behavior before optimizing. Preserve captured-layout compatibility when changing exhibit typography or spacing.
5. Refine motion and transitions after those findings; retain reduced-motion behavior and native scrolling.
6. Complete a traceable legacy-content/source audit and verify screenshot provenance and rights before public portfolio claims.
7. Write the portfolio case study using only observed implementation and actual participant evidence. Preserve uncertainty and distinguish authored scenarios from research findings.
8. Run final production-preview and public-access acceptance. Public publishing, pushing and deployment remain separate future actions; none was performed in Phase 2.2.
