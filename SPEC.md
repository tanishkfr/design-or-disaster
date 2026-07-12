# SPEC.md — Design or Disaster

## Project Identity

**Name:** Design or Disaster  
**Tagline:** Commit to a verdict before the experts disagree.  
**Type:** Interactive design judgment experience  
**Portfolio role:** The portfolio project about ruling under disagreement.

### The Core Distinction
Design or Disaster asks: *What does your eye notice before anyone teaches you how to look?*

Atlas teaches transferable reasoning shapes for interaction questions. Design or Disaster does not. It withholds the method until after the user has already ruled. The contribution is commitment under disagreement: the user discovers which critical lens they reached for first.

This is not a quiz. It is not a course. It is a design investigation archive where users build a Design Eye profile through evidence-based critique of real interfaces.

---

## Problem Statement

Design critique feels subjective and intimidating to most people — including working designers. There is no training ground for judgment. You either absorb it through osmosis or you don't. Design or Disaster makes judgment trainable by turning it into an investigation: examine the evidence, form a verdict, then see how the experts rule.

**The emotional takeaway:** *"I had to rule before I was ready, and then I understood what my eye values."*

---

## User Experience Overview

### Session Flow
```
Landing → Case Archive → Case File → Submission → Verdict Chamber → Design Eye Report
```

### Session Structure
```
Case 01 → Case 02 → Case 03 → Intermission Report
Case 04 → Case 05 → Case 06 → Updated Design Eye Assessment
...continue through 12–15 cases
```

Each case is a complete investigation arc:
1. **Observe** — examine the screenshot cold, no hints
2. **Build a case** — select verdict, tag evidence, rate confidence
3. **Enter the chamber** — jurors deliberate and deliver their rulings
4. **Receive the critique** — each juror's reasoning is revealed
5. **See the final verdict** — X/5 jurors vote

---

## Case File Structure

### Case Anatomy
- Case number and title (e.g. `CASE #007 — Spotify Checkout Flow`)
- One primary static screenshot (no video, no interaction)
- Brief context line (e.g. "E-commerce checkout, mobile web, 2023")
- Category tag (e.g. `Visual Hierarchy`)
- Submission area
- Reveal / Verdict Chamber (locked until submitted)

### Case Library — V1 (15 Cases)
| Category | Count |
|---|---|
| Visual Hierarchy | 3 |
| Accessibility | 2 |
| Forms & Inputs | 2 |
| Navigation | 2 |
| Information Architecture | 2 |
| Delight vs Usability Tradeoffs | 2 |
| Wildcard / Controversial | 2 |

**Controversial cases are mandatory.** Some interfaces won awards but users struggled. Some broke every rule and people loved them. These are the cases users remember.

---

## Submission Phase

The user builds a case before receiving any expert input. Three-part submission:

### 1. Overall Verdict (required, pick one)
- Strong Design
- Needs Revision
- Design Disaster

*Note: "Controversial Case" is NOT a verdict option. Controversy is a property of the judgment process, not a judgment itself. It emerges from the jury — the user never pre-labels a case controversial.*

### 2. Evidence Tags (required, select 1–3)
- Visual Hierarchy
- Accessibility
- Navigation
- Information Architecture
- Clarity
- Consistency
- Feedback
- Trust
- Cognitive Load

### 3. Confidence Rating (required, pick one)
- Guessing
- Somewhat Sure
- Confident
- Very Confident

*Confidence calibration matters. "Confidently wrong" is the most instructive — and memorable — state.*

---

## The Jury System (Reveal)

The jury is a **storytelling device**, not community voting.

### The Five Jurors
Each juror is a **distinct viewpoint, not a character**. Memorable through reasoning, not branding. No avatars, no faces, no bios. The personality emerges from how they rule — and they disagree.

| Lens | Title | Focus | Voice |
|---|---|---|---|
| **Hierarchy** | The Scanner | Visual flow, attention, information ordering | Analytical. "The primary action competes with secondary content." |
| **Accessibility** | The Advocate | Inclusion, readability, barriers | User-focused. "Users with low vision may struggle here." |
| **Usability** | The Operator | Task completion, friction, efficiency | Practical. "The path forward is unclear." |
| **Trust** | The Skeptic | Credibility, safety signals, confidence | Suspicious. "Important information appears too late." |
| **Delight** | The Romantic | Emotion, personality, memorable moments | Contrarian. "Despite the friction, the experience feels remarkably human." |

