import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CURATED_IDS } from '../src/investigation/capabilities.js'
import { CASES } from '../src/data/cases.js'
import { markFirst } from './investigation-browser-helpers.mjs'

const phase = process.env.CAPTURE_PHASE ?? 'before'
const out = `output/excellence/${phase}`
mkdirSync(out, { recursive: true })
mkdirSync('public/previews', { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5210', '--strictPort'], { stdio: 'pipe', windowsHide: true })
const browser = await chromium.launch({ channel: 'chrome' })
const base = 'http://127.0.0.1:5210'
const measurements = []
try {
  await new Promise((resolve, reject) => {
    server.stdout.on('data', d => d.toString().includes('Local:') && resolve())
    server.on('error', reject)
    server.on('exit', code => reject(new Error(`Preview exited ${code}`)))
  })
  for (const [name, width, height] of [['desktop',1440,900], ['tablet',768,1024], ['mobile',390,844], ['compact',320,844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    async function capture(label) {
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => window.scrollTo(0,0))
      await page.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: true, animations: 'disabled' })
      if (name === 'desktop' && label === 'index') await page.locator('[aria-label="Second Look collection"]').screenshot({path:`${out}/catalogue-detail.png`})
      if (name === 'desktop' && label === 'marking') await page.locator('[class*="workspace"]').screenshot({path:`${out}/workbench-detail.png`})
      measurements.push({ name, label, ...await page.evaluate(() => ({ height: document.documentElement.scrollHeight, width: innerWidth, scrollWidth: document.documentElement.scrollWidth })) })
    }
    await page.goto(`${base}/#view=archive`)
    await page.getByRole('heading', { name: /The case/ }).waitFor()
    await capture('index')
    for (const id of CURATED_IDS) {
      await page.goto(`${base}/#view=archive`)
      await page.getByRole('button').filter({ has: page.getByRole('heading', { name: CASES.find(c=>c.id===id).title, exact: true }) }).click()
      await page.getByRole('heading', { name: 'What catches your attention?' }).waitFor()
      await page.evaluate(() => document.fonts.ready)
      if (phase === 'before' && name === 'desktop') {
        const exhibit = id === 'case-006' ? page.locator('img[alt]').last() : page.locator('[class*="liveExhibit"]')
        await exhibit.screenshot({ path: `public/previews/${id}.png`, animations: 'disabled' })
      }
      if (id === 'case-001') {
        await capture('explore')
        await page.getByRole('button', { name: 'Mark', exact: true }).click()
        await markFirst(page, 'The equal-weight actions let me choose a route without a dominant prompt.')
        await capture('marking')
        measurements.push({ name, label:'note-to-next', ...await page.evaluate(() => {
          const note=document.querySelector('textarea[aria-label="Marker 1 observation"]')?.getBoundingClientRect()
          const next=[...document.querySelectorAll('button')].find(el=>el.textContent.includes('Make first judgment'))?.getBoundingClientRect()
          return { distance: Math.round(next.top-note.bottom), noteHeight: Math.round(note.height) }
        }) })
        await page.getByRole('button', { name: 'Make first judgment →', exact: true }).click()
        await capture('judgment')
      }
    }
    const fixture = 'output/release-candidate/final/chrome/complete-store.json'
    await page.evaluate(store=>localStorage.setItem('design-disaster-investigations-v1',store), readFileSync(fixture,'utf8'))
    await page.goto(`${base}/#view=designeye`)
    await page.reload()
    await page.getByRole('heading', {name:'Your Design Eye.'}).waitFor()
    await capture('report')
    await context.close()
  }
  writeFileSync(`${out}/surface-measurements.json`,JSON.stringify(measurements,null,2))
  console.log(JSON.stringify(measurements,null,2))
} finally { await browser.close(); server.kill() }
