# Design or Disaster?

Design criticism as incompatible perception.

Design or Disaster? is a research-through-design web experience in which the visitor files a spatial evidence plate before seeing how five fallible jurors read the same interface. It is not a quiz and it does not grade the visitor against an expert consensus.

Every plate shares one coordinate system. Changing lenses changes what counts as evidence; the visitor's marks remain visible beneath the comparison. The final sealed case opens no outside plate.

## Experience paths

- Five-minute exhibit: cold open, one contested case, then the sealed case.
- Full archive: ten cases across three movements, with an intermission and a final investigation record.
- Returning visitors: progress and rulings persist in browser-local storage.

## Interaction

Look -> choose a lens -> mark evidence -> rule -> seal -> compare plates.

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

The check command runs linting, project-specific content and asset validation, and a production build.

See CASESTUDY.md for the design argument and SPEC.md for the current product contract.
