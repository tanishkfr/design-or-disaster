> Historical checkpoint. The final review corrects preview capture/selection behavior and replaces three supplied images. Current status and public-PR boundaries are in [FINAL-REVIEW-HANDOFF.md](FINAL-REVIEW-HANDOFF.md). The results below describe the earlier checkpoint.

# Design or Disaster? v2 — release-candidate closure

23 October 2026 · Local review only · **Publication: CONDITIONALLY READY** · **Engineering: PASS in the tested scope**

The five-case product, signature Split → Instrument → Reveal sequence, dark editorial direction, ten-case archive, five-minute path and persistence contracts are preserved. Available engineering, keyboard, visual and export checks pass. Public-use treatment for three supplied images, actual assistive-technology acceptance, physical devices, genuine Safari, stable Firefox and independent participants remain open. The review package is suitable for focused independent review; an unconditional public release is not recommended yet.

## Repository and scope

- Verified starting branch: `codex/phase-2-3-refinement`.
- Verified starting SHA: `813b570e17088fc0e05f9c9966d93ee527b03684` (exact requested baseline).
- Dedicated closure branch: `codex/release-candidate-closure`.
- Tested implementation checkpoint: `9d3bd982ef77e223cc4dd2ff5be2e0d3866ab350`, also recorded in the review package's `review-manifest.json` and `output/release-candidate/implementation-checkpoint.json`. The subsequent documentation/package commit does not change the tested app. The delivery message records both local commits and the exact ending SHA; a document cannot contain its own commit hash.
- Original Phase 2.3 branch/history retained. No reset, rewrite, push, deployment, publication or public release. No other repository or main portfolio website changed.
- Final intended tracked state: scoped changes committed. Pre-existing untracked `SnapchatImage.png`, `arcimage.png`, `ioscalendar.png`, and generated `output/` remain preserved/untracked. Generated evidence and ZIP are intentionally local artifacts.

## Findings and corrections

| Finding | Severity / evidence | Correction and verification |
| --- | --- | --- |
| Reset confirmation expired after three seconds | P1 access/timing problem. Real browser: four-second pause returned the button to Reset, before deliberate confirmation. An automated rule scan missed this. | Removed time limit; explicit Cancel and a live explanation; cancel preserves exact saved data and returns focus to Reset. Keyboard confirm clears both project stores. Tested after four seconds, and at 768/390/320 widths. |
| Expanded reset controls crowded the 320px header | P2, observed during rendered verification of the correction. No document overflow, but tightly wrapped labels abutted the wordmark. | Cancel now follows the explanation; header has a real gap and wraps navigation without a fixed-height collision. Final narrow screenshot and focused regression inspected. |
| Imagery described categorically as historical | P1 source integrity: recovered HTML establishes seven reconstructions, while three captures have unresolved source/permission records. | About and archive footer identify those limits; Portfolio context no longer calls its still historical. No image deleted/replaced and no license invented. IMAGE-PROVENANCE.md supplies the complete inventory. |
| Shared-browser privacy boundary unclear | P2, source inspection shows unencrypted localStorage and retained downloads; font requests leave the origin. | About explains local profile access, fictional data, confirmed reset versus retained exports, and Google font requests. No new telemetry/service. |
| Seven development-tool advisories | Six high, one moderate in initial npm audit; production-only count zero. | Scoped same-major updates; final full and production-only audit counts zero. Build and regression rerun. |
| Metadata still described only the older route | P2 content mismatch. | Descriptions now explain two judgments and Second Look; social image alt describes the Banking reconstruction. Existing favicon and social asset path retained. |
| Capture could record an empty index transition | QA harness defect seen in actual screenshots, not an application blank-page failure. | Capture waits for the index heading and settles finite screenshot animations; dedicated settled cover/index evidence captured. Previous artifacts retained; transitional screenshots excluded from the review gallery. |

No other P0/P1 functional defect was observed in the tested scope. No major feature, renderer, schema, capture-coordinate or subjective art-direction change was introduced. The main finding is a timing correction plus source/verification integrity, not a redesign.

## Image provenance

