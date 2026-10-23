# Design or Disaster?

Design criticism as incompatible perception.

Design or Disaster? is a research-through-design web experience in which the visitor files a spatial evidence map before seeing how five fallible jurors read the same interface. It is not a quiz and it does not grade the visitor against an expert consensus.

Each map belongs to its own captured image or exhibit state. Resizing preserves that layout; evidence from different states is never silently aligned. The final sealed case shows no outside perspective.

## Experience paths

- **Second Look collection (primary):** Banking, Benefits, Animated Portfolio, Bulletin, and the sealed Fashion Store. Make two independent judgments around an explicit context reveal, then inspect your record.
- **Original ten-case archive:** retained under the expandable archive, with its original movement progression and single-look rulings.
- **Five-minute path:** the original Portfolio → sealed Fashion sequence remains available and opens its legacy report. It never manufactures Second Look data.
- **Returning visitors:** local records, stage, current exhibit state, completed attempts and browser history support resuming and revisiting work.

## Second Look — Phase 2.2

Four exhibits work from the first look; Benefits retains its authored-reconstruction opening and functional second look. Banking supports transaction search and a fictional transfer; Portfolio has project, role, contact and motion controls; Bulletin has filters, listing details and a shortlist; Fashion has products, sizes and a local bag. All are clearly labeled authored simulations. No money, application, message or purchase is sent.

Explore operates the exhibit. Mark freezes the captured layout for described points and rectangles. Classifying evidence is optional. Each first/second judgment requires an explicit verdict, confidence and written reason. Keeping a judgment is equally valid. Context is disclosed before the second look and never supplies a correct answer.

Completed non-sealed records offer five spatial authored perspectives and curated contradictions. The report counts current saved judgment pairs and explicitly classified marks, preserves ties and missing data, and keeps legacy submissions separate. Save a client-generated PNG summary or use Print / Save as PDF for the full document with every marked state and opened context.

The Benefits demo uses **Alex Sample** and **TEST-1042**, never real eligibility details. Persistence remains on the Phase 2.1 schema and storage key; existing Benefits records and legacy rulings remain readable. A new attempt preserves completed history.

See [PHASE-2.2-HANDOFF.md](PHASE-2.2-HANDOFF.md) for contracts, test evidence, content qualifications and Phase 2.3 gates. Earlier handoffs remain historical checkpoints.

## Interaction

Explore -> capture and mark -> first judgment -> context -> second look and judgment -> reflection -> authored perspectives / Design Eye.

Evidence can be marked with a pointer, keyboard cursor, or named interface-region controls. Motion can be skipped, and reduced-motion preferences shorten the only timed interstitial.

## Run locally

~~~sh
npm install
npm run dev
~~~

## Verify

~~~sh
npm run check
~~~

The check command runs linting, project-specific content and asset validation, focused unit tests, and a production build.

Browser acceptance (installed Windows Chrome):

~~~sh
node scripts/verify-collection.mjs
node scripts/verify-collection-contracts.mjs
node scripts/verify-exports.mjs
node scripts/verify-investigation.mjs
node scripts/verify-investigation-contracts.mjs
node scripts/verify-journeys.mjs
node scripts/verify-phase2.mjs
~~~

Each browser script starts its own loopback Vite server. Evidence is written to output/phase-2.2/, output/phase-2.1/ and output/playwright/. The export check reads the complete fixture saved by verify-collection.mjs. Installed Chrome downloads require running outside the restricted process sandbox in this environment; otherwise even a four-byte download is cancelled. No remote deployment is involved.

See CASESTUDY.md for the design argument and SPEC.md for the current product contract.

## Phase 2.3 local review

The independent agent-led critique corrected cover annotation registration, route-preserving focus links, mobile evidence writing, touch scrolling, perspective label overlap, misleading legacy claims, malformed legacy storage and clipped print captures. The dark editorial identity, five investigations, ten-case archive and saved schemas remain intact.

See [PHASE-2.3-AUDIT.md](PHASE-2.3-AUDIT.md), [PHASE-2.3-HANDOFF.md](PHASE-2.3-HANDOFF.md), and the local [evidence gallery](output/phase-2.3/index.html). Generated evidence stays untracked. No Phase 2.3 work has been pushed or deployed.

