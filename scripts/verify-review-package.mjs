import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const root = 'output/release-candidate'
const verification = JSON.parse(readFileSync(`${root}/package-verification.json`, 'utf8'))
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const errors = [], failed = [], remote = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', e => errors.push(e.message))
  page.on('requestfailed', r => failed.push({ url: r.url(), error: r.failure()?.errorText }))
  page.on('request', r => { if (!r.url().startsWith('file:')) remote.push(r.url()) })
  const url = pathToFileURL(join(verification.extractedTo, 'index.html')).href
  await page.goto(url)
  await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager' }))
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0))
  const images = await page.locator('img').count()
  assert.equal(images, verification.screenshots)
  await page.screenshot({ path: `${root}/package-desktop.png`, fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: `${root}/package-mobile.png`, fullPage: true })
  const docs = await page.locator('#documents a').evaluateAll(links => links.map(a => a.href))
  assert.equal(docs.length, 6)
  for (const url of docs) {
    await page.goto(url)
    assert.ok((await page.locator('pre').innerText()).length > 500)
    await page.getByRole('link', { name: '← Review gallery', exact: true }).click()
    await page.getByRole('heading', { name: 'The evidence behind a judgment.' }).waitFor()
  }
  assert.deepEqual(errors, [])
  assert.deepEqual(failed, [])
  assert.deepEqual(remote, [])
  const result = { browser: browser.version(), source: 'Extracted ZIP, file origin, no repository access or HTTP server', images, readableDocuments: docs.length, errors, failed, remoteRequests: remote, result: 'PASS' }
  writeFileSync(`${root}/package-browser-verification.json`, JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
} finally { await browser.close() }
