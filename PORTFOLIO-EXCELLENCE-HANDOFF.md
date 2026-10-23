> Historical checkpoint. The final review corrects preview capture/selection behavior and replaces three supplied images. Current status and public-PR boundaries are in [FINAL-REVIEW-HANDOFF.md](FINAL-REVIEW-HANDOFF.md). The results below describe the earlier checkpoint.

# Portfolio excellence handoff

23 October 2026 · Local review · **Implementation: PASS in the tested scope** · **Release: CONDITIONALLY READY**

The requested catalogue, workbench, mobile workflow, compact sharing edition and visual case-study presentation are implemented. Available regression, keyboard, browser, rule-based accessibility and export checks pass. No independent score or claim of perfection is made. Public publication still requires image decisions and external validation.

## Repository and checkpoints

- Starting branch: `codex/release-candidate-closure`.
- Starting SHA: `f96e8843efd7cdb0ca4a6f49d3cd81efc6cd3e13`, exactly the requested baseline.
- Dedicated branch: `codex/v2-portfolio-excellence`.
- Tested implementation checkpoint: `d9cbfaa160c73063ffb389e58160765f20ee0d61` — `Refine catalogue, evidence workbench and portable records`.
- A subsequent documentation/presentation/package commit contains no application change. The final delivery message and package manifest record its exact SHA; a document cannot contain its own commit hash.
- All changes are local. No push, deploy, publish, merge, reset or history rewrite. Main portfolio files were not touched.
- Scoped tracked work is committed. Pre-existing untracked `SnapchatImage.png`, `arcimage.png`, `ioscalendar.png` and generated `output/` remain preserved and untracked. No historical image or visitor record was rewritten.

## Independently confirmed weaknesses and changes

The primary index gave five distinct exhibits nearly identical text rows; its selected-image preview existed only inside the legacy archive. The new asymmetric catalogue pairs numbered entries with an actual exhibit capture, investigative question, concise mechanics, current record status and entry action. Desktop hover/focus selects the preview immediately. Mobile exposes a Preview control alongside direct entry, expanding one case at a time. The collapsed 390px index is 1745px versus 1847px before, with no requirement to pass five large images.

The workbench placed notes under the exhibit and progression in a separate inspector. The existing editor now renders into that inspector, retaining the original state events, mark IDs, captured frames and percentage coordinates. A selected point or region focuses its numbered observation; its highlight follows note focus. The inspector states the current look and Explore/live or Mark/frozen. It remains beside the large exhibit, with a bounded desktop scroll area; it never covers evidence. Deletion recovery, named regions, numeric geometry and keyboard placement remain.

Mobile reduces repeated guidance through explicit disclosures. The six-stage rail becomes a compact current-stage summary with All stages available. Secondary placement instructions and look guidance unfold when requested. A single captured state no longer repeats a frame selector. Point retains vertical scrolling; Region reserves dragging. On judgment screens, the form precedes optional saved-evidence review. Desktop retains side-by-side evidence. Stage and evidence disclosures respond to viewport changes.

Matched synthetic Banking states demonstrate:

| Measure | Before → after |
| --- | --- |
| Desktop marked page | 2119 → 1727px |
| Tablet note bottom → next judgment | 481 → 179px |
| 390px marked page | 2823 → 2305px |
| 390px note → next judgment | 608 → 251px |
| 320px note → next judgment | 633 → 251px |
| 390px judgment page | 2573 → 1394px |
| 320px judgment page | 2637 → 1442px |

These are layout measurements, not task-time or participant-success improvements. The strongest existing cover, contradiction composition, Design Eye opening and conceptual model remain intact.

## Pointer and motion

Tapping/clicking an existing mark selects it rather than adding a duplicate. A point has a 22-screen-pixel selection radius; a tap within an existing rectangle selects it. Deliberate drags still create regions; keyboard/named placement remains available for additional overlapping evidence. Selection moves focus to the editable note. On desktop focus avoids moving the page; compact screens scroll the input into view. A Return to exhibit action restores the spatial context.

No pointer smoothing, delayed placement, decorative transition or ambient loop was added. Catalogue preview changes are immediate. Existing finite navigation, context and signature range behavior remain; existing global reduced-motion handling is retained. Normal-motion Split, Reveal, juror navigation and reduced-motion keyboard journeys pass. Motion restraint is deliberate, not an unimplemented animation layer.

