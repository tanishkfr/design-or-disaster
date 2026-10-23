import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const out = process.env.VERIFY_OUT ?? 'output/phase-2.3/performance'
mkdirSync(out, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5199', '--strictPort'], { stdio: 'pipe', windowsHide: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const base = 'http://127.0.0.1:5199', runs = [], failures = []
try {
  await new Promise((resolve, reject) => {
    server.stdout.on('data', (d) => d.toString().includes('Local:') && resolve())
    server.stderr.on('data', (d) => reject(new Error(d.toString())))
    server.on('error', reject)
  })
  for (let run = 0; run < 3; run++) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    page.on('requestfailed', (request) => failures.push({ url: request.url(), error: request.failure()?.errorText }))
    await page.addInitScript(() => {
      window.observed = { lcp: 0, cls: 0, longTasks: [] }
      for (const type of ['largest-contentful-paint', 'layout-shift', 'longtask'])
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (type === 'largest-contentful-paint') window.observed.lcp = entry.startTime
            if (type === 'layout-shift' && !entry.hadRecentInput) window.observed.cls += entry.value
            if (type === 'longtask') window.observed.longTasks.push(entry.duration)
          }
        }).observe({ type, buffered: true })
    })
    await page.goto(base)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1200)
    runs.push(await page.evaluate(() => ({
      ...window.observed,
      navigation: performance.getEntriesByType('navigation')[0].toJSON(),
      paint: performance.getEntriesByType('paint').map((entry) => entry.toJSON()),
      resources: performance.getEntriesByType('resource').map((entry) => ({ name: entry.name, duration: entry.duration, transferSize: entry.transferSize, decodedBodySize: entry.decodedBodySize })),
      fonts: ['Archivo', 'Instrument Serif', 'IBM Plex Mono'].map((family) => ({ family, style: family === 'Instrument Serif' ? 'italic' : 'normal', loaded: document.fonts.check(`${family === 'Instrument Serif' ? 'italic ' : ''}16px "${family}"`) })),
    })))
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  // Prevent silent corruption/overwrite of malformed legacy records.
  await page.goto(base)
  const raw = '{"submissions":{}}'
  await page.evaluate((value) => localStorage.setItem('design-eye-profile', value), raw)
  await page.goto(`${base}/#view=archive`)
  await page.reload()
  await page.getByRole('alert').filter({ hasText: 'Single-look storage' }).waitFor()
  await page.getByRole('button').filter({ has: page.getByRole('heading', { name: 'Mobile Banking Dashboard', exact: true }) }).click()
  await page.getByRole('button', { name: 'Mark', exact: true }).waitFor()
  assert.equal(await page.evaluate(() => localStorage.getItem('design-eye-profile')), raw)
  await page.screenshot({ path: `${out}/malformed-legacy-preserved.png`, fullPage: true })
  // A denied save must be visible and must not create a falsely saved record.
  const denied = await browser.newContext()
  await denied.addInitScript(() => {
    Storage.prototype.setItem = function () { throw new DOMException('Storage blocked for test', 'QuotaExceededError') }
  })
  const blocked = await denied.newPage()
  await blocked.goto(`${base}/#view=archive`)
  await blocked.getByRole('button').filter({ has: blocked.getByRole('heading', { name: 'Mobile Banking Dashboard', exact: true }) }).click()
  await blocked.getByRole('alert').waitFor()
  assert.equal(await blocked.evaluate(() => localStorage.getItem('design-disaster-investigations-v1')), null)
  const report = { browser: browser.version(), scope: 'Three unthrottled fresh-context loopback production loads; browser cache disabled. Lab observations, not field Core Web Vitals or INP.', runs, failures,
    storage: ['Malformed legacy structure retained without blanking the app', 'Blocked write produces visible alert and no falsely saved investigation'] }
  writeFileSync(`${out}/results.json`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ browser: report.browser, runs: runs.map((r) => ({ lcp: r.lcp, cls: r.cls, longTasks: r.longTasks, dcl: r.navigation.domContentLoadedEventEnd, fonts: r.fonts })), failures, storage: report.storage }, null, 2))
} finally { await browser.close(); server.kill() }
