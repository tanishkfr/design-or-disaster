# Design or Disaster

An interactive design judgment exercise. Fifteen real-world interface decisions — each reviewed by a panel of five jurors — are presented as investigation cases. You file a verdict. The jury rules. The record is kept.

---

## What it is

Design or Disaster surfaces a question that design criticism rarely asks directly: *does your judgment align with expert consensus, and do you know when it does?*

Each case presents a production interface with no framing. You select a verdict — Strong Design, Needs Revision, or Design Disaster — tag the design principles you identified as evidence, and file your confidence level. Then the jury deliberates in real time: five expert lenses arrive one by one, each with a ruling and reasoning, and the official verdict lands.

After all 15 cases, the **Design Eye** report delivers a forensic read of your pattern. Not just accuracy — the report tracks calibration: whether your confidence tracked your correctness, or whether you were consistently certain when you were wrong, or consistently hedged when you were right.

---

## Cases

Fifteen cases drawn from production interfaces — mobile OS launches, browser redesigns, payment onboarding, classifieds, editorial apps. Brand names are anonymised to eliminate recognition bias. You're judging the design, not the brand.

Each case is classified:

- **Landmark** — historically significant, referenced in design discourse
- **Contested** — the jury divided; no consensus verdict
- **Standard** — clear jury position, moderate complexity

---

## Architecture

Single-page React app. No router, no backend, no auth. State lives in `localStorage` via a custom `useDesignEye` hook.

```
src/
  components/
    ColdOpen/          — first case, tutorial, tone-setter
    Archive/           — case list with landmark/contested/pending sections
    CaseFile/          — evidence review + submission panel
    VerdictChamber/    — jury deliberation sequence + final verdict
    DesignEye/         — intermission reports + final investigation record
  data/
    cases.js           — 15 cases with annotations, juror rulings, curator notes
    jurors.js          — five juror lenses (trust, accessibility, delight, etc.)
  hooks/
    useDesignEye.js    — profile state, submission recording, localStorage persistence
  utils/
    scoring.js         — accuracy and confidence calibration calculations
    reportInsights.js  — pattern detection for the Design Eye report
  styles/
    tokens.css         — design system tokens (color, type, spacing, motion)
    reset.css          — minimal reset + focus-visible styles
```

**View flow:**
```
ColdOpen → Archive → CaseFile → VerdictChamber → [Intermission] → DesignEyeIntro → FinalReport
```

**Profile data shape:**
```js
{
  coldOpenCompleted: boolean,
  casesCompleted: number,
  submissions: [{ caseId, verdict, evidenceTags, confidence, timestamp }],
  accuracyByCategory: { [category]: percentage },
  overallAccuracy: number,
  confidenceCalibration: { highConfidenceAccuracy, lowConfidenceAccuracy },
  inProgressCaseId: string | null
}
```

---

## Stack

- **React 19** — no framework overhead, SPA with `useState` routing
- **Vite 8** — dev server and build
- **CSS Modules** — scoped styles, no utility classes, design tokens via custom properties
- **Fonts** — Instrument Serif (display/verdict), IBM Plex Mono (system/data), Plus Jakarta Sans (body)
- **No external UI library** — every component is purpose-built

---

## Running locally

```bash
git clone https://github.com/tanishkfr/design-or-disaster.git
cd design-or-disaster
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build    # production build
npm run preview  # preview the build
```

---

## Design decisions

**Why juries instead of a single correct answer?**
Most design decisions have reasonable disagreement. A jury of five distinct lenses — business viability, accessibility, user trust, aesthetic coherence, interaction delight — makes the "correct" verdict a weighted consensus, not a single truth. That is more honest about how design is actually evaluated.

**Why track confidence?**
Accuracy alone is an incomplete picture of judgment quality. Someone who is right 70% of the time but always files "very confident" has a different problem than someone who is right 70% of the time and whose confidence accurately tracks their uncertainty. The Design Eye report surfaces the gap between the two.

**Why anonymise brand names?**
Recognition contaminated the judgment in early testing. Knowing it is a specific product activates brand loyalty and reputation bias. Anonymised names let you evaluate the interface, not the company.

**Why no score during the investigation?**
Showing accuracy mid-investigation changes behavior. The report lands with more force when it is the first time you see the pattern.

---

## The Design Eye report

The final report detects one of six patterns from your submission history:

| Pattern | Signal |
|---|---|
| **Overconfident** | High confidence, below 50% accuracy on those cases |
| **Underconfident** | High accuracy at low confidence — found it, did not claim it |
| **Calibrated** | Confidence tracked correctness in both directions |
| **Accurate** | 80%+ alignment with consensus across the full archive |
| **Divergent** | Consistent disagreement with expert consensus |
| **Neutral** | No dominant signal |

The report also notes contested case performance and any pronounced lean — a skeptic's record vs. a generous read of the archive.

---

## License

MIT