## Case study

`CASESTUDY.md` now leads with the question and finished product, then explains the v1 limitations, preserved-first-look breakthrough, Split/Instrument/Reveal, five different mechanics, consequential trade-offs and actual validation limits. It closes with the design learning rather than a technology list.

`portfolio-case-study/index.html` is the portable editorial companion. Twelve actual images show the catalogue, cover, workbench, two looks, contradiction, five exhibits, compact record and mobile comparison. The sequence is expressed in semantic HTML. Images link to full resolution. System typography makes the companion work without external font requests; the application retains its required fonts. Four-width offline browser checks decoded all twelve images, found no overflow, no runtime error and no HTTP request. Rendered desktop/mobile openings and individual sections were inspected.

The presentation labels synthetic QA records, authored simulations and AI assistance. It claims no interviews, adoption, commercial impact, learning gain or outside endorsement. Approximately two-minute skimming is a design intention, not a measured recruiter result.

## Design Eye and export

- Existing full PNG retained: **1600×4073** in the five-case fixture.
- New compact PNG: **1600×2263**, an A4-proportioned editorial sheet. All five initial/final patterns, completed/pair/changed/reaffirmed/incomplete counts, and up to two lines from each saved reason. Excerpt limits are printed on the artifact. No score or inferred behavior.
- Full Chrome and Edge PDF: **14 A4 pages each**. Both checked against **20 saved statements**, lower Banking content and **138 embedded font-resource references**. All pages rendered; contact sheets and representative full pages inspected. No authored juror names appear in the personal PDF, including the sealed case.
- PDF structural inspection: **no StructTreeRoot and no MarkInfo** in these exports. They are **not certified accessible PDFs**. Text extraction does not change that conclusion.
- New portable text HTML: semantic offline current-record edition with saved notes, first/second reasons, confidence, opened context and reflection. All **20 checked statements** preserved. Unit coverage escapes saved HTML markup; the browser-opened export is script-free. It explicitly leaves visual frames in the full application/PDF and excludes outside readings.

PNG, full PDF and text HTML are actually generated/downloaded artifacts, not screenshots of prospective buttons. Firefox produced its actual full PNG; Firefox print/PDF and genuine Safari export remain unverified.

## Exact validation

Final run records: `output/excellence/verified/`. Early/incomplete runs remain under `before/`, `baseline/`, `regression/` and `final/`; only final successful evidence is counted below. The runner resumed after repairing fixture navigation, retaining successful suites against the same production build. No assertion was removed or relaxed.

| Check | Result |
| --- | --- |
| `npm run check` | PASS: lint; ten-case/assets/encoding/CSS validation; **36/36 unit tests**, zero failures; production build |
| Full regression runner | **13/13 suites PASS** |
| Collection production preview | **45/45 full journeys**: five cases × three sizes × Chrome/Edge/Firefox Nightly; **279 screenshot/overflow checks**, zero recorded page errors |
| Additional 320px collection | **5/5 complete journeys**, **31 screenshot/overflow checks**, zero page errors; Chrome touch emulation, not a physical phone |
| Collection contracts | PASS: captured geometry/resize, frozen-control isolation, point/rectangle touch, reload/cross-tab, sealed deep link, legacy/v2 distinction, partial report and missing-verdict fallback |
| Benefits + investigation contracts | PASS: three-size journeys, validation/interruption/recovery, independent judgments, earlier ruling preservation, idempotency, history, draft/reload, cross-tab and corruption retention |
| Original archive / short route | PASS: all ten cases, movement/panel/intermission, sealed privacy, five-minute path/reload, reset, old points and normal-motion controls |
| Phase 2 instrument suite | PASS at three sizes: keyboard point, reverse rectangle, numerical edit, ruling/confidence, Reveal and saved reopening |
| Sequential Tab suite | PASS: all five fresh exhibit tasks, both judgments/context; Banking Reveal, report anchors and actual PNG; deletion focus and touch Point scrolling |
| Reset supplement | PASS: persistent confirmation, byte-preserving cancellation, focus restoration and keyboard erase |
| axe-core **4.14.0** | **29 states**, **0 reported violations**; **24 reflow checks**, zero failures/errors. Manual/incomplete checks remain; no WCAG certification |
| New acceptance | Five catalogue hover/focus identities; one-at-a-time 390/320 previews; mark reselection/count/focus; responsive stage disclosure; real compact PNG/HTML downloads |
| Offline presentation | 1440/768/390/320 widths, twelve decoded images each, no overflow/error/HTTP request |
| Dependencies | `npm audit --json`: **0 advisories**. No new dependency or package-lock change |
| Source quality | `git diff --check` PASS. Mechanical detector: two existing required Instrument Serif warnings retained as documented exceptions |

