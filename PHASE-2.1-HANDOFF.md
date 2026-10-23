# Phase 2.1 — The Investigation Engine

## Delivery and repository

Verdict: PASS for the local Phase 2.1 implementation and tested Chrome environment. This is not cross-browser or public-release acceptance.

- Incoming HEAD: `5ded59cbc51db7197ba5eee7ecd8a70a2787b073`, with the Phase 2.0 implementation uncommitted.
- Phase 2.0 was preserved in local checkpoint `5f0aaf3958347dc2a1562a3b6adefd5c10b936f9` on `codex/phase-2-editorial`.
- Phase 2.1 branch: `codex/phase-2-1-investigation`, based on that checkpoint.
- The scoped implementation commit is the commit containing this document; use `git log -1` for its hash. The final delivery message records the ending SHA.
- Three unrelated untracked images remain untouched: SnapchatImage.png, arcimage.png, ioscalendar.png. Generated evidence remains under output/ and is excluded from source commits.
- Nothing was pushed, published or deployed.

## What works

The index features The Benefits Form, case-006 / Case #003. Its full path is:

`FIRST_LOOK → FIRST_JUDGMENT → CONTEXT → SECOND_LOOK → SECOND_JUDGMENT → REFLECTION → COMPLETE`

First Look starts without a critical lens. A described point or rectangle is enough to continue; classification is optional. First and second judgments each require an explicitly chosen verdict, confidence and written reasoning. There is no hidden default or inferred confidence.

Submitting a judgment seals a deep copy of its evidence and reasoning. Earlier unlocked stages remain available for reference, but sealed marks and judgments cannot be changed. A repeated submission cannot produce a second completion. Reflection accepts changed verdicts, unchanged verdicts with different wording, and unchanged verdicts with matching wording. It makes no claim that changing one's mind is better.

All drafts and stages persist. Reload resumes an unfinished investigation. A confirmed new attempt discards an unfinished draft or preserves a completed attempt in history before starting a new one. Historical attempts can be read without editing them. Global profile reset retains its two-action confirmation and clears only the application's two local storage keys.

## Architecture and stable contracts

### Pure engine

`src/investigation/engine.js` owns stage transitions, valid evidence, judgment snapshots, completion projection, record validation and neutral reflection classification. Events are explicit: GO, FIRST_MARKS, DRAFT, NEXT, SUBMIT_FIRST, REVEAL, EXHIBIT, CAPTURE, SELECT_SNAPSHOT, SECOND_MARKS, SUBMIT_SECOND, REFLECTION_NOTE and COMPLETE. Illegal transitions throw before persistence.

The optional reflection note is the visitor's own explanation. Different reasoning is detected by comparing written text with normalized whitespace, not by claiming semantic or psychological insight.

### Case and exhibit capability

`src/investigation/capabilities.js` opts cases into this flow. Each capability supplies a version, provenance-labeled context items and an exhibit contract: `id`, `create`, `reduce`, `validate`. Only case-006 is enabled. `investigationFor` excludes sealed cases.

`src/components/Investigation/exhibitViews.js` maps exhibit IDs to views accepting controlled `state`, `onAction` and `frozen` props. A future exhibit adds a model, a view and a capability entry; it does not duplicate the investigation engine. No arbitrary site importer or browser emulator is present.

### Versioned persistence

The dedicated key is `design-disaster-investigations-v1`. Its envelope has `schemaVersion: 1`, active `records` keyed by case ID, and completed-attempt `history`. Each record has schema version 1, investigation version 2.1, an attempt ID, revision, stage, furthest unlocked stage, first and second look drafts, two independent sealed judgments, revealed context IDs and observed completion metadata.

`src/investigation/storage.js` parses and validates records before use. Writes read the current saved version again and reject a stale attempt/revision. The React hook responds to browser storage events. Malformed or unsupported data is reported and kept untouched rather than silently replaced.

The existing `design-eye-profile` format remains readable. Completing Second Look projects one case into the existing archive count. Re-completing a new attempt updates only an earlier v2 projection. An existing single-look ruling stays unchanged and has a separate reading route. Legacy records never gain invented context or second judgments. The cross-case report's inference logic remains unchanged.

### Annotation geometry

The Phase 2.0 controlled `EvidenceMap` remains the instrument. Its optional neutral and custom-exhibit inputs extend the original API; existing static-case calls retain their behavior. Point x/y coordinates are centers; rectangle x/y coordinates are top-left, with percentage width and height.

Entering Mark captures the exhibit's controlled state, exhibit ID, exact logical width/height and named region positions. Each second-look mark carries a `frameId`. Captured states are immutable and cannot be replaced under an existing ID. Frozen replay renders at the captured logical width before scaling as a whole; text does not reflow under the marks when the viewport changes.

Explore mounts the working form without an annotation overlay. Mark renders a frozen, inert replay under the keyboard/pointer instrument. Form activation cannot leak through the marking surface. Switching modes preserves form state. Different captured states remain separately selectable.

The original screenshot and reconstruction have materially different geometry. Reflection labels and displays them separately instead of using a misleading divider overlay. Phase 2.0 Reveal remains available for compatible original-image juror comparisons. Entering that comparison from a completed Second Look explicitly uses the first judgment and original-image marks.

## The Benefits Form scenario

