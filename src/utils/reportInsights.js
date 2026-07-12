const LENSES = {
  hierarchy: { title: 'Hierarchy', description: 'what the composition made dominant' },
  accessibility: { title: 'Access', description: 'who the interface may exclude' },
  usability: { title: 'Task', description: 'what helps or obstructs the work' },
  trust: { title: 'Trust', description: 'what the interface asks people to believe' },
  delight: { title: 'Feeling', description: 'what the experience makes people feel' },
}

function lensSummary(submissions = []) {
  const counts = Object.fromEntries(Object.keys(LENSES).map((key) => [key, 0]))
  submissions.forEach((submission) => [...new Set(submission.evidenceTags ?? [])].forEach((key) => { if (key in counts) counts[key] += 1 }))
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const used = ranked.filter(([, count]) => count > 0)
  if (!used.length) return null
  const [strongestKey, strongestCount] = used[0]
  const [weakestKey, weakestCount] = ranked[ranked.length - 1]
  return {
    strongest: { key: strongestKey, ...LENSES[strongestKey], count: strongestCount },
    weakest: { key: weakestKey, ...LENSES[weakestKey], count: weakestCount },
    distinct: used.length,
    counts,
  }
}

export function deriveLeadInsight(profile) {
  const submissions = profile?.submissions ?? []
  if (!submissions.length) return { type: 'empty', headline: 'No plates filed yet.', body: 'Begin an investigation to leave a record of what your eye makes visible.' }
  const lean = lensSummary(submissions)
  if (!lean) return { type: 'forming', headline: 'Your evidence is still unnamed.', body: 'The record needs marked evidence before it can reflect your attention.' }
  if (lean.distinct === 1) return {
    type: 'single_lens',
    headline: `You keep returning to ${lean.strongest.title.toLowerCase()}.`,
    body: `${submissions.length} rulings filed, but one kind of evidence dominates the record. Open another plate before treating that habit as truth.`,
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
    opening: strongest ? `Across ${submissions.length} plates, your attention most often organized itself around ${strongest.title.toLowerCase()}.` : 'Your rulings are filed, but their evidence remains unnamed.',
    paragraphs: strongest ? [
      `This is not a score and the panel is not an answer key. It is a trace of what you repeatedly chose to make visible: ${strongest.description}.`,
      weakest ? `${weakest.title} appeared least often. That absence may be a blind spot, a deliberate priority, or a limit of these cases. The record cannot decide which.` : 'No single absence is stable yet.',
      'The jurors are authored, fallible positions. Their value is the collision between plates: one interface, several incompatible accounts of what matters.',
    ] : ['The archive can preserve a verdict, but it cannot infer perception that was never marked.'],
    closingLine: 'Judgment begins by selecting evidence.',
    question: 'What does your eye keep making real—and what disappears when it does?',
    rulingQuote: quoteRecord(quoted),
    sealedRuling: quoteRecord(sealed),
  }
}
