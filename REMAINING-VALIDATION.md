# Remaining validation and session kit

23 October 2026. **Publication is CONDITIONALLY READY.** These are open acceptance gates, not completed results. The local engineering result and exact evidence are in `RELEASE-CANDIDATE-REPORT.md`. No participant sessions, screen-reader sessions, physical-device sessions, stable Firefox or genuine Safari runs occurred during this closure.

## Gate register

| Gate | Current evidence | Exact closure condition | Owner / environment / date / result |
| --- | --- | --- | --- |
| Image source/public-use and privacy | Three supplied captures replaced by original fictional exhibits for the new code-review snapshot; pre-existing public history and inherited branding remain | Review inherited branding/public-site treatment and the existing public history separately; verify the clean snapshot gate in FINAL-REVIEW-HANDOFF.md | Unassigned / pending |
| Actual screen reader | Keyboard, semantic snapshots and axe only; NVDA not found in inspected installations, Narrator executable present but not operated | Execute the reader script below with actual speech/braille output, record defects, fix/retest failures | Unassigned / pending |
| Genuine Safari | No supported Apple environment available | Full Banking + Benefits + Fashion journeys, one Portfolio motion check, one Bulletin search, persistence and actual export/print on supported Safari | Unassigned / pending |
| Stable Firefox | Only Playwright Firefox Nightly 157 available/tested | Run five cases in an actual stable install, record build/OS and export behavior; real Firefox print/PDF review | Unassigned / pending |
| Physical touch | Touch-event emulation only | Run the touch script on actual iOS/Safari and Android/Chrome devices where available; no emulator substitution | Unassigned / pending |
| Independent first-time visitors | Agent heuristic review only | Aim for five consented real sessions, include designers/non-designers; synthesize observations, fix substantive issues and retest | Unassigned / pending |
| Public hosting and public-network behavior | Local production preview only; nothing deployed | Only after separate publication authorization: verify actual deployed SHA, public access, fonts/assets/hash reload, privacy and network performance | Unassigned / pending |

Use **PASS / FAIL / BLOCKED / NOT RUN** for individual steps. A failure needs an issue with expected/actual behavior and a retest. A blocked step does not pass. Record names/version numbers actually observed, not browser families alone.

## Common setup

1. Use a disposable browser profile on the release-candidate checkout. Run `npm ci`, `npm run check`, then `npm run preview -- --host 127.0.0.1`. Open the printed localhost URL. Preserve any real visitor records first; the reset deliberately erases this project's records in that profile.
2. Record commit SHA (`git rev-parse HEAD`), OS/build, browser/version, device/model, viewport or display scaling, assistive technology/version, input method, date and tester. Run against that exact build.
3. Use only synthetic details: **Alex Sample**, **TEST-1042**, **Alex Demo**, **£12.40**. Never enter real identity, financial, eligibility or contact details. All five working exhibits are simulations.
4. For a fresh start use Case index → Reset. The confirmation must remain available while it is read. Cancel must preserve records and restore focus; a second deliberate Erase progress action clears them. Saved downloads remain on disk.

## Actual screen-reader acceptance script

Suggested Windows setup: a current supported NVDA with Chrome or Edge; also run a complementary VoiceOver/Safari session if available. Start the actual reader and confirm its speech/braille output before recording results. NVDA Speech Viewer may help retain **actual spoken output**. DOM/ARIA snapshots are supporting diagnostics only.

Use both browse/reading mode and normal form/focus mode. Record the phrase actually spoken, unexpected silence/repetition, focus destination and any necessary workaround. Do not require a particular reader to pronounce decorative punctuation identically.

