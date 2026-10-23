# Final review and public draft-PR handoff

23 October 2026. Final corrections to the existing v2 product, not a redesign. Engineering evidence and the public-content gate are distinct from authorization to launch a website.

## Baseline and scope

Verified source: `codex/v2-portfolio-excellence` at `1b69a08928257aae58e901c78bc7041833a692a9`. It remains preserved. Corrections use `codex/v2-final-review-fixes`. Public target: `tanishkfr/design-or-disaster`, `main`, verified by Git fetch and GitHub metadata as public. The remote base observed for this pass is `5ded59cbc51db7197ba5eee7ecd8a70a2787b073`; recheck before publication.

The three untracked root images and all earlier local output/ZIPs remain intact. They are explicitly ignored and excluded from the public snapshot. The old excellence/release reports are marked historical, with a pointer here; no previous validation result is promoted into a new result.

## Preview discrepancy: reproduced, explained, corrected

The previous capture sequence focused Fashion, then scrolled to the top while the pointer remained stationary. That scroll moved Banking under the pointer and fired `mouseenter`, replacing the focused case's preview. The pre-capture assertion had already passed; no assertion checked the resulting screenshot state. It was a real focus/hover arbitration problem amplified by a capture gap, not five independent image/question models.

One `previewId` still controls the active row, caption, image, question and entry action. Hover selection now requires actual mouse movement, so scrolling alone does not replace the focused case. Images are keyed to the case so a newly requested image cannot retain the previous decoded bitmap. No loading delay or animation was introduced. Ordinary hover is underlined; only the selected preview receives signal-red text.

`verify-final-fixes.mjs` asserts after image decode **and after the screenshot**, including case identifier, image path, caption, question and active row. It also checks misleading signal coloring, rapid reverse transitions, reduced/normal motion, sequential Tab navigation, all five curated cases, four compact widths and tablet reflow. Corrected Fashion evidence is in `docs/review/desktop-preview-case-015.png`. Focus and pointer are allowed to have different targets after a deliberate pointer move; the active-preview model and displayed content must agree.

## Mobile and compact stages

Return to exhibit now scrolls to the selected point/region, rather than centering the whole captured frame and potentially leaving lower evidence off-screen. The marking surface regains keyboard focus without a competing automatic scroll. Existing point/rectangle coordinates and schemas are unchanged.

Actual touch-event emulation exposed a second defect: focusing and scrolling during `pointerup` can retarget the subsequent native click onto another element. Pointer-driven note focus now occurs after that native click. Keyboard and named-region placement keep their existing path. Selected observation buttons expose `aria-pressed`. There is no overlay or new mobile editing system.

The compact current-stage summary retains its stage name and ordinal. Its expanded affordance now reads “Close stages”; collapsed reads “All stages”. Previous stages, disabled future stages, reload/resume and responsive reopening remain available. This is a verified affordance correction, not evidence of first-time discoverability.

At **320, 375, 390, 430 and 768px**, the new mobile test places evidence at y=90%, returns to it, reselects it with touch events, edits the corresponding note and checks byte-preserving geometry through viewport resizing. A 430px-high viewport checks available editor space; this is **not** a physical phone or actual software-keyboard session. Small frozen exhibit text still requires real-device magnification acceptance; no unsupported device claim is made.

## Original fictional replacements

| Former source | Current disposition | Compatibility |
| --- | --- | --- |
| Social capture with contacts / case-002 | Original fictional Flare feed, invented numbered contacts and letter avatars; no imported source pixels or real personal details | Same 249×576 image plane and ranked-contact regions. Unsupported year/history removed. |
| Identity capture with third-party credit / case-011 | Original fictional Open Self form, unfilled selectors and generic identity vocabulary; no third-party image/credit/logo | Same 570×364 plane; selector and option-grid targets reviewed. |
| Craigslist capture / case-012 | Original fictional Bulletin category directory and districts; no source image, Craigslist brand, real listings or seller data | Same 1440×900 plane with main/left/right regions. Live Second Look Bulletin remains independent. |

Sources are in `public/reconstructions/`; `scripts/reconstruct-public-exhibits.mjs` renders them without network resources. Affected legacy investigations and saved comparisons explicitly disclose that older notes may refer to the former image. Existing notes, verdicts and coordinates are not rewritten; the replacement is not passed off as the original artifact judged.

The former captures remain **uncleared**. All three were already in public main before this task. This update neither clears nor erases that public history. Seven other reconstructed JPEGs remain byte-identical to public main; two retain recognizable pre-existing news/OS branding, separately disclosed for website-publication review. Source construction is not a blanket rights grant. See IMAGE-PROVENANCE.md.