**Ten JPEGs accounted for: seven AUTHORED RECONSTRUCTION, three UNKNOWN / REQUIRES REVIEW.** Matching capture HTML exists at commit `6b9480b`; all ten JPEGs remain byte-identical to that checkpoint. Root untracked images are unused and excluded from the build/package. Favicon, code-native garment/portfolio imagery and export backgrounds are inspectable authored code. No raster model generation was established.

The unresolved files are `case-002.jpg` (recognizable social interface and contacts), `case-011.jpg` (visible “Courtesy of Pink News” credit), and `case-012.jpg` (Craigslist capture). Source dates/acquisition records/permission grants are absent. Branding and a visible credit do not establish reproduction permission, consent or historical authenticity. No JPEG has been awarded VERIFIED LICENSED. Seven documented reconstruction origins do not establish blanket clearance for their recognizable marks or interface conventions.

No image replaced. About now makes the uncertainty visible. The portable gallery uses current authored working exhibits and does not separately distribute these three unresolved source files. Its screenshots still carry applicable underlying exhibit restrictions. Full inventory, hashes, usage, preservation and publication treatment: [IMAGE-PROVENANCE.md](IMAGE-PROVENANCE.md). Official host font license references are documented there; they do not license screenshot subjects.

## Accessibility acceptance matrix

| Area | Real evidence in this closure | Result / limit |
| --- | --- | --- |
| Actual screen reader | NVDA/JAWS/stable Firefox not found in inspected Program Files/registry entries; Windows Narrator executable exists but no speech/braille session was operated | **UNVERIFIED**. No AT output or certification claimed. Human script supplied. |
| Keyboard | Existing fresh sequential Tab-only suite completes all five exhibit tasks, evidence, context and independent judgments; banking also covers Reveal/report anchors/export | **PASS** in Windows Chrome. Programmatic focus alone is not counted as the Tab-only journey. |
| Reset | Actual delayed confirmation, keyboard cancel/confirm, byte-preserving cancellation, cleared stores, focus restoration, narrow layouts | **PASS**, targeted new regression. |
| Semantics/automated rules | axe-core **4.14.0**, WCAG A/AA tagged 2/2.1/2.2 rules across **29 states**, including About, reset, five Explore/Mark/judgment/reflection views, four perspectives and report | **0 reported violations**; incomplete/manual checks remain. Semantic snapshots saved. Not WCAG conformance or reader acceptance. |
| Names, landmarks, descriptions, state, live status | Source review, automated scans and actual keyboard journeys; native fields, named-region alternative, stage focus, inert snapshots, visible status/errors | **PASS in tested scope**; actual speech sequencing remains unverified. |
| Point/rectangle alternatives | Named-region controls, keyboard point/region, numerical geometry; deletion recovery and frozen-control isolation | **PASS**. No compulsory dragging for annotation. |
| Reflow/text scale | **24 settled checks**: cover, index, report and five completed investigations at 720, 360 and 320 CSS pixels; additional reset at 320/390/768 | **PASS for CSS reflow**. 720/360 correspond to 200%/400% width reduction from 1440. Real browser-chrome zoom, OS text scaling and physical-device zoom were not separately operated. |
| Contrast/focus/targets | Automated contrast scan of tested host/working states; visible keyboard focus, selected text/number labels, native controls; representative screenshots inspected | No reported host contrast failure. Legacy screenshot text and every selected/focus/hover color pair are not exhaustively certified. Reset targets retain 44px minimum height; smaller spatial marks have non-pointer alternatives. |
| Reduced motion | Tablet/mobile suite preferences, fresh keyboard suite, normal-motion Split/Reveal and finite Portfolio motion control | **PASS** in tested environments. Existing reduced-motion duration collapse retained. |
| Export accessibility | Real PDF text and embedded font inspection; on-screen text record available | Readable PDF, **not PDF/UA or screen-reader acceptance**. PNG is an explicitly excerpted image summary. |

Relevant access concerns map to timing (2.2.1), keyboard (2.1.1/2.1.2), focus (2.4.3/2.4.7/2.4.11), name/state/status (4.1.2/4.1.3), contrast/reflow (1.4.3/1.4.10) and alternatives to dragging (2.5.7). This mapping describes review scope, not a declaration that every criterion has passed a complete manual audit.