The collection script accepts `VERIFY_BROWSER=chrome`, `edge`, or `firefox`, `VERIFY_PREVIEW=1`, and `VERIFY_OUT` for separate evidence directories. Build before preview acceptance. Firefox uses the locally available Playwright Nightly executable; set `FIREFOX_PATH` on another machine. These environment variables use your shell's normal assignment syntax.

Additional Phase 2.3 verification:

~~~sh
node scripts/verify-refinements.mjs
node scripts/measure-phase23.mjs
node scripts/review-phase23.mjs after
python scripts/inspect-phase23.py
node scripts/build-phase23-gallery.mjs
~~~

The refinement and export-review scripts read the real-browser fixture in `output/phase-2.3/chrome/complete-store.json`; run collection acceptance into that directory first. PDF inspection uses Pillow, pypdf and pypdfium2, available in the bundled Codex Python runtime on this machine. Full external validation remains open: real screen readers, physical devices, Safari, stable Firefox, independent participants and source-image provenance/public-use review.

## Historical release-candidate closure (23 October 2026)

See [RELEASE-CANDIDATE-REPORT.md](RELEASE-CANDIDATE-REPORT.md), [IMAGE-PROVENANCE.md](IMAGE-PROVENANCE.md) and [REMAINING-VALIDATION.md](REMAINING-VALIDATION.md) for historical publication limits and external session procedures. Current final-review and PR status is in [FINAL-REVIEW-HANDOFF.md](FINAL-REVIEW-HANDOFF.md).

Reset confirmation no longer expires while being read; Cancel preserves the record and restores focus. About documents reconstructed versus unresolved imagery, shared-browser privacy and font requests. No data schema, exhibit geometry or feature scope changed.

`node scripts/verify-release.mjs` reruns the existing browser suites into separate release folders; set `VERIFY_ROOT` to a fresh path for another run. Existing script defaults remain compatible; `VERIFY_OUT` selects a fresh output folder. `VERIFY_FIXTURE` selects the completed browser store for refinement/accessibility checks. The supplemental axe review expects `axe-core` in `output/release-candidate/tools/node_modules` (install there using `npm install --prefix output/release-candidate/tools --no-save --ignore-scripts axe-core`); this is a QA tool, not an application dependency. `node scripts/verify-release-reset.mjs` checks delayed confirmation, cancellation and keyboard erasure with synthetic records.

Run PDF inspection with `VERIFY_ROOT` set to the final evidence root, using the bundled Python with Pillow, pypdf and pypdfium2: `python scripts/inspect-phase23.py`. Build the portable gallery/ZIP with `python scripts/package-release.py` after the final reports and screenshots exist. Open `output/release-candidate/review-package/index.html`, or extract `output/design-or-disaster-v2-review.zip` and open its `index.html`. The package builder verifies extraction, relative resources, image decoding, PDF text and file hashes.

Generated evidence is untracked and preserved separately. No push, deployment or public release is part of this closure.

## Final review and public draft PR

The catalogue preview now remains selected when scrolling moves a different row beneath a stationary pointer. A decoded, case-keyed image and post-capture assertions protect the case/image/question relationship. Mobile Return to exhibit targets the selected mark; pointer note focus follows the native click. Compact stages expose both open and close affordances.

Three uncleared source captures were replaced by original fictional HTML/CSS reconstructions. Their sources are in `public/reconstructions/`; affected legacy cases explain that older notes may describe the former image. Saved coordinates and judgments are not rewritten. See [IMAGE-PROVENANCE.md](IMAGE-PROVENANCE.md) for the existing-public-history distinction and remaining branding limits.

The public-review branch is a clean snapshot from verified remote main; it imports no intermediate v2 history. Vercel automatic Git deployment is disabled for `codex/design-or-disaster-v2-pr` in `vercel.json`; a draft PR does not authorize website deployment. Raw evidence, local captures, browser profiles and review ZIPs remain excluded.

Run `scripts/verify-final-fixes.mjs` with `ASSERT_SYNC=1` against a production build for the preview regression. `VERIFY_BROWSER` selects chrome, edge or firefox, and `VERIFY_OUT` selects a fresh evidence folder. `scripts/verify-mobile-final.mjs` verifies five compact/tablet widths with touch emulation; it does not represent a physical-device or software-keyboard test. Existing full regression and external validation boundaries remain.