The tension between jurors — particularly The Romantic vs The Operator — is the core learning mechanism. Users begin recognising patterns: *"Delight likes this but Usability hates it."* That's when the jurors become memorable.

### Reveal Sequence (animated, sequential)
1. Screenshot transitions into annotated mode — problem areas highlight with evidence markers
2. Jurors arrive one by one, each delivering a one-sentence ruling:
```
HIERARCHY       Guilty — primary CTA is visually buried
ACCESSIBILITY   Not Guilty — contrast ratios pass WCAG AA
USABILITY       Guilty — form labels are ambiguous
TRUST           Mixed — checkout lacks security signals
DELIGHT         Not Guilty — microcopy is warm and clear
```
3. Final verdict appears:
```
4 / 5 JURORS VOTE:
NEEDS REVISION
```

### Two-Layer Outcome System

Every case produces two outputs: a **Verdict** and a **Status**. These are independent.

**Verdict** — what the jury decides:
- Strong Design
- Needs Revision
- Design Disaster

**Status** — how the jury got there:
- **Consensus** — 4–5 jurors aligned
- **Contested** — 2–3 split; jury genuinely divided
- **Landmark** — historically significant; the design community debated this publicly

Examples:
```
Verdict: Needs Revision   |   Verdict: Needs Revision
Status:  Consensus        |   Status:  Contested
```
The second instantly feels more interesting. Same verdict, completely different story.

### Reveal Sequence — Consensus Case (animated, sequential)
1. Screenshot transitions to annotated mode — problem areas highlight with evidence markers
2. Jurors arrive one by one, each delivering a one-sentence ruling:
```
THE SCANNER     Guilty — primary CTA is visually buried
THE ADVOCATE    Not Guilty — contrast ratios pass WCAG AA
THE OPERATOR    Guilty — form labels are ambiguous
THE SKEPTIC     Guilty — checkout lacks security signals
THE ROMANTIC    Not Guilty — microcopy is warm and clear
```
3. Final verdict appears:
```
4 / 5 JURORS VOTE:
NEEDS REVISION
STATUS: CONSENSUS
```

### Reveal Sequence — Contested Case (special treatment)
Contested cases feel fundamentally different from normal cases. The tension is inside the jury, not just between user and result.

```
THE SCANNER     Guilty
THE ADVOCATE    Guilty
THE OPERATOR    Guilty
THE ROMANTIC    Not Guilty
THE SKEPTIC     Not Guilty
```

Instead of a clean verdict stamp, the system presents:
```
JURY SPLIT

3 / 5 VOTE: NEEDS REVISION
2 / 5 VOTE: STRONG DESIGN

The interface delivers a memorable emotional experience,
but introduces measurable usability friction.

The design community remains divided.

VERDICT: NEEDS REVISION
STATUS: CONTESTED
```

Normal cases end with certainty. Contested cases end with discussion. That's the distinction.

### Authored vs Dynamic Controversy
For V1: **all controversy is authored**. The interesting part is writing it, not calculating it. Contested cases are pre-designated — Snapchat redesigns, Craigslist, brutalist portfolios, award-winning interfaces users struggled with. Dynamic contest detection (triggered by vote math) is a V2 consideration.

---

## Design Eye System

### What It Tracks
Not points. Perception quality.

| Metric | Description |
|---|---|
| **Accuracy** | Did your verdict align with the final ruling? |
| **Confidence Calibration** | Were you right when confident? Wrong when guessing? |
| **Category Strength** | Which principles do you detect most reliably? |

### Design Eye Report (after every 3 cases)
```
DESIGN EYE REPORT — INTERMISSION

Observation         Strong
Hierarchy Detection Excellent
Accessibility       Developing
Overconfidence Risk High
```

This is the shareable artifact. Not a score. A profile.