## Browser/device acceptance

| Actual environment | Scope | Outcome |
| --- | --- | --- |
| Windows Chrome **155.0.8059.85** | Production preview, all five cases at 1440×900 / 768×1024 / 390×844; actual PNG/PDF, keyboard, storage and supplemental access checks | **PASS** |
| Windows Edge **155.0.4283.62** | Same fifteen production-preview journeys and actual PNG/PDF | **PASS** |
| Playwright Firefox Nightly **157.0** on Windows | Same fifteen production-preview journeys, resized viewports and actual PNG | **PASS in this engine**; stable Firefox and Firefox print/PDF not tested |
| Chrome/Edge touch emulation | Mobile journeys; Chrome touch events for Point scrolling, rectangle and Split/Reveal | **PASS for emulation only** |
| Genuine Safari / physical iOS / physical Android | No accessible supported device/session used | **UNVERIFIED** |
| Actual stable Firefox | No stable installation/session used; Nightly is not substituted | **UNVERIFIED** |

The final 320px confirmation adjustment was followed by production rebuild, all 35 unit checks, focused reset at three compact widths, all 29 automated access states and 24 reflow checks. The earlier complete three-browser journeys remain valid functional evidence; they preceded that final header/Cancel placement correction. Dedicated final screenshots cover the changed surface. No claim that the entire browser matrix was rerun after a purely local confirmation-layout change.

## Independent heuristic and visual review

This is an **agent-led clean-profile walkthrough**, not recruited participant research, an external designer endorsement or empirical HCI validation. Cover/index entry, case identity, exploration/marking, note editing, both judgments, context, report and export were exercised. The reset timing issue and unsupported provenance wording are concrete findings. No first-time-visitor quotes, task times, satisfaction rates or learning effects were invented.

All five exhibits remain visually distinct: calm finance, public-service form, expressive portfolio, dense noticeboard and blunt storefront. The cover's type/slash, open numbered rows, precise image registration and separate first/second frames are coherent with DESIGN.md. Point/Region, Explore/Mark and layer labels remain explicit; context does not supply a correct verdict. The signature moment—evidence becoming an inspectable argument—was retained. No evidence justified a broad redesign.

Screenshots were actually opened: five-case overview, final full index, mobile populated editing, About, final narrow reset, paired reflection/perspective states, PNG sections, complete PDF contact sheets and full-resolution Banking export. Gallery includes context, contradictions, sealed finale and representative tablet/mobile states. Before/after reset uses the same 1440×900 viewport and equivalent five-case synthetic record after the same four-second wait; baseline expired, corrected state remains actionable. Visual evidence demonstrates the correction rather than inferring it from CSS.

The long report and discoverability/fatigue remain participant research questions. Small text inside a deliberately scaled, frozen evidence frame remains image-like content; readable descriptions, named controls and text notes are separate. Do not mistake a host reflow result for enlarging every legacy screenshot's internal text.

## Content integrity

Reviewed current case content, authored perspectives/contradictions, context, report calculations, sealed behavior, storage and export implementation. Banking's refund/transfer, Benefits' interruption/recovery, Portfolio's role/contact/motion, Bulletin's fictional search/shortlist and Fashion's size/bag are authored tasks. They establish neither real product performance nor user-study findings. Both unchanged and changed judgments are preserved; wording comparisons are not learning measures.

Benefits uses Alex Sample / TEST-1042 and distinguishes a reconstructed still from illustrative runtime behavior. Portfolio's still is explicitly a reconstruction. Bulletin's community label is not seller verification. Fashion's context remains a constraint, without outside positions or a hidden answer. Existing legacy critical opinions remain labeled authored; traffic, business outcomes and historical timelines are not substantiated by their imagery. No additional historical/product claims were introduced to fill missing provenance.

CASESTUDY.md now carries the closure, limits, source distinction and a short portfolio summary while preserving AI-assistance disclosure. Implementation effort is not presented as proof of usefulness. Main portfolio files were not touched.

## Exact regression and engineering results

Final logs and JSON are under `output/release-candidate/`. `final/` is the complete regression run; `accessibility-closure/`, `reset-closure/` and `check-closure.log` contain the focused final confirmation-layout verification.