The exhibit is a functioning authored reconstruction using only fictional test details: **Alex Sample** and **TEST-1042**. Inputs, select fields, a declaration checkbox, validation summary links and a receipt operate locally. No application or eligibility request is sent anywhere.

The deliberate interruption hides the fields without a real countdown. Recovery accepts the supplied demo reference and restores the fictional draft. The visitor may instead discard it. This is an observable local scenario, not real authentication or a verified historical service behavior.

Context provenance:

- `person`: hypothetical shared-computer task scenario.
- `artifact`: authored reconstruction; claims are limited to visible features of the supplied case image.
- `behavior`: authored simulation; interruption, recovery and completion belong to this demo.

No invented accessibility measurements, population findings or source-service behavior are presented. The existing screenshot and authored juror content remain preserved.

## UX decisions

- Extend the Phase 2.0 dark editorial system: one stage rail, exhibit-first workspace, an open inspector and inline context documents.
- Keep the visitor's first evidence visible as sealed reference, without priming the initial observation with five lens buttons.
- Use explicit Explore/Mark modes, contextual feedback and native keyboard controls. Capture a state before marking rather than letting annotations drift across changing form layouts.
- Require one described observation per look, not an arbitrary quota. Both judgments are intentional; no verdict is preselected on the second pass.
- Preserve confidence verbatim and show both values. Reflection is an authored record, not an analytics dashboard or personality score.

## Executed verification and evidence

Baseline: the original `npm run check` and three geometry tests passed before Phase 2.1 edits.

Final checks:

- `npm run check`: lint, case/asset/encoding/CSS-module validation, 22 unit tests and production build.
- `npm test`: geometry, legal/illegal transitions, required confidence, both sealed judgments, separate evidence, context gates, immutable captured frames, JSON recovery, stale writes, malformed storage, confirmation/history, legacy projection, reflection outcomes, sealed boundaries and deterministic form behavior.
- `node scripts/verify-investigation.mjs`: full flagship journey at 1440×900, 768×1024 and 390×844; changed and unchanged verdicts; keyboard marking; desktop pointer and mobile touch rectangles; coordinate editing and resize alignment; validation links; interruption, recovery and receipt; Explore/Mark isolation; four intermediate reloads; reflection and archive completion. Twenty-four screenshots captured with no horizontal overflow or page errors.
- `node scripts/verify-investigation-contracts.mjs`: actual legacy Benefits Form record preserved through new completion; no duplicate archive count; confirmed restart; historical review; new attempt reload; cross-tab storage updates; malformed new storage retained without damaging the legacy profile.
- `node scripts/verify-journeys.mjs`: all ten cases, now including the full flagship engine, movement unlocks, panel/intermission, sealed privacy, final report, two-action global reset, five-minute path, legacy points and Phase 2.0 Split/Reveal behavior.
- `node scripts/verify-phase2.mjs`: original cover, cold open, index, banking workbench, comparison and report at all three viewport sizes; submission and persistence regression checks.
- New-surface Impeccable detector: no findings. `git diff --check`: no whitespace errors.

Screenshots and JSON results are in `output/phase-2.1/`; original-surface regression screenshots/results are in `output/playwright/`. Open `output/phase-2.1/index.html` for the evidence gallery. The browser scripts launch installed Windows Chrome and their own loopback Vite servers.

The rendered screens were inspected at all three sizes. Refinements reduced Mark-mode enlargement, associated reflection observations with the selected captured state, and improved validation focus recovery.

## Dependency review

The current full audit still reports seven affected development-tool packages: six high, one moderate. The production-only audit reports zero affected dependencies.

| Package | Severity | Relevance here |
| --- | --- | --- |
| baseline-browser-mapping | Moderate | Build-time input handling / process termination |
| brace-expansion | High | Tooling expansion / resource exhaustion |
| browserslist | High | Build-time queries and untrusted custom statistics |
| nanoid | High | Tooling generator edge cases |
| postcss | High | CSS processing / source-map path handling |
| source-map-js | High | Build-time source-map resource exhaustion |
| vite | High | Development-server/editor middleware, including Windows concerns |

All are dev dependencies, not React runtime dependencies in the static production bundle. That does not make an exposed dev server safe. Acceptance servers bind loopback. No forced audit fix or bundler upgrade was applied; remediation remains a separate tooling update with build and browser revalidation. No new dependency was introduced.

## Known limitations and Phase 2.2 handoff

- One authored functional case only. No verified source implementation, independent usability study or real government-service outcome is claimed.
- Chrome acceptance includes emulated touch and reduced motion. Firefox, Safari, physical devices and independent screen-reader testing remain open release gates.
- Frozen states preserve layout and values, not active focus rings or an embedded browser session. Old point annotations remain supported. Editing rectangles uses coordinate/size fields; direct drag-handle resizing is not implemented.
- Data stays in browser-local storage; clearing browser data removes it. Unreadable new-schema data is retained and blocks destructive overwrite; there is no automatic repair or migration from unknown future schema versions.
- Existing external font delivery remains unchanged. No full performance benchmark or accessibility certification is claimed.
- Keep case IDs, schema keys, immutable judgment snapshots, frame-bound geometry, provenance labels, neutral outcomes and sealed-case exclusion stable.
- The five-case interactive collection, full juror overhaul, contradiction engine, cross-case Design Eye analysis and report export remain Phase 2.2 work. Independent research, final cross-browser release acceptance, portfolio production and deployment remain Phase 2.3.
