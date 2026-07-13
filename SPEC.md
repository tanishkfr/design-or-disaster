# Design or Disaster? - Product Contract

## Product identity

Name: Design or Disaster?
Type: interactive spatial-critique archive
Core question: What does a design judgment select as evidence before it becomes a verdict?

The product turns design criticism into an inspectable sequence. A visitor locates evidence before filing a verdict, then compares their plate with five authored and incompatible readings of the same interface.

This is not a quiz, course, expert-consensus score, or empirical research result.

## Experience paths

### Five-minute exhibit

1. Cold open: construct Plate 00 on Case 001.
2. Contested case: review Case 010 and see five plates disagree.
3. Sealed case: review Case 015 without outside judgment.
4. Design Eye record: receive a lens trace that preserves ties.

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
- for the sealed case, no juror plate or official interpretation;
- a curator note that opens only after the visitor files a ruling.

## Evidence Plate 00

The visitor must:

1. choose one lens: hierarchy, accessibility, usability, trust, or delight;
2. place at least one spatial mark;
3. describe what the mark makes visible;
4. state what the plate proves;
5. file a verdict.

Input methods:

- pointer or touch on the image;
- keyboard cursor moved with arrow keys and placed with Enter or Space;
- named interface-region buttons.

Marks stay aligned to screenshot-relative percentages so the same coordinates survive responsive resizing and plate comparison.

## Overlaid jury

Plates 01-05 map one-to-one to the five jurors. Each tab changes the visible lens while keeping all annotations on a shared screenshot. The ALL tab opens the literal five-plate overlay after every plate is available.

The verdict cannot arrive until the visitor opens another plate. A control can reveal all five arrivals immediately; timed arrivals never overwrite that action.

## Verdict rules

- Pending archive cards reveal no official case status.
- Curator notes appear only after submission.
- Contested displacement collapses on narrow screens.
- The visitor's ruling is shown alongside, not graded against, the panel.
- A sealed case never reveals a panel result.
- Confidence is always self-reported; time and pointer movement do not infer it.

## Design Eye rules

The report counts the visitor's selected evidence lenses. It may describe a unique strongest or weakest lens only when one exists. Shared maxima, shared minima, and fully balanced records remain explicit ties.

The report may quote back the visitor's own written evidence. It must not claim diagnostic or population-level validity.

## Persistence

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