### Category Tracking (shown after 6+ cases)
```
Hierarchy           ████████░░  82%
Accessibility       █████░░░░░  54%
Navigation          ███████░░░  71%
Trust               ████████░░  80%
Information Arch.   ██████░░░░  63%
```

---

## Landing Experience

The landing does not explain the project. It **demonstrates the premise**.

The goal is not curiosity or excitement. The goal is **productive self-doubt** — the good kind that makes someone lean forward.

Emotional arc:
```
0–5s    Confidence      "I know design."
5–15s   Uncertainty     "Wait... maybe I don't."
15–30s  Curiosity       "I need to know why."
```

Once someone feels that, they're emotionally invested in improving. That's the exact feeling the rest of the project is built around.

### The Cold Open

The user arrives. The screen is dark. No navigation. No project description. No "welcome to" copy.

One screenshot. Centred. No annotation.

```
CASE #001
Verdict Pending
```

One question beneath it:

```
What do you think?
```

Four verdict options. Nothing else.

The moment they hesitate — you've won. Because now they're participating, not reading.

### After First Submission

The interface does not reveal the case result immediately. Instead:

```
You are not being tested.

You are training judgment.
```

Brief. Dark. Then it transitions into the archive.

The project has now earned its explanation. The user understands what they're doing because they've already done it.

### What This Achieves
- Turns the user into the subject of the experiment from second one
- Demonstrates the premise rather than explaining it
- Creates the humility needed to engage seriously with the rest of the experience
- Makes the project feel categorically different from every quiz and UX course they've seen

### Case Archive (Post-Landing)
After the cold open, the user enters the archive. Cases appear as a grid of file cards. Status indicators show which cases are resolved, contested, or landmark — even before the user opens them. The archive feels like a living catalogue, not a lesson list.

```
CASE #003   RESOLVED
CASE #007   CONTESTED
CASE #012   LANDMARK
CASE #014   RESOLVED
```

The archive is the destination. The cold open is the door.

---

### Feeling
Investigative. Editorial. Authoritative. Evidence-based.  
*Not* a game. *Not* a textbook. A design review archive.

### Reference Points
- Apple Human Interface Guidelines documentation
- Case study files and design critiques
- Figma inspection panels
- Editorial design magazines
- Evidence boards and case folders

### Typography Stack
```
CASE #014            → Monospace (IBM Plex Mono or Geist Mono)
Spotify Checkout     → Editorial Serif (Instrument Serif italic)
Evidence & Analysis  → Clean Sans (Plus Jakarta Sans)
```

### Colour System
Inherits T* DNA but with its own register:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0908` | Base — slightly colder than T* bg |
| `--surface` | `#141210` | Card/case file surface |
| `--surface-raised` | `#1C1916` | Juror cards, evidence panels |
| `--border` | `#2E2A25` | Dividers, file edges |
| `--text-primary` | `#F0EAD6` | Body text (T* standard) |
| `--text-secondary` | `#8A8278` | Meta, case numbers |
| `--verdict-guilty` | `#C8432A` | Guilty ruling, disaster |
| `--verdict-clear` | `#4A8C5C` | Not guilty, strong design |
| `--verdict-mixed` | `#C4882A` | Mixed ruling, controversy |
| `--accent` | `#F5A623` | T* amber — highlight moments only |

### Motion Principles
- **Slow. Intentional. Confident.** No bounces. No gamified feedback.
- Evidence cards **slide into place** — like documents being placed on a table
- Verdict stamp **appears with weight** — not a pop, a press
- Juror votes **arrive sequentially** — 400ms stagger, deliberate
- Screenshot annotations **fade in** — not revealed all at once
- Overall feel: **documentary**, not game show

### Textures
Very subtle. Atmosphere, not decoration.
- Light paper grain on case file surfaces
- Optional scanline noise overlay at ~3% opacity
- Blueprint-style horizontal rule dividers
- No skeuomorphic elements

---

## Technical Specification

### Stack
- **Framework:** React + Vite (same as Design Dial)
- **Styling:** CSS Modules
- **Data:** Cases as static JSON/JS objects — no CMS, no API
- **Persistence:** localStorage for Design Eye profile
- **AI:** None required — all content is pre-authored
- **Deploy:** Vercel

