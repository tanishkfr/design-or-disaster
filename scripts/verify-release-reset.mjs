import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const observe = process.argv.includes('--observe')
const out = process.env.VERIFY_OUT ?? `output/release-candidate/reset-${observe ? 'before' : 'after'}`
mkdirSync(out, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5201', '--strictPort'], { stdio: 'pipe', windowsHide: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
try {
  await new Promise((resolve, reject) => {
    server.stdout.on('data', d => d.toString().includes('Local:') && resolve())
    server.on('error', reject)
  })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await page.goto('http://127.0.0.1:5201/#view=archive')
  await page.evaluate(store => localStorage.setItem('design-disaster-investigations-v1', store), readFileSync('output/release-candidate/chrome/complete-store.json', 'utf8'))
  await page.reload()
  const before = await page.evaluate(() => localStorage.getItem('design-disaster-investigations-v1'))
  const button = name => page.getByRole('button', { name, exact: true })
  await button('Reset').click()
  await page.screenshot({ path: `${out}/immediate.png`, fullPage: true })
  // Deliberately exceed the previous three-second confirmation window.
  await page.waitForTimeout(4000)
  const confirmationAvailable = await button('Erase progress?').count() === 1
  await page.screenshot({ path: `${out}/after-four-seconds.png`, fullPage: true })
  if (!observe) {
    assert.equal(confirmationAvailable, true, 'Reset confirmation must not expire while being read')
    await button('Cancel reset').focus()
    await page.keyboard.press('Enter')
    assert.equal(await page.evaluate(() => localStorage.getItem('design-disaster-investigations-v1')), before)
    assert.equal(await button('Cancel reset').count(), 0)
    await button('Reset').focus()
    await page.keyboard.press('Enter')
    await button('Erase progress?').focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
    assert.equal(await page.evaluate(() => localStorage.getItem('design-disaster-investigations-v1')), null)
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('design-eye-profile'))?.submissions.length ?? 0), 0)
    for (const width of [768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('http://127.0.0.1:5201/#view=archive')
      await button('Reset').click()
      await page.screenshot({ path: `${out}/confirmation-${width}.png`, fullPage: true, animations: 'disabled' })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Reset confirmation reflow ${width}`)
      await button('Cancel reset').click()
      await page.waitForTimeout(50)
      assert.equal(await button('Reset').evaluate(el => document.activeElement === el), true, 'Cancel returns focus to Reset')
    }
  }
  writeFileSync(`${out}/results.json`, JSON.stringify({ browser: browser.version(), observe, confirmationAvailable, result: observe ? 'Observed baseline behavior' : 'PASS: persistent confirmation, cancel preserves bytes, confirmed keyboard erase clears both stores' }, null, 2))
  console.log(observe ? { confirmationAvailable } : 'PASS persistent reset / cancel / keyboard erase')
} finally { await browser.close(); server.kill() }
