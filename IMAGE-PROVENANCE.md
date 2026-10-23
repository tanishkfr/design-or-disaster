# Image provenance and public-review inventory

23 October 2026 · Current final-fixes snapshot. This is an evidence inventory, not a blanket rights opinion or a license grant. Earlier inventories remain available on the preserved local development branch.

## Current disposition

All ten shipped JPEGs have authored construction sources: seven pre-existing HTML/CSS reconstructions and three new original fictional replacements. No model-generated raster, stock image, real contact record or new third-party visual asset was introduced. Dimensions, hashes, sizes and EXIF were checked in the local `output/final-fixes/asset-inventory.json`.

| Asset | Current source / public-review disposition |
| --- | --- |
| case-001.jpg | Pre-existing authored finance reconstruction; matching source at Git commit `6b9480b`. Unchanged from verified public main. Cover/social metadata reuse it. Merchant labels are not an affiliation claim. |
| case-004.jpg | Pre-existing authored news reconstruction; matching HTML/CSS at `6b9480b`. Unchanged from public main. Visible news branding is pre-existing, not a newly licensed asset; branding/public-site treatment remains an owner review item. |
| case-005.jpg | Pre-existing authored travel reconstruction with CSS destination swatches; unchanged from public main. No imported travel photographs. |
| case-006.jpg | Pre-existing authored Benefits reconstruction; unchanged from public main. Fictional example service, errors and warning; neither government behavior nor measured outcomes. Used in Second Look and exports. |
| case-009.jpg | Pre-existing authored OS reconstruction with code-native icon geometry; unchanged from public main. Recognizable Apple/iOS conventions are pre-existing, not an authenticated historic release or a new rights grant. Public-site branding treatment remains an owner review item. |
| case-010.jpg | Pre-existing authored fictional portfolio reconstruction; unchanged from public main. Still image cannot demonstrate runtime motion. |
| case-015.jpg | Pre-existing authored fictional fashion reconstruction and CSS garment geometry; unchanged from public main. No imported garment photography. |
| case-002.jpg | **REPLACED.** Original fictional Flare ranked-friends exhibit, 249×576. Invented numbered contacts, letter-circle avatars and original purple hierarchy. No names, avatars, logo or pixels from the supplied social capture. Source: `public/reconstructions/case-002.html`. |
| case-011.jpg | **REPLACED.** Original fictional Open Self form, 570×364. Two selectors and a vocabulary grid, with no personal response or third-party credit/logo/image. Source: `public/reconstructions/case-011.html`. Standard identity terms are exhibit content, not personal data. |
| case-012.jpg | **REPLACED.** Original fictional Bulletin category directory, 1440×900. Invented districts and authored category content; no Craigslist logo, source capture, real address, listing or seller data. Source: `public/reconstructions/case-012.html`. The live Second Look Bulletin remains separate. |

The three replacements are rendered from inspectable HTML/CSS by `scripts/reconstruct-public-exhibits.mjs`, using installed system typography and no network assets. They preserve the investigation questions and the original image proportions. Named targets and authored regions were reviewed against the new semantic areas. No historical visitor mark or judgment is migrated, rewritten or retrospectively reinterpreted.

## Supplied captures: not cleared, not newly published

| Former asset | Unresolved issue | Disposition |
| --- | --- | --- |
| Former case-002 social capture | Contact names/avatars; unknown acquisition, permission and consent | Not cleared. Replaced in the current project. Preserved only in existing historical material; excluded from newly exposed PR objects. |
| Former case-011 identity capture | Visible Pink News credit without traceable permission | Not cleared. Replaced, rather than treating attribution as a license or stripping the credit from the same image. |
| Former case-012 classifieds capture | Recognizable Craigslist capture with unknown acquisition/permission | Not cleared. Replaced by original fictional category content, not by blurring or renaming the captured product. |

Verified public `main` at `5ded59cbc51db7197ba5eee7ecd8a70a2787b073` already contains all three former blobs: `ed352a75461d58409bb803a1c59ec8631bc21dd6`, `76e0e50ecd48c298448ce6d4499e745ef538cdcf`, `39562107fa3a9f87b06ab312b12732be89824086`. This task does **not** erase or clear that already-public history. It does not force-push the repository. The public PR must be one reviewed snapshot whose sole parent is verified remote main; none of the eleven unpublished intermediate v2 commits is imported.

## Saved-record boundary

Affected legacy cases and saved panel comparisons display an image-replacement notice. Existing notes and percentage coordinates remain byte-for-byte unchanged and may refer to the former exhibit. The replacement shares semantic areas and proportions, but is not represented as the image originally judged. The supplied pixels are not redistributed as a compatibility fallback. New judgments use the current fictional reconstruction. This is a transparent artifact revision, not a silent rewrite of a participant record.

## Other visuals

- `public/previews/`: actual opening captures of the authored live exhibits; Benefits renders its authored reconstruction. Bulletin preview does not reuse either the old or replacement legacy directory.
- `public/favicon.svg`: inspectable project-native D/D slash geometry.
- Working exhibit garment SVGs, CSS project tiles, annotation graphics and PNG export backgrounds: inspectable authored code.
- `portfolio-case-study/media/`: twelve actual app screenshots or synthetic export/comparison images. Reviewed frames contain authored v2 exhibits, not the three former supplied captures. The case-study gallery is illustrative, not a source-image library.
- Font binaries are not redistributed. Application font requests to Google Fonts remain disclosed. Official license references: [Archivo](https://github.com/google/fonts/blob/main/ofl/archivo/OFL.txt), [Instrument Serif](https://github.com/google/fonts/blob/main/ofl/instrumentserif/OFL.txt), [IBM Plex Mono](https://github.com/google/fonts/blob/main/ofl/ibmplexmono/OFL.txt). Those font licenses do not license depicted products.

## Public-content gate and remaining limits

Only reviewed current source, original new media and approved documentation may enter the clean public snapshot. Exclude raw `output/`, review ZIPs, browser profiles/caches, local launch configuration, root untracked images and participant data. New reachable blobs must be checked against the former capture IDs and all excluded local-only binary IDs. Text must be scanned for credentials and private details. Review staged changes and Git objects before publication; record the exact result in FINAL-REVIEW-HANDOFF.md.

This resolves the three supplied-capture issues for the **new PR content by replacement**, not by establishing permission for the originals. Existing recognizable branding in two unchanged public-base reconstructions remains separately disclosed for a later website-publication decision. Actual screen-reader, physical-device, Safari, stable Firefox and participant validation remain open. A draft code-review PR is not website-launch authorization.