### Data Model

```typescript
// Case
type Case = {
  id: string                    // "case-007"
  number: string                // "CASE #007"
  title: string                 // "Spotify Checkout Flow"
  context: string               // "Mobile web checkout, e-commerce, 2023"
  category: Category
  screenshot: string            // path to image asset
  officialVerdict: Verdict      // "strong_design" | "needs_revision" | "design_disaster"
  caseStatus: CaseStatus        // "consensus" | "contested" | "landmark"
  contestedSummary?: string     // only for contested cases — one paragraph explaining the split
  jurorRulings: JurorRuling[]   // one per juror, 5 total
  annotations: Annotation[]     // overlaid on screenshot post-reveal
}

// Juror
type Juror = {
  lens: "hierarchy" | "accessibility" | "usability" | "trust" | "delight"
  title: "The Scanner" | "The Advocate" | "The Operator" | "The Skeptic" | "The Romantic"
}

// Juror Ruling
type JurorRuling = {
  juror: Juror
  ruling: "guilty" | "not_guilty" | "mixed"
  reasoning: string             // one sentence, in the juror's voice
}

// User Submission
type Submission = {
  caseId: string
  verdict: Verdict
  evidenceTags: EvidenceTag[]
  confidence: Confidence
  timestamp: number
}

// Design Eye Profile
type DesignEyeProfile = {
  coldOpenCompleted: boolean
  casesCompleted: number
  submissions: Submission[]
  accuracyByCategory: Record<Category, number>
  overallAccuracy: number
  confidenceCalibration: number  // % correct when "Confident" or "Very Confident"
}
```

### Component Architecture
```
App
├── CaseArchive          # Grid of all cases, shows completion state
├── CaseFile             # Full case view
│   ├── CaseHeader       # Number, title, context, category
│   ├── ScreenshotViewer # Clean → annotated transition
│   ├── SubmissionPanel  # Verdict + tags + confidence
│   └── VerdictChamber   # Juror reveal sequence (locked pre-submission)
│       ├── JurorCard    # Individual juror + ruling
│       └── FinalVerdict # X/5 vote + verdict stamp
├── DesignEyeReport      # Intermission + final report
│   ├── AccuracyRing
│   ├── CategoryBars
│   └── ProfileSummary
└── Landing              # Archive intro / first-time experience
```

### Screenshot Annotations
Post-submit, the screenshot transitions to annotated mode. Annotations are stored as relative coordinates in the case data:
```typescript
type Annotation = {
  x: number           // 0–100 (percentage of image width)
  y: number           // 0–100
  width: number
  height: number
  label: string       // "CTA buried below fold"
  juror: Juror        // which juror flagged this
  type: "guilty" | "not_guilty" | "mixed"
}
```

---

## Content Strategy

### Screenshot Sourcing
- Public UI screenshots from Mobbin, Screenlane, Dribbble, personal archive
- Mix of: well-known apps, lesser-known products, old interfaces, recent redesigns
- Avoid: trademarked logos that could cause issues — crop or blur where needed

### Case Writing Guidelines
- Context line: 10 words max
- Juror reasoning: one sentence, specific and principle-grounded
- No hedging — jurors are authoritative
- Controversial cases explicitly acknowledge the split: *"This interface divided the design community."*

---

## V1 Scope (Build Boundary)

### In Scope
- 15 pre-authored cases
- Full submission → reveal flow
- Jury system with 5 jurors
- Design Eye profile with accuracy + confidence calibration
- Intermission reports (every 3 cases)
- Case archive view
- localStorage persistence

### Out of Scope (V2+)
- User-submitted screenshots
- Community voting layer
- Shareable Design Eye card (social export)
- Filter/sort cases by category
- Time-based challenges

---

## Success Criteria

**User spends 10–15 minutes and remembers it weeks later.**

Secondary signals:
- At least one "I was wrong and I didn't expect that" moment per session
- Controversial cases generate opinions the user wants to share
- Design Eye Report feels like a genuine self-assessment, not a score
- The experience feels qualitatively different from any quiz or course they've encountered

---

*SPEC.md complete. Next: DESIGN.md*
