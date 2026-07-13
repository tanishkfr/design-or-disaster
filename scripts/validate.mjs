import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CASES } from '../src/data/cases.js'
import { JURORS } from '../src/data/jurors.js'
import { deriveLeadInsight } from '../src/utils/reportInsights.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const check = (condition, message) => {
  if (!condition) errors.push(message)
}

check(CASES.length === 10, 'Expected exactly ten cases')
check(new Set(CASES.map((item) => item.id)).size === CASES.length, 'Case ids must be unique')
check(new Set(CASES.map((item) => item.number)).size === CASES.length, 'Case numbers must be unique')

const balancedProfile = {
  submissions: JURORS.map((juror, index) => ({ caseId: 'balanced-' + index, evidenceTags: [juror.lens] })),
}
const sharedProfile = {
  submissions: [
    { caseId: 'shared-1', evidenceTags: ['hierarchy'] },
    { caseId: 'shared-2', evidenceTags: ['accessibility'] },
  ],
}
check(deriveLeadInsight(balancedProfile).type === 'balanced', 'Balanced lens records must remain balanced')
check(deriveLeadInsight(sharedProfile).type === 'shared_lens', 'Tied strongest lenses must remain tied')

for (const item of CASES) {
  check(Boolean(item.screenshotDescription), item.id + ': missing screenshotDescription')
  check(Array.isArray(item.evidenceTargets) && item.evidenceTargets.length >= 2, item.id + ': needs at least two named evidence targets')
  for (const target of item.evidenceTargets || []) {
    check(target.x >= 0 && target.x <= 100 && target.y >= 0 && target.y <= 100, item.id + ': evidence target outside image')
    check(Boolean(target.label), item.id + ': evidence target missing label')
  }

  const asset = join(root, 'public', item.screenshot.replace(/^\//, ''))
  check(existsSync(asset), item.id + ': screenshot does not exist: ' + item.screenshot)

  if (item.caseStatus === 'sealed') {
    check((item.jurorRulings || []).length === 0, item.id + ': sealed case must not have juror rulings')
    check((item.annotations || []).length === 0, item.id + ': sealed case must not have annotations')
    continue
  }

  const rulingLenses = new Set((item.jurorRulings || []).map((ruling) => ruling.juror))
  const annotationLenses = new Set((item.annotations || []).map((annotation) => annotation.juror))
  check(rulingLenses.size === JURORS.length, item.id + ': must have five unique juror rulings')
  check(annotationLenses.size === JURORS.length, item.id + ': must have five unique juror annotations')

  for (const juror of JURORS) {
    check(rulingLenses.has(juror.lens), item.id + ': missing ruling for ' + juror.lens)
    check(annotationLenses.has(juror.lens), item.id + ': missing annotation for ' + juror.lens)
  }
  for (const annotation of item.annotations || []) {
    check(annotation.x >= 0 && annotation.x <= 100 && annotation.y >= 0 && annotation.y <= 100, item.id + ': annotation outside image')
    check(Boolean(annotation.label), item.id + ': annotation missing label')
  }
}

const ignored = new Set(['.git', 'dist', 'node_modules'])
const textExtensions = new Set(['.css', '.html', '.js', '.jsx', '.json', '.md', '.mjs', '.svg'])
function walk(dir) {
  const output = []
  for (const name of readdirSync(dir)) {
    if (ignored.has(name)) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) output.push(...walk(full))
    else if (textExtensions.has(extname(full))) output.push(full)
  }
  return output
}

const corruption = [String.fromCharCode(0xc3), String.fromCharCode(0xc2), String.fromCharCode(0xe2), String.fromCharCode(0xfffd)]
for (const file of walk(root)) {
  const text = readFileSync(file, 'utf8')
  if (corruption.some((marker) => text.includes(marker))) {
    errors.push(file.slice(root.length + 1) + ': possible encoding corruption')
  }
  if (!file.endsWith('.jsx')) continue

  const importMatch = text.match(/import styles from ['"](.+?\.module\.css)['"]/)
  if (!importMatch) continue
  const cssPath = resolve(dirname(file), importMatch[1])
  const css = readFileSync(cssPath, 'utf8')
  const defined = new Set(Array.from(css.matchAll(/\.([A-Za-z_][A-Za-z0-9_-]*)/g), (match) => match[1]))
  const used = new Set(Array.from(text.matchAll(/styles\.([A-Za-z_][A-Za-z0-9_]*)/g), (match) => match[1]))
  for (const selector of used) {
    check(defined.has(selector), file.slice(root.length + 1) + ': missing CSS module selector .' + selector)
  }
}

if (errors.length) {
  console.error('Validation failed:')
  for (const error of errors) console.error(' - ' + error)
  process.exit(1)
}
console.log('Validated ten cases, five-plate coverage, assets, encoding, and CSS modules.')