## Verification and honest limits

Executed on Windows with Chrome **155.0.8059.85**, Edge **155.0.4283.62** and Playwright Firefox Nightly **157.0**. Stable Firefox is not substituted by that engine.

- `npm run check`: lint, case/assets/encoding/CSS validation, **36/36 tests** and production build pass.
- Full runner: **13/13 suites**, including **45 complete collection journeys** across three browsers × five cases × desktop/tablet/mobile, **279 screenshot/overflow checks**, original ten-case archive, short path, point/rectangle/resize, immutable/independent/changed/unchanged judgments, perspectives/contradictions/sealed finale, persistence/cross-tab/corruption and reset.
- Actual sequential Tab journeys through all five native exhibit tasks, both judgments and context; normal/reduced motion and touch-emulated Point scrolling remain covered.
- Focused preview suite: **40 recorded states/checkpoints per browser**, covering all five identities and both input routes, rapid transitions, post-capture synchronization and mobile expansion/reflow. No inference from a screenshot filename alone.
- Mobile supplement: all five widths above; selected lower evidence, focus, editing, resize and unchanged geometry pass.
- Replacement compatibility supplement: all three affected legacy saved records reopen with the replacement notice and unchanged judgments, notes and point coordinates.
- axe-core **4.14.0**: **29 states**, zero reported violations; **24 reflow checks**, zero failures. This is rule-based evidence, not WCAG or screen-reader certification.
- Actual compact PNG (**1600×2263**), full PNG (**1600×4073**), semantic HTML and Chrome/Edge PDF were generated. HTML preserves all twenty checked synthetic statements. Full PDFs have **14 pages** each, all twenty statements, lower Banking content, embedded fonts and no authored-juror leakage. PDF pages and actual images were inspected; untagged PDF is not called accessible.
- Dependency audit: **zero advisories**; no new runtime dependency. Source whitespace and scoped design-detector checks pass.

Primary local evidence: `output/final-fixes/`. Failed/intermediate diagnostics are not counted as passes. Early sandbox Edge/Firefox launch failures were rerun with local browser permission. Focus and viewport checks wait for event/layout completion, not arbitrary delays. No existing assertion was removed to obtain a pass.

Actual screen-reader output, real phones/software keyboards/pinch zoom, genuine Safari, stable Firefox and consented first-time participants remain **NOT RUN**. Zero participant results are invented. The existing neutral study kit remains open. The independent score reported in the supplied brief is not reproduced as an agent-awarded score.

## Public branch safety

The intended public branch is `codex/design-or-disaster-v2-pr`, built as **one new reviewed snapshot commit directly from verified remote main**. Do not merge or cherry-pick unpublished v2 history. The original development/fix branches remain local and intact.

`prepare-public-snapshot.py` exports committed reviewed source/media/docs through an allowlist. It never copies untracked output. The clean tree excludes local launch configuration, raw evidence/ZIPs, original root images, profiles, caches, node_modules and environment files. `audit-public-snapshot.mjs` checks the sole parent, newly reachable objects, forbidden paths, known uncleared blob IDs, high-confidence credential patterns and branch deployment suppression. Its exact source/tree/commit manifest stays in local output.

The three former capture objects are absent from newly exposed objects. They remain reachable through **pre-existing public base history**, which is explicitly outside this claim. All newly introduced binary images are reviewed current app renders or original fictional exhibits. There is no claim that a credential regex proves the absence of every possible secret; the file allowlist, staged diff, visual review and object inventory are complementary evidence.

## Deployment and GitHub handoff

Public GitHub deployment history identifies Vercel previews and production deployments. GitHub reports zero Actions workflows. The connected Vercel project is identifiable, but detailed team settings require a separately authorized scope; no setting is silently changed. `vercel.json` disables automatic Git deployment **for this PR branch only**, using the documented `git.deploymentEnabled` branch mapping. Other branches retain default behavior. See [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

No manual deployment, production promotion, merge, release or force-push is authorized or performed. A draft PR is code review, not website launch. Before and after publication, verify remote main, branch SHA, draft/base status, actual CI checks and deployment records. Exact confirmed URLs, commit and live status are reported in the final delivery; do not interpret this document alone as proof that publication succeeded.

CLI authentication was checked and is invalid. The connected GitHub integration confirms repository access. Use a supported authenticated mechanism after the content gate passes; never expose or request a pasted token. If authentication or the content gate prevents publication, retain the verified local snapshot and report the exact blocker.

**Recommendation:** ready for a draft code-review handoff once the explicit object gate passes. **Public website: CONDITIONALLY READY**, pending inherited branding treatment and the named external acceptance gates. No perfect score or unconditional production-readiness claim.
