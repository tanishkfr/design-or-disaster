# Design or Disaster? - Product Contract

## Product identity

Name: Design or Disaster?
Type: interactive spatial-critique archive
Core question: What does a design judgment select as evidence before it becomes a verdict?

The product turns design criticism into an inspectable sequence. A visitor locates evidence before filing a verdict, then compares their evidence map with five authored and incompatible perspectives of the same interface.

This is not a quiz, course, expert-consensus score, or empirical research result.

## Current scope — Phase 2.2

The primary experience is the five-case Second Look collection: case-001, case-006, case-010, case-012, case-015. The ten-case archive and short single-look route below are preserved compatibility paths. They retain independent legacy judgments.

Each investigation has unclassified first evidence, an independently sealed first judgment, explicit provenance-labeled context, second evidence and judgment, and a neutral reflection. No verdict is preferred. Four first looks use live exhibits; Benefits starts from the supplied image. Each live capture freezes state and logical dimensions before marking. A supplied image and a live reconstruction have separate geometry.

Exhibit capabilities declare identity, case association, interactions, states, Explore/Mark modes, context dependencies, annotation compatibility, recovery and accessibility alternatives. Banking uses fictional transactions and transfer validation; Portfolio uses finite optional motion, projects and contact navigation; Benefits uses validation, interruption and recovery; Bulletin uses filtering and a shortlist; Fashion uses size validation and a local bag. Nothing is sent to a real service.

Perspective comparisons use five authored readings and curated, evidence-linked contradictions. Regions absent from a captured state are explicitly unavailable; no geometry is invented to fill a layer. The sealed finale has no authored positions, contradictions, vote, correctness score or hidden result.

Design Eye counts only actual current records and explicit classifications. Verdict changes, wording comparisons and ordinal self-reported confidence changes are descriptive counts. Ties, unclassified marks, incomplete records and legacy single-look submissions remain explicit. Historical attempts remain readable within investigations and are excluded from current-attempt counts.

PNG export is a compact editorial summary with actual reasons and labeled evidence excerpts. Browser print / PDF includes every marked captured state, note, submitted judgment, opened context document and reflection. Exports include methodology and simulation boundaries.

Hash routes support reload and browser history. The original short path retains its path marker after reload. Persistence keeps the Phase 2.1 schema version and Benefits configuration version, without migrating or deleting prior records.

## Experience paths

### Five-minute version

1. Optional opening: review Case 001 in the original single-look archive.
2. The five-minute button opens Case 010 directly, where five authored perspectives disagree.
3. Sealed case: review Case 015 without outside judgment.
4. Legacy Design Eye record: receive a lens trace that preserves ties. Existing opening-case progress remains untouched.

### Full investigation

The archive contains ten cases across three movements. Visitors can choose any unlocked case, return to the archive between rulings, meet the panel after the early cases, receive one midpoint intermission, and close with the sealed case.

## Case contract

Every case contains:

- stable id, docket number, title, movement, category, context, and status;
- one screenshot with an exact aspect ratio and descriptive alternative;
- named evidence targets for non-pointer input;
- verdict options: Strong Design, Needs Revision, Design Disaster;
- one required written ruling;
- self-reported confidence after the cold open;
- for every non-sealed case, five juror rulings and five spatial annotations;
- for the sealed case, no panel perspective or official interpretation;
- a curator note that opens only after the visitor files a ruling.

## Evidence map

The visitor must:

1. choose one lens: hierarchy, accessibility, usability, trust, or delight;
2. place at least one spatial mark;
3. describe what the mark makes visible;
4. state what the evidence shows;
5. file a verdict.

Input methods:

- pointer or touch on the image;
- keyboard cursor moved with arrow keys and placed with Enter or Space;
- named interface-region buttons.

Marks stay aligned to screenshot-relative percentages so the same coordinates survive responsive resizing and perspective comparison.

## Legacy panel comparison

Five perspectives map one-to-one to the five jurors. Each tab changes the visible lens while keeping all annotations on a shared screenshot. The Combined tab shows every perspective after all five are available.

The verdict cannot arrive until the visitor opens another perspective. A control can show all five perspectives immediately; timed arrivals never overwrite that action.

## Legacy verdict rules

- Pending archive cards reveal no official case status.
- Curator notes appear only after submission.
- Contested displacement collapses on narrow screens.
- The visitor's ruling is shown alongside, not graded against, the panel.
- A sealed case never reveals a panel result.
- Confidence is always self-reported; time and pointer movement do not infer it.

## Legacy Design Eye rules

The report counts the visitor's selected evidence lenses. It may describe a unique strongest or weakest lens only when one exists. Shared maxima, shared minima, and fully balanced records remain explicit ties.

The report may quote back the visitor's own written evidence. It must not claim diagnostic or population-level validity.

## Legacy profile persistence

Browser-local storage contains:

- completed submissions;
- cold-open completion;
- panel/intermission milestones;
- in-progress case id.

Reset requires an explicit second action and clears only this local profile.

## Accessibility contract

- semantic main landmark and skip link on every view;
- visible keyboard focus;
- 44px minimum interactive targets where space permits;
- image descriptions plus named region alternatives;
- live status only where state changes;
- reduced-motion support and skippable timed sequences;
- no horizontal overflow at narrow viewports;
- no color-only distinction for verdict labels.

## Visual contract

The visual language is an investigative archive: near-black surfaces, warm paper text, amber evidence marks, restrained juror colors, mono metadata, and serif editorial headlines. Screenshot treatments may frame evidence but must not obscure legibility.

## Content and provenance

Juror positions, annotations, case framing, and curator notes are authored. Interface images combine original reconstructions and recognizable historical critique objects. Product copy must not present these artifacts as live expert data or source-product ownership.

## Verification

npm run check must pass before release. The check covers linting, case and juror invariants, annotation bounds, evidence alternatives, screenshot existence, common encoding corruption, CSS-module selector references, and a production build.


## Phase 2.1 — Second Look contract

The Benefits Form configuration remains compatible with its Phase 2.1 records. Phase 2.2 adds the other four declared investigations through src/investigation/capabilities.js; the remaining archive cases retain the legacy contracts above. The expanded path is FIRST_LOOK -> FIRST_JUDGMENT -> CONTEXT -> SECOND_LOOK -> SECOND_JUDGMENT -> REFLECTION -> COMPLETE.

First Look has no preselected lens. One described point or rectangle is sufficient; lens classification is optional. Both judgments require an explicit verdict, written reasoning and self-reported confidence. Submitting a judgment seals a deep snapshot; earlier steps can be read but cannot rewrite it. Keeping the same verdict is valid.

Context items preserve their IDs and provenance labels. The form's behavior is an authored simulation. Explore exposes the controlled form; Mark captures its state, logical width and height. Marks belong to a captured frame ID. Reflow is prevented when replaying that frame. Incompatible original and reconstruction states are displayed separately in reflection.

The versioned design-disaster-investigations-v1 storage key holds active records and completed-attempt history. The original design-eye-profile remains readable. Completion projects one case into archive progress; an existing v1 ruling is preserved rather than overwritten. No legacy record receives invented second-look data. Stale revisions and malformed saved records are rejected without overwriting the newer or unreadable data.

New attempts need confirmation. Completed attempts remain readable in history. Global profile reset remains an explicit two-action erase and also clears the new investigation store. The five-minute path retains v1 behavior. The sealed case also has an independent Second Look route without outside interpretations.

Cross-case analysis, the five-case collection, curated contradictions and report exports are delivered in Phase 2.2. See PHASE-2.2-HANDOFF.md. PHASE-2.1-HANDOFF.md remains the historical engine checkpoint.
