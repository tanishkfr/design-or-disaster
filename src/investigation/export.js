import { VERDICT_LABELS, CONFIDENCE_LABELS } from './labels.js'
export function wrapLines(context, text, width) {
  const lines = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    for (const word of paragraph.split(/\s+/)) {
      if (context.measureText(word).width > width) {
        if (line) lines.push(line)
        let chunk = ''
        for (const char of word) {
          if (context.measureText(chunk + char).width > width) {
            lines.push(chunk)
            chunk = ''
          }
          chunk += char
        }
        line = chunk
      } else if (line && context.measureText(line + ' ' + word).width > width) {
        lines.push(line)
        line = word
      } else line += (line ? ' ' : '') + word
    }
    lines.push(line)
  }
  return lines
}

export async function exportSummary(report, getCase) {
  await document.fonts.ready
  await Promise.all(
    [
      '400 86px "Instrument Serif"',
      '400 26px Archivo',
      '600 42px Archivo',
      '400 18px "IBM Plex Mono"',
    ].map((font) => document.fonts.load(font)),
  )
  const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    ops = []
  canvas.width = 1600
  const ink = '#F3F1EB',
    muted = '#B5B8BE',
    red = '#FF634D'
  function text(
    value,
    x,
    y,
    width,
    size = 26,
    color = ink,
    face = 'Archivo',
    weight = 400,
  ) {
    const font = `${weight} ${size}px "${face}", sans-serif`
    ctx.font = font
    const lines = wrapLines(ctx, value, width),
      lineHeight = Math.ceil(size * 1.45)
    ops.push(() => {
      ctx.font = font
      ctx.fillStyle = color
      lines.forEach((line, index) =>
        ctx.fillText(line, x, y + index * lineHeight),
      )
    })
    return lines.length * lineHeight
  }
  const rule = (y) =>
    ops.push(() => {
      ctx.fillStyle = '#4C535D'
      ctx.fillRect(100, y, 1400, 1)
    })
  ops.push(() => {
    ctx.fillStyle = red
    ctx.fillRect(100, 70, 100, 8)
  })
  text(
    'DESIGN / DISASTER?   /   PERSONAL INVESTIGATION RECORD',
    100,
    125,
    1400,
    18,
    muted,
    'IBM Plex Mono',
  )
  text('Your Design Eye.', 100, 235, 1400, 86, ink, 'Instrument Serif')
  text(
    'What you noticed. What you reconsidered. What you kept.',
    100,
    300,
    1400,
    28,
  )
  rule(345)
  for (const [index, [value, label]] of [
    [report.complete, 'Investigations complete / 5'],
    [report.outcomes.changed_verdict, 'Changed verdict'],
    [
      report.outcomes.new_reasoning + report.outcomes.consistent_reasoning,
      'Same verdict',
    ],
  ].entries()) {
    const x = 100 + index * 470
    text(String(value), x, 440, 420, 76, red)
    text(label, x, 493, 420, 23)
  }
  let y = 560
  y +=
    text(
      `Stated confidence: ${report.confidence.higher} higher / ${report.confidence.lower} lower / ${report.confidence.same} unchanged. ${report.unclassified} unclassified evidence marks.`,
      100,
      y,
      1400,
      23,
      muted,
    ) + 24
  y +=
    text(
      `Explicit lenses: ${Object.entries(report.lensCounts)
        .map(([lens, count]) => `${lens} ${count}`)
        .join(' / ')}`,
      100,
      y,
      1400,
      23,
      muted,
    ) + 36
  for (const [index, item] of report.cases.entries()) {
    rule(y)
    y += 42
    text(
      `0${index + 1} / ${item.status.toUpperCase()}${item.caseId === 'case-015' ? ' / SEALED FINALE' : ''}`,
      100,
      y,
      1400,
      18,
      red,
      'IBM Plex Mono',
    )
    y += 58
    y +=
      text(getCase(item.caseId).title, 100, y, 1400, 42, ink, 'Archivo', 600) +
      18
    let bottom = y
    for (const [column, [label, judgment, look]] of [
      ['FIRST JUDGMENT', item.before, item.record?.firstLook],
      ['SECOND JUDGMENT', item.after, item.record?.secondLook],
    ].entries()) {
      const x = 100 + column * 730
      let cursor = y
      cursor += text(label, x, cursor, 670, 17, muted, 'IBM Plex Mono') + 12
      cursor +=
        text(
          judgment ? VERDICT_LABELS[judgment.verdict] : 'Not submitted',
          x,
          cursor,
          670,
          30,
        ) + 6
      cursor +=
        text(
          judgment
            ? CONFIDENCE_LABELS[judgment.confidence]
            : 'No confidence supplied',
          x,
          cursor,
          670,
          21,
          muted,
        ) + 16
      if (judgment)
        cursor += text(judgment.writtenRuling, x, cursor, 670, 25) + 20
      if (look?.marks.length) {
        cursor +=
          text(
            `EVIDENCE EXCERPT / 1 OF ${look.marks.length}`,
            x,
            cursor,
            670,
            16,
            red,
            'IBM Plex Mono',
          ) + 10
        cursor += text(look.marks[0].note, x, cursor, 670, 22, muted) + 16
      }
      bottom = Math.max(bottom, cursor)
    }
    y = bottom + 24
    if (item.record?.reflectionNote)
      y +=
        text(
          'Your reflection: ' + item.record.reflectionNote,
          100,
          y,
          1400,
          24,
        ) + 16
    if (item.record)
      y +=
        text(
          `${item.record.contextRevealed.length} context documents opened. Full marked states and context appear in the print / PDF record.`,
          100,
          y,
          1400,
          20,
          muted,
        ) + 16
    y += 30
  }
  rule(y)
  y += 45
  y +=
    text(
      `Legacy single-look records retained separately: ${report.legacy.length}.`,
      100,
      y,
      1400,
      22,
      muted,
    ) + 18
  y +=
    text(
      'This summary counts saved decisions and explicitly classified marks. It does not score expertise, infer confidence, or diagnose a personality. Unchanged verdicts carry no penalty. Working exhibits and outside perspectives are authored; the sealed finale has no outside interpretation.',
      100,
      y,
      1400,
      22,
      muted,
    ) + 24
  y +=
    text(
      'Evidence excerpts reproduce the first saved note in each look. The full print / PDF document includes every marked state and note. No account required; this record stays in your browser.',
      100,
      y,
      1400,
      22,
      muted,
    ) + 70
  canvas.height = Math.ceil(y)
  ctx.fillStyle = '#0B0D10'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ops.forEach((draw) => draw())
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  )
  if (!blob)
    throw new Error(
      'The browser could not create the PNG. Your report remains saved.',
    )
  const url = URL.createObjectURL(blob),
    link = document.createElement('a')
  link.href = url
  link.download = 'design-eye-summary.png'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