| Step | Actions | Expected experience | Actual speech / focus / result |
| --- | --- | --- | --- |
| Landing | Read page title and headings; use landmarks and Skip to main content; reach Case index | Premise explains two independent calls; main is reachable; decorative Split is optional and range has a meaningful name | Pending |
| Index | Read the collection, legacy disclosure and navigation; open Banking | Five cases distinguishable from ten-case archive; the selected investigation title and stage are announced | Pending |
| Explore | Traverse Banking nav, transaction search, detail and transfer error; return to overview | Controls have names/states, validation is perceivable, page replacement leaves useful focus; no keyboard trap | Pending |
| Mark / point | Switch to Mark, read its instructions, use Choose a named region instead, place a mark | Active mode announced; frozen exhibit controls are absent from focus order; named controls give a nonvisual route; count/status updates | Pending |
| Region alternative | Choose Region, select a named region, then edit x/y/width/height numerically | A rectangle can be created and adjusted without dragging; fields have distinct labels; no sight-dependent compulsory step | Pending |
| Edit / delete | Write and edit Marker 1 observation; add another; remove each | Notes remain readable; deletion restores focus to a surviving note or instrument; updates do not flood speech on every keystroke | Pending |
| First judgment | Continue, choose a verdict, confidence and written reason; seal | Required fields and selected states understandable; no implicit verdict/confidence; new stage focus announces context | Pending |
| Context | Open each document and read its provenance/body; take second look | Expanded state conveyed; authored/hypothetical nature is clear; original judgment remains intact | Pending |
| Second judgment | Complete the refund/£12.40 task, Mark, describe evidence, submit an unchanged or changed verdict independently | Both decisions remain distinguishable; reaffirmation has no penalty; success does not imply a correct answer | Pending |
| Compare | Complete reflection, open authored jurors; change lens/state; operate Reveal with arrows/Home/End | Each authored reading is available in text, matching region or unavailable-state statement is clear; range has a name/value | Pending |
| Contradiction | Open the equally weighted action-row contradiction; inspect its two readings | Element, competing accounts and uncertainty are readable without seeing colored rectangles | Pending |
| Benefits | First image description/named regions; then trigger validation, follow error link, fill fictional details, interrupt and restore | Static reconstruction/runtime boundary clear; errors and recovery instructions perceivable; summary/link focus useful | Pending |
| Remaining cases | Portfolio motion off/project role/contact; Bulletin filter/shortlist; Fashion size error/bag | Native controls and status/replacement focus remain useful; no outside reading appears in sealed Fashion | Pending |
| Design Eye | Read counts, jump to each saved case, distinguish incomplete/legacy/current records | Anchors preserve application route and move focus; reasons, notes, provenance and paired decisions available as text | Pending |
| Export | Save PNG and Print / Save PDF | Export actions reachable; any failure announced. PNG is an image excerpt, not an accessible full record; PDF/onscreen text alternative available | Pending |
| Reset/recovery | Wait at least ten seconds on reset confirmation, Cancel, reload, then deliberately confirm reset | No reading time limit; cancel preserves exact record; confirmed erase clears only this project; no trapped or lost focus | Pending |

Also inspect forms with navigation by heading, form control and landmark; traverse backward with Shift+Tab; verify inactive/inert snapshots never receive focus. Test denied storage and corrupt data in a disposable profile (existing automated fixtures cover these technically). Record whether the on-screen long report or exported PDF is the preferred accessible reading path. Browser PDF output has not been certified PDF/UA or validated with a reader.

## Physical-device and browser script

Record the exact hardware and browser, including iOS/Android version, browser build, portrait/landscape, accessibility text scale and any connected keyboard. Use actual fingers for the touch rows.

| Task | Expected outcome | Device / browser / actual result |
| --- | --- | --- |
| Cover Split | Finger handle follows drag, ends at bounds; native range remains usable | Pending |
| Banking Explore | Single-finger scrolling works through the full exhibit; nav/search/refund/transfer validation and receipt work | Pending |
| Mark Point | Tap places one point; a vertical swipe scrolls without an accidental mark | Pending |
| Mark Region | Deliberate drag selects rectangle, reverse drag works, pointer release/cancel does not leave a stuck selection; named-region alternative works | Pending |
| Notes | Keyboard opens; note wraps and remains editable; focused control remains visible above keyboard; delete restores useful focus | Pending |
| Modes/context | Explore and frozen Mark clearly separate; context can open without losing first evidence | Pending |
| Resize/orientation | Rotate with a saved mark, use device zoom/text size and browser 200%/400% zoom where supported; no host control/text loss or annotation drift | Pending |
| Captured evidence | Frozen evidence intentionally scales as one image-like coordinate plane; its text description/named controls/notes remain available independently | Pending |
| Reveal | Drag divider both directions, change perspective/state, operate range with external keyboard if available; no geometry drift | Pending |
| Portfolio | Optional motion can be stopped; system reduced motion removes it; native scrolling/contact work | Pending |
| Benefits/Fashion | Error recovery, interruption, size selection and local bag work; no real submission/payment | Pending |
| Resume | Reload, go back/forward, reopen each saved investigation and Design Eye; verify local notes and independent judgments | Pending |
| Export/print | Actual saved PNG opens, full PDF includes lower Banking rows and all saved notes; no clipping. Record platform download/share behavior and pages | Pending |

On stable Firefox and Safari, complete all five investigations. Test changed and unchanged verdicts, open curated contradictions and sealed deep links. Include 1440×900, 768×1024 and 390×844 where that hardware/window supports them; record actual CSS dimensions. Check console/resource failures where developer tools permit. A Windows WebKit build would not establish Safari acceptance.

## First-time visitor protocol (approximately 25–35 minutes)

**Objective:** understand whether first-time visitors grasp the premise, inspect/annotate evidence, understand the Second Look, read their judgment history and identify confusing or memorable interactions. This is formative evaluation, not a test of their design expertise or a proof of population-level benefit.

**Recruitment:** aim for about five adults who have not used the project; include designers/design students and people without formal design experience. Ask about relevant accessibility needs and provide their preferred input/assistive technology. Do not imply five sessions establish accessibility or statistical validity.

**Consent/privacy:** explain participation is voluntary, stopping/skipping is permitted and this evaluates the interface. Obtain separate explicit consent for recording. Default to anonymous written observations (P01–P05); do not record names, employment, medical history or private notes in the repository/ZIP. Agree retention/deletion with the participant before starting. Use a fresh disposable profile. Participant writings are local but visible to others using that profile; exported files need separate handling/deletion.

