import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CASES } from '../src/data/cases.js'
import { CURATED_IDS } from '../src/investigation/capabilities.js'

// Complement the existing journeys with automated semantics and reflow evidence.
// This does not execute a screen reader or establish WCAG conformance.
const out = process.env.VERIFY_OUT ?? 'output/release-candidate/accessibility'
const fixture = process.env.VERIFY_FIXTURE ?? 'output/release-candidate/before/complete-store.json'
mkdirSync(out, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5200', '--strictPort'], { stdio: 'pipe', windowsHide: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const scans = [], reflow = [], errors = []
const axe = readFileSync('output/release-candidate/tools/node_modules/axe-core/axe.min.js', 'utf8')
try {
  await new Promise((resolve, reject) => {
    server.stdout.on('data', d => d.toString().includes('Local:') && resolve())
    server.on('error', reject)
    server.on('exit', code => reject(new Error(`Preview exited ${code}`)))
  })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.on('pageerror', e => errors.push(e.message))
  async function scan(name) {
    await page.evaluate(() => document.fonts.ready)
    await page.addScriptTag({ content: axe })
    const result = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })
      return { version: r.testEngine.version, violations: r.violations, incomplete: r.incomplete, passes: r.passes.length }
    })
    scans.push({ name, ...result })
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
    writeFileSync(`${out}/${name}-semantics.yml`, await page.locator('body').ariaSnapshot())
  }
  const button = name => page.getByRole('button', { name, exact: true })
  await page.goto('http://127.0.0.1:5200')
  await scan('cover')
  await button('Case index ↗').click()
  await scan('index')
  await button('Reset').click()
  await scan('reset-confirmation')
  await button('Cancel reset').click()
  await page.goto('http://127.0.0.1:5200/#view=about')
  await scan('about')
  for (const id of CURATED_IDS) {
    await page.goto('http://127.0.0.1:5200/#view=archive')
    await page.getByRole('button').filter({ has: page.getByRole('heading', { name: CASES.find(c => c.id === id).title, exact: true }) }).click()
    await page.getByRole('heading', { name: 'What catches your attention?' }).waitFor()
    await scan(`${id}-explore`)
    if (id !== 'case-006') await button('Mark').click()
    await page.getByText('Choose a named region instead', { exact: true }).click()
    await page.locator('[aria-label="Named interface regions"] button').first().click()
    await page.getByRole('textbox', { name: 'Marker 1 observation' }).fill('Synthetic review: this named region supports my reading.')
    await scan(`${id}-mark`)
    await button('Make first judgment →').click()
    await scan(`${id}-judgment`)
  }
  await page.evaluate(store => localStorage.setItem('design-disaster-investigations-v1', store), readFileSync(fixture, 'utf8'))
  for (const id of CURATED_IDS) {
    await page.goto(`http://127.0.0.1:5200/#view=investigation&case=${id}`)
    await page.reload()
    await page.getByText('Your investigation is complete and saved in this browser.', { exact: true }).waitFor()
    await scan(`${id}-reflection`)
    if (id !== 'case-015') {
      await button('Compare the authored jurors →').click()
      await page.getByRole('heading', { name: /Same evidence/ }).waitFor()
      await scan(`${id}-perspectives`)
    }
  }
  await page.goto('http://127.0.0.1:5200/#view=designeye')
  await scan('report')
  for (const width of [720, 360, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(300)
    for (const [name, route] of [['cover', 'cover'], ['index', 'archive'], ['report', 'designeye'], ...CURATED_IDS.map(id => [id, `investigation&case=${id}`])]) {
      await page.goto(`http://127.0.0.1:5200/#view=${route}`)
      await page.waitForTimeout(300)
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth }))
      reflow.push({ name, width, ...dimensions, pass: dimensions.scroll <= dimensions.viewport })
      await page.screenshot({ path: `${out}/reflow-${width}-${name}.png`, fullPage: true })
    }
  }
  writeFileSync(`${out}/results.json`, JSON.stringify({ browser: browser.version(), scope: 'axe automated rules and CSS viewport reflow; no screen reader or real browser zoom', scans, reflow, errors }, null, 2))
  console.log(JSON.stringify({ scans: scans.map(s => ({ name: s.name, violations: s.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) })), reflowFailures: reflow.filter(r => !r.pass), errors }, null, 2))
  await context.close()
} finally { await browser.close(); server.kill() }
