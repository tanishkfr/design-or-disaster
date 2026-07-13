const LENSES = {
  hierarchy: { title: 'Hierarchy', description: 'what the composition made dominant' },
  accessibility: { title: 'Access', description: 'who the interface may exclude' },
  usability: { title: 'Task', description: 'what helps or obstructs the work' },
  trust: { title: 'Trust', description: 'what the interface asks people to believe' },
  delight: { title: 'Feeling', description: 'what the experience makes people feel' },
}

function formatLensNames(items) {
  const names = items.map((item) => item.title)
  if (names.length === 1) return names[0]
  if (names.length === 2) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`
}

function lensSummary(submissions = []) {
  const counts = Object.fromEntries(Object.keys(LENSES).map((key) => [key, 0]))
  submissions.forEach((submission) => [...new Set(submission.evidenceTags ?? [])].forEach((key) => { if (key in counts) counts[key] += 1 }))
  const entries = Object.entries(counts)
  const used = entries.filter(([, count]) => count > 0)
  if (!used.length) return null

  const max = Math.max(...used.map(([, count]) => count))
  const min = Math.min(...entries.map(([, count]) => count))
  const strongestItems = used.filter(([, count]) => count === max).map(([key, count]) => ({ key, ...LENSES[key], count }))
  const weakestItems = entries.filter(([, count]) => count === min).map(([key, count]) => ({ key, ...LENSES[key], count }))
  const balanced = used.length === entries.length && max === min

  return {
    strongest: {
      title: balanced ? 'All five lenses' : formatLensNames(strongestItems),
      description: strongestItems.length === 1 ? strongestItems[0].description : 'several different kinds of evidence',
      count: max,
      items: strongestItems,
    },
    weakest: {
      title: balanced ? 'No single lens' : formatLensNames(weakestItems),
      count: min,
      items: weakestItems,
    },
    balanced,
    distinct: used.length,
    counts,
  }
}

export function deriveLeadInsight(profile) {
  const submissions = profile?.submissions ?? []
  if (!submissions.length) return { type: 'empty', headline: 'No plates filed yet.', body: 'Begin an investigation to leave a record of what your eye makes visible.' }
  const lean = lensSummary(submissions)
  if (!lean) return { type: 'forming', headline: 'Your evidence is still unnamed.', body: 'The record needs marked evidence before it can reflect your attention.' }
  if (lean.balanced) return {
    type: 'balanced',
    headline: 'Your eye resisted a single default.',
    body: `Across ${submissions.length} rulings, all five evidence lenses entered the record equally. The pattern is breadth, not a winner.`,
  }
  if (lean.distinct === 1) return {
    type: 'single_lens',
    headline: `You keep returning to ${lean.strongest.title.toLowerCase()}.`,
    body: `${submissions.length} rulings filed, but one kind of evidence dominates the record. Open another plate before treating that habit as truth.`,
  }
  if (lean.strongest.items.length > 1) return {
    type: 'shared_lens',
    headline: `${lean.strongest.title} share your attention.`,
    body: `You used each of those lenses in ${lean.strongest.count} cases. The record contains a tie; it does not manufacture a winner.`,
  }
  return {
    type: 'lens',
    headline: `${lean.strongest.title} is what your eye preserves first.`,
    body: `You marked ${lean.strongest.description} in ${lean.strongest.count} cases. ${lean.weakest.title} is least visible in your record.`,
  }
}

export function generateFinalReportContent(profile, cases) {
  const submissions = profile?.submissions ?? []
  if (!submissions.length) return null
  const lean = lensSummary(submissions)
  const byId = new Map(cases.map((item) => [item.id, item]))
  const quoted = [...submissions].reverse().find((submission) => submission.writtenRuling?.trim() && byId.get(submission.caseId)?.caseStatus !== 'sealed')
  const sealed = [...submissions].reverse().find((submission) => submission.writtenRuling?.trim() && byId.get(submission.caseId)?.caseStatus === 'sealed')
  const quoteRecord = (submission) => {
    if (!submission) return null
    const item = byId.get(submission.caseId)
    return { caseNumber: item?.number ?? submission.caseId, caseTitle: item?.title ?? 'Untitled case', text: submission.writtenRuling.trim() }
  }
  const strongest = lean?.strongest
  const weakest = lean?.weakest
  return {
    total: submissions.length,
    lean,
    opening: lean?.balanced
      ? `Across ${submissions.length} plates, your attention moved evenly through all five evidence lenses.`
      : strongest ? `Across ${submissions.length} plates, your attention most often organized itself around ${strongest.title.toLowerCase()}.` : 'Your rulings are filed, but their evidence remains unnamed.',
    paragraphs: strongest ? [
      lean?.balanced
        ? 'This is not a score and the panel is not an answer key. The record shows breadth: no single lens dominated what you chose to make visible.'
        : `This is not a score and the panel is not an answer key. It is a trace of what you repeatedly chose to make visible: ${strongest.description}.`,
      lean?.balanced
        ? 'Equal use does not mean equal sensitivity. It means this archive cannot honestly name a dominant or neglected lens from the evidence available.'
        : weakest ? `${weakest.title} appeared least often. That absence may be a blind spot, a deliberate priority, or a limit of these cases. The record cannot decide which.` : 'No single absence is stable yet.',
      'The jurors are authored, fallible positions. Their value is the collision between plates: one interface, several incompatible accounts of what matters.',
    ] : ['The archive can preserve a verdict, but it cannot infer perception that was never marked.'],
    closingLine: 'Judgment begins by selecting evidence.',
    question: 'What does your eye keep making real—and what disappears when it does?',
    rulingQuote: quoteRecord(quoted),
    sealedRuling: quoteRecord(sealed),
  }
}
