export const JURORS = [
  {
    lens: 'hierarchy',
    title: 'The Scanner',
    focus: 'Visual flow, attention, information ordering',
    voice: 'Analytical. Speaks in terms of attention, competition, and visual weight.',
  },
  {
    lens: 'accessibility',
    title: 'The Advocate',
    focus: 'Inclusion, readability, barriers to access',
    voice: 'User-focused. Speaks for those the design may exclude.',
  },
  {
    lens: 'usability',
    title: 'The Operator',
    focus: 'Task completion, friction, efficiency',
    voice: 'Practical. Evaluates whether the interface lets people do the thing.',
  },
  {
    lens: 'trust',
    title: 'The Skeptic',
    focus: 'Credibility, safety signals, user confidence',
    voice: 'Suspicious. Notices what is missing as much as what is present.',
  },
  {
    lens: 'delight',
    title: 'The Romantic',
    focus: 'Emotion, personality, memorable moments',
    voice: 'Contrarian. Often defends what others condemn, and vice versa.',
  },
];

export const JUROR_BY_LENS = Object.fromEntries(
  JURORS.map((j) => [j.lens, j])
);