| Executed check | Observed result |
| --- | --- |
| `npm run check` | **PASS:** lint; ten-case, asset, encoding and CSS-module validation; **35/35 unit tests**, zero failures; production build |
| `verify-collection.mjs`, production preview, three builds × five cases × three reference sizes | **45/45 full journeys**, 93 screenshot/overflow assertions per build, zero recorded page errors; actual PNG all three, PDF Chrome/Edge |
| `verify-collection-contracts.mjs` | **PASS:** geometry, preserved divider, sealed deep link, v2/legacy distinction, touch point/rectangle, frozen isolation, resize/reload, cross-tab, partial/legacy-only report, missing-verdict fallback |
| `verify-investigation.mjs` | **PASS:** Benefits at three reference sizes, reload stages, independent judgments, validation/interruption/recovery, coordinates |
| `verify-investigation-contracts.mjs` | **PASS:** retained legacy ruling, no duplicate completion, confirmed new attempt/history/read-only, drafts, cross-tab and retained corrupt store |
| `verify-journeys.mjs` | **PASS:** ten-case archive, movement/panel/intermission, sealed privacy, short path/reload, reset, legacy points, emulated touch, normal-motion Split/Reveal |
| `verify-phase2.mjs` | **PASS:** three sizes, keyboard/ranges, reverse rectangle, geometry editing, submission, saved reopening; zero page errors |
| `verify-refinements.mjs` | **PASS:** actual Tab-only five-case completion; focus/route recovery, grouped labels, report reflow, touch Point scrolling |
| `verify-release-reset.mjs` | **PASS:** delayed confirmation, byte-preserving cancel, focus return, keyboard erase, 768/390/320 reflow; before run reproduced expiration |
| `review-release.mjs` | **PASS within automated scope:** 29 axe states, zero violations/page errors, 24 reflow assertions |
| `verify-exports.mjs` + bundled Python `inspect-phase23.py` | **PASS:** actual PDF, matching print/capture widths, lower Banking content, twenty saved statements, embedded font resources, sealed exclusion |
| `measure-phase23.mjs` | **PASS within local measurement scope:** three fresh production loads; fonts loaded, no failed requests; denied/malformed storage visible and retained |
| `git diff --check`; final lint; mechanical design detector | **PASS**; final detector found no matching issues in changed component/CSS targets. Mechanical output is not visual certification. |

Failed/intermediate evidence is retained: initial sandbox download cancelled; initial supplementary route test attempted an investigation before creating its record and was corrected to use the index; one intermediate accessibility run targeted Cancel against the pre-fix production build; a documentation rewrite tripped the encoding validator and was restored before the final passing check. None is counted as PASS or removed to hide a failure. An empty transition capture is not used as final visual evidence. No existing acceptance assertion was removed or weakened.

## Dependencies and security

Initial audit: **7 affected development packages (6 high / 1 moderate), 0 production advisories**. Final full and `--omit=dev` audit: **0**. Audit JSON and original advisory URLs are preserved in the package/evidence. Vite's editor/middleware advisories concern development tooling; the [upstream advisory](https://github.com/advisories/GHSA-587h-7wmj-h5pm) is one of the documented inputs, not evidence of exploitation here.

| Package | Initial severity | Installed before → after | Exposure / remediation / upgrade consideration |
| --- | --- | --- | --- |
| vite | high aggregate | 8.0.16 → **8.1.6** | Dev/preview tool; minimum selected fixed 8.x minor, no major migration; build/CSS output reverified |
| postcss | high aggregate | 8.5.15 → **8.5.31** | Build CSS/source-map input handling; patch update, verify compiled CSS/print |
| source-map-js | high | 1.2.1 → **1.2.2** | Build source-map processing/DoS; scoped patch |
| nanoid | high | 3.3.12 → **3.3.20** | Tool dependency generator edge cases; same minor patches |
| browserslist | high | 4.28.2 → **4.29.4** | Build queries/stats/cache processing; same major minor, target output checked |
| brace-expansion | high | 5.0.6 → **5.0.12** | Tool glob recursion/DoS; patch, lint checked |
| baseline-browser-mapping | moderate | 2.10.34 → **2.11.31** | Build data mapping; same-major update, output checked |

