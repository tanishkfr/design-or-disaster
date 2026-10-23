import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const pass = process.argv[2] ?? 'before'
const out = process.env.VERIFY_OUT ?? `output/phase-2.3/${pass}`
mkdirSync(out, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5197', '--strictPort'], { stdio: 'pipe', windowsHide: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
try {
  await new Promise((resolve, reject) => {
    server.stdout.on('data', (d) => d.toString().includes('Local:') && resolve())
    server.stderr.on('data', (d) => reject(new Error(d.toString())))
    server.on('error', reject)
  })
  for (const [name, width, height] of [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height } })
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:5197')
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${out}/${name}-cover.png`, fullPage: true, animations: 'disabled' })
    writeFileSync(`${out}/${name}-cover.txt`, await page.locator('body').innerText())
    await page.getByRole('button', { name: 'Case index ↗', exact: true }).click()
    await page.getByRole('heading', { name: /The case/ }).waitFor()
    await page.screenshot({ path: `${out}/${name}-index.png`, fullPage: true, animations: 'disabled' })
    await page.getByRole('button').filter({ has: page.getByRole('heading', { name: 'Mobile Banking Dashboard', exact: true }) }).click()
    await page.getByRole('button', { name: 'Mark', exact: true }).waitFor()
    await page.screenshot({ path: `${out}/${name}-workbench.png`, fullPage: true })
    await page.getByRole('button', { name: 'Mark', exact: true }).click()
    const viewer = page.getByRole('button', { name: /Mark unclassified evidence/ })
    await viewer.focus()
    await viewer.press('Enter')
    await page.getByRole('textbox', { name: 'Marker 1 observation' }).fill('The quick actions share weight although their tasks differ.')
    await page.screenshot({ path: `${out}/${name}-marking.png`, fullPage: true })
    await page.getByRole('button', { name: 'Remove evidence mark 1' }).click()
    console.log(name, 'focus after deletion:', await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 160)))
    await context.close()
  }
} finally {
  await browser.close()
  server.kill()
}