// The compact edition is deliberately bounded. The full export above retains
// every reason; this edition names the excerpt limits on the page itself.
export async function exportCompactSummary(report, getCase) {
  await document.fonts.ready
  await Promise.all(['600 64px Archivo', '400 28px Archivo', '400 76px "Instrument Serif"'].map(font => document.fonts.load(font)))
  const canvas = document.createElement('canvas')
  canvas.width = 1600
  canvas.height = 2263
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0B0D10'
  ctx.fillRect(0, 0, 1600, 2263)
  function text(value, x, y, width, size = 28, color = '#F3F1EB', maxLines = Infinity, face = 'Archivo') {
    ctx.font = `400 ${size}px "${face}", sans-serif`
    ctx.fillStyle = color
    const lines = wrapLines(ctx, value, width)
    const visible = lines.slice(0, maxLines)
    if (lines.length > maxLines) {
      let last = visible.at(-1)
      while (ctx.measureText(last + '…').width > width) last = last.slice(0, -1)
      visible[visible.length - 1] = last + '…'
    }
    visible.forEach((line, i) => ctx.fillText(line, x, y + i * size * 1.4))
  }
  function rule(y) { ctx.fillStyle = '#4C535D'; ctx.fillRect(90,y,1420,1) }
  const muted = '#B5B8BE', red = '#FF634D'
  text('D/D   DESIGN OR DISASTER?',90,100,1420,26,red)
  text('Your Design Eye.',90,220,1420,90,'#F3F1EB',1,'Instrument Serif')
  text('An investigation in two looks.',90,290,1420,32)
  rule(340)
  text(`${report.complete} / 5 complete`,90,420,600,52)
  text(`${report.paired} submitted pairs · ${report.outcomes.changed_verdict} changed verdict`,760,397,750,27,red)
  text(`${report.outcomes.new_reasoning + report.outcomes.consistent_reasoning} reaffirmed · ${report.cases.filter(item=>item.status==='incomplete').length} unfinished`,760,445,750,27,muted)
  text('FIRST JUDGMENT → SECOND JUDGMENT',90,518,1420,23,muted)
  report.cases.forEach((item,index) => {
    const y = 560 + index * 266
    rule(y)
    text(`0${index+1}`,90,y+52,70,24,red)
    text(getCase(item.caseId).title,170,y+52,1340,34)
    text(`${item.before ? VERDICT_LABELS[item.before.verdict] : 'Not submitted'}  →  ${item.after ? VERDICT_LABELS[item.after.verdict] : 'Not submitted'}`,170,y+103,1340,27,red)
    for (const [column, judgment] of [item.before,item.after].entries()) {
      const x = 170 + column * 690
      text(column ? 'SECOND / REASON EXCERPT' : 'FIRST / REASON EXCERPT',x,y+149,640,18,muted)
      text(judgment?.writtenRuling ?? 'No saved judgment.',x,y+190,640,26,'#F3F1EB',2)
    }
  })
  rule(1910)
  text('A record of decisions. No score.',90,1970,1420,36)
  text('Only current saved attempts are counted. Reaffirmation carries no penalty. Reasons above show up to two lines each; complete reasons, evidence and context remain in the full report.',90,2028,1420,25,muted)
  text(`Authored simulations and perspectives. No expertise or learning is inferred. Legacy single-look records retained separately: ${report.legacy.length}. Saved in this browser.`,90,2150,1420,24,muted)
  const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'))
  if (!blob) throw new Error('The browser could not create the compact PNG. Your full record remains saved.')
  saveBlob(blob,'design-eye-one-page.png')
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url),60000)
}