Applied `npm install --save-dev vite@8.1.6`, followed by non-forced `npm audit fix`; package/lockfile changes reviewed. Other compatible transitive tool changes are visible in the lockfile. React runtime dependencies were not deliberately upgraded. No major upgrade, new runtime dependency, account, service or public dev server added. axe-core is an isolated QA install under untracked output, excluded from ZIP. A zero advisory count is not a general security certification.

Storage is browser-local, unencrypted and shared by that browser profile; code review finds no investigation submission service. Confirmed reset clears only this project's stores. Downloads remain. Google Fonts is an existing external request dependency and is disclosed. No secrets, private participant records, node_modules or build caches are packaged.

## Build, loading and measured performance

Final build: approximately **394.03 kB JS / 120.15 kB gzip**, **114.55 kB CSS / 20.69 kB gzip** (use `check-closure.log` for exact emitted totals). No build error or chunk-size warning. Largest source JPEG remains **249,148 bytes**, Banking cover **37,406 bytes**. Cover dimensions/fetch priority and existing font fallbacks retained. Favicon exists; social metadata references the audited Banking image. Hash navigation and loopback static production hosting pass; current deployed URLs/public links are not verified by these tests.

Three cache-disabled, fresh-context, **unthrottled loopback** production loads: LCP **332 / 268 / 264 ms**, CLS **0.02412 / 0.02924 / 0.02863**, DOMContentLoaded **203.5 / 166.8 / 174.4 ms**. One long task in each (**62 / 68 / 52 ms**); all three host fonts loaded, zero failed requests. These measurements preceded the final local reset-header placement adjustment and are not claimed as a new performance improvement.

No Lighthouse score, field Core Web Vitals, INP, FPS, public-network latency, per-export latency or memory-leak benchmark is claimed. Repeated investigations ran as functional journeys, not a controlled memory study. Available measures did not establish a bottleneck warranting broad optimization.

## Actual export inspection

Synthetic first/second evidence and reasons only. Chrome PNG is **1600×4073** and was opened in readable sections. Chrome and Edge each produced a **14-page A4 PDF**, rendered in full. Both include **all 20 checked saved statements**, lower Banking rows/footer and **138 embedded font-resource references** (page references, not 138 font families). No authored juror name appears in the personal PDF. Actual sealed isolation remains intact. Firefox produced a real PNG; Firefox/Safari PDF/print and PDF assistive-technology acceptance remain open.

The portable package includes the verified Chrome PNG/PDF and representative rendered pages. Full-resolution exports are readable; PDF/UA conformance is not inferred from text extraction. Exact extracted-copy validation is recorded by the package builder.

## Portable review package and remaining work

Required ZIP: `output/design-or-disaster-v2-review.zip`. Source gallery: `output/release-candidate/review-package/index.html`. It contains real cover/index/all-five-case screens, populated evidence/context/reflection/perspective/contradiction/sealed/report states, mobile/tablet evidence, matched reset before/after, six review documents, raw result summaries and the two actual exports. No generated mockups or unnecessary source-code copies.

The builder checks every expected source, makes an archive, extracts it into a fresh arbitrary directory, verifies hashes, every HTML resource target, every PNG decode and readable fourteen-page PDF. A separate browser check opens the **extracted** `index.html` locally and verifies its images/documents without an external runtime. Exact ZIP bytes, SHA-256, extracted location, file counts and verification results are in `output/release-candidate/package-verification.json`; the final delivery supplies the exact archive size. This avoids a self-referential ZIP-size claim inside a file compressed into that ZIP.

Human-controlled closure procedures, recording templates and expected outcomes are ready in [REMAINING-VALIDATION.md](REMAINING-VALIDATION.md): image/source/privacy decisions; actual NVDA/Narrator/VoiceOver output; stable Firefox and genuine Safari; physical touch; approximately five real participants and synthesis. None is marked complete. Public deployment and access checking require separate future authorization and were not performed.

**Recommendation:** retain the release candidate for independent portfolio/HCI review. Complete the named source and human/environment gates, fix/retest any substantive findings, and then make an explicit publication decision. Engineering passes in the observed local scope; public-release approval remains conditional.