Actual browser builds: Chrome **155.0.8059.85**, Edge **155.0.4283.62**, Playwright Firefox Nightly **157.0**, on Windows. Reference viewports: **1440×900, 768×1024, 390×844**, plus **320px** critical states and full Chrome journeys. CSS viewport emulation does not establish physical-device, virtual-keyboard or genuine pinch-zoom acceptance.

Production build: **404.45kB JS / 123.68kB gzip**, **120.21kB CSS / 21.71kB gzip**, no build errors. Five new actual preview PNGs total approximately 452kB; only selected desktop/mobile previews are displayed. No major library or infrastructure added.

Three fresh, cache-disabled, unthrottled loopback loads: LCP **344/276/332ms**, CLS **0.02412/0.02924/0.02412**, zero recorded resource failures. These are local observations, not public-site Core Web Vitals or an optimization claim. Denied writes and malformed legacy data produce visible recovery warnings without falsely reporting a save.

## Provenance, privacy and people

All ten JPEG hashes match the previous inventory. Seven reconstruction origins remain documented. The three open assets are **case-002** (social contacts/avatars), **case-011** (visible Pink News credit), and **case-012** (Craigslist capture). Their current uses, source limits and reconstruction alternatives are documented in IMAGE-PROVENANCE.md. None is cleared, deleted or silently replaced. New catalogue captures show actual authored exhibits; Bulletin's preview does not reuse the Craigslist JPEG.

No actual participant sessions occurred. REMAINING-VALIDATION.md supplies the neutral approximately-five-person allocation, consent/retention rules, tasks and observation template. Actual screen-reader output, physical-device interaction/keyboard appearance/magnification, genuine Safari and stable Firefox remain **NOT RUN**. The report preserves these gates rather than using automated results as substitutes.

Records remain browser-local and unencrypted. No telemetry, account, submission service or new network dependency. Existing Google font requests remain disclosed. Package examples contain synthetic QA details only; root untracked captures and unresolved source JPEG files are not separately bundled.

## Review package

Final target: `output/design-or-disaster-v2-excellence-review.zip`.

Open the extracted `index.html` for the gallery and `case-study/index.html` for the portfolio presentation. The package contains all five investigations, desktop/tablet/mobile/320 evidence, Second Look/contradiction/sealed states, actual exports, audit/handoff/provenance/study documents, raw validation summaries and logs, and six matched comparisons. The export comparison clearly distinguishes the retained full summary from the new compact edition using the same synthetic fixture. The case-study comparison uses matching desktop opening viewports.

The builder verifies archive extraction, SHA-256 file hashes, all relative HTML resources and PNG decodes. A separate browser check opens the extracted gallery, presentation and text export with networking disabled. Exact final bytes, SHA-256, file count and extracted directory are recorded in `output/excellence/package-verification.json`; browser results in `output/excellence/portable-browser/package-results.json`. These external records avoid a self-referential ZIP-size claim inside its own compressed contents.

## Candid remaining weaknesses

The evidence map is deliberately a substantial surface; mobile still needs scrolling. Two precision modes and three accessible placement routes can still require orientation. The compact stage rail is a trade-off that needs real first-time testing. Existing mark notes retain their 100-character limit; detailed judgment reasoning remains 800 characters. The complete report remains long. Fixed captures preserve coordinates but do not make small exhibit text readable at every scale. One-page excerpts cannot substitute for a full record. No result here proves people find the concept useful.

Engineering passes in the observed local scope. Publication is **CONDITIONALLY READY** until the asset-level decisions and named external acceptance gates close, followed by separate explicit push/deployment/publication authorization. No 10/10 score is self-awarded.