**Introduction (read verbatim):** “This project asks you to inspect an interface, record evidence and make a judgment. Later you can open context and make another judgment. There is no right answer, and keeping your first judgment is valid. We are testing the interface, not you. Please say what you are trying to do and what you expect. You can stop or skip anything. Please use only the fictional details supplied.”

**Tasks:** avoid explaining the controls before the participant has a chance to find them.

1. “From this opening, tell me what you think the project asks you to do. Start whichever investigation interests you.” Observe interpretation and entry without assistance.
2. “Inspect the interface and save an observation about something that supports your view. Adjust or edit it if you want.” Observe Explore/Mark and named-region discovery. If blocked, record the blockage before a neutral prompt; record every hint.
3. “Make your first judgment. Then continue until you can investigate again, and make your second judgment.” Do not suggest reversing a verdict or a preferred lens. Let the application's own task/context guide interaction.
4. “Show me what stayed the same and what changed. Find another authored reading and, if available, a disagreement about the same element.” Sealed cases have no authored readings; choose Banking for this step if needed and note that moderator intervention.
5. “Find your saved record and explain what its counts mean. Save a copy you could revisit.” Observe report interpretation and export expectations; explain nothing until they have attempted the task.
6. If time permits, try a contrasting case (Benefits vs Portfolio, or Bulletin vs Fashion). Do not require all five; record actual coverage and stop on fatigue.

**Moderator behavior:** ask “What are you trying to do?” or “What did you expect?” Avoid giving a tour, praising a verdict, defending the design or leading a participant to a known feature. Record assistance and distinguish participant statements from your interpretation. Do not infer confidence from speed or mouse movement. Optional task timing is descriptive only and must be actually recorded.

**Observation template (copy for each real participant):**

```text
Participant ID:                  Date:
Consent recorded / recording permission:
Relevant prior experience (optional):
Commit / device / OS / browser / assistive technology:
Task and actual case/stage:
What they tried (observable action):
Expected / actual behavior:
Outcome: completed / assisted / stopped / blocked
Exact quote (only if actually spoken and consented):
Moderator assistance:
Impact / workaround / severity:
Interpretation (keep separate from observation):
Issue / proposed correction / retest result:
Retention / deletion date:
```

**Follow-up questions:** What did you think the Second Look was for? What did Explore and Mark mean to you? Did the context feel informative or push you toward an answer? What does your report say—and what does it not say? Which interaction was confusing, slow or memorable? What would make you return to the record? Ask why without suggesting the desired answer.

**Severity:** P0 = cannot complete or loses data; P1 = substantial access, comprehension or accuracy failure; P2 = recoverable friction; P3 = minor polish. Record impact, frequency and assistance separately. A single severe accessibility/data issue can require action; a repeated preference is not automatically a universal requirement.

**Synthesis:** make one row per observed issue with real participant IDs and actual case coverage. Separate direct observation, quote, moderator interpretation and product decision. Identify disagreement and successful workarounds as well as failures. Do not invent quotes/times or convert agent walkthroughs into sessions. Fix substantive issues, run regression, and repeat affected tasks with actual people. Only after reviewing real results should this gate be marked complete.

## Final sign-off record

```text
Release SHA:
Provenance/public-use reviewer and recorded decisions:
Actual reader/browser/device/version results:
Real participant sessions completed and synthesis location:
Open P0/P1 issues and resolution/retest:
Publication decision and decision-maker/date:
Separate permission for push/deployment/public release:
```

The package is ready for independent review. **Do not interpret its existence, automated PASS results or this blank sign-off template as permission to publish.**

## Excellence-pass study allocation and added tasks

Status: **NOT RUN — zero participants recruited or tested by this pass.** Seek approximately five consented first-time visitors: two with design experience and three without, if available. Do not treat that small convenience sample as representative. Use anonymous IDs P01–P05; keep identities and recordings outside the review package. Existing consent, assistance, severity and retention rules above still apply.

Suggested coverage allocation, not results: P01 Banking on desktop; P02 Benefits on mobile; P03 Portfolio on mobile; P04 Bulletin on desktop; P05 Fashion on mobile. Each visitor then inspects one contrasting case if time allows. For contradiction tasks, Fashion participants need a non-sealed case; record that moderator-directed case change explicitly.

Add these neutral observations to the existing eight-task protocol:

- Case selection: “Find a case you would like to inspect. Show me what you expect to do there.” Observe whether the preview helps, whether mobile Preview and direct entry are distinguishable, and whether keyboard focus changes are understandable.
- Evidence editing: “Return to an observation and adjust it.” Observe selecting a mark versus creating another, the numbered relationship, focus, note visibility, return to exhibit and reaching the next action.
- Mobile stages: “Find your earlier judgment.” Observe discovery of All stages and whether the collapsed rail harms orientation. Do not reveal the control before an unaided attempt.
- Record sharing: “Save a copy for someone who cannot use an image.” Observe discovery and understanding of text HTML versus the one-page excerpt and complete PDF. Do not label the PDF accessible on the participant's behalf.

Record actual behavior, quotes only with permission, every hint and the device/browser. Keep observation separate from interpretation. The current before/after pixel distances are engineering measurements, not participant time savings. No gate closes until real sessions and relevant retests occur.