export function textReportHtml(report, getCase, configs) {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
  const cases = report.cases.map(item => `<section><h2>${escape(getCase(item.caseId).title)}</h2><p>${escape(item.status)}${configs[item.caseId].sealed ? ' / sealed finale' : ''}</p>${['first','second'].map((look,index)=> {
    const judgment = index ? item.after : item.before
    return `<section><h3>${index ? 'Second' : 'First'} look</h3><p>${judgment ? `${escape(VERDICT_LABELS[judgment.verdict])} / ${escape(CONFIDENCE_LABELS[judgment.confidence])}` : 'No submitted judgment.'}</p>${judgment ? `<blockquote>${escape(judgment.writtenRuling)}</blockquote>` : ''}<ol>${(item.record?.[`${look}Look`]?.marks ?? []).map(mark=>`<li><p>${escape(mark.note)}</p><p>${escape(mark.lens ?? 'Unclassified')} / ${mark.width != null ? 'Region' : 'Point'}: x ${escape(mark.x)}%, y ${escape(mark.y)}%${mark.width != null ? `, width ${escape(mark.width)}%, height ${escape(mark.height)}%` : ''}</p></li>`).join('')}</ol></section>`
  }).join('')}<h3>Opened context</h3>${configs[item.caseId].context.filter(doc=>item.record?.contextRevealed.includes(doc.id)).map(doc=>`<h4>${escape(doc.title)}</h4><p>${escape(doc.provenance)}</p><p>${escape(doc.body)}</p><p>${escape(doc.connection)}</p>`).join('')}${item.record?.reflectionNote ? `<h3>Your reflection</h3><p>${escape(item.record.reflectionNote)}</p>` : ''}</section>`).join('')
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Design Eye — text record</title><style>body{max-width:75ch;margin:auto;padding:32px 20px;font:18px/1.7 system-ui;color:#181b20;background:#f3f1eb;overflow-wrap:anywhere}h1,h2,h3{line-height:1.2}section{border-top:1px solid #777;margin-top:32px;padding-top:16px}blockquote{margin:16px 0;padding-left:16px;border-left:1px solid #777}</style><main><h1>Your Design Eye.</h1><p>Design or Disaster? / portable text edition</p><p>${report.complete} / 5 investigations complete. ${report.paired} submitted judgment pairs. ${report.outcomes.changed_verdict} changed verdict; ${report.outcomes.new_reasoning + report.outcomes.consistent_reasoning} same verdict.</p><p>${escape(report.methodology)}</p><p>This text edition preserves current notes, judgments, confidence, opened context and reflection. Visual captured exhibits remain in the full application and PDF. It is the nonvisual alternative to the image summary; PDF tagging is not certified.</p>${cases}<section><h2>Legacy single-look records</h2>${report.legacy.map(item=>`<h3>${escape(getCase(item.caseId)?.title ?? item.caseId)}</h3><p>${escape(item.writtenRuling)}</p>`).join('') || '<p>No legacy records.</p>'}</section><p>Working exhibits and outside perspectives are authored. No information is sent to a real service. The sealed finale has no outside interpretation.</p></main></html>`
}

export function exportTextReport(report, getCase, configs) {
  saveBlob(new Blob([textReportHtml(report,getCase,configs)],{type:'text/html;charset=utf-8'}),'design-eye-text-record.html')
}
