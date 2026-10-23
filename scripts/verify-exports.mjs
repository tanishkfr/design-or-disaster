import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
const out = process.env.VERIFY_OUT ?? 'output/phase-2.2'
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5190'],
  { stdio: 'pipe', windowsHide: true },
)
await new Promise((r) =>
  server.stdout.on('data', (d) => {
    if (d.toString().includes('Local:')) r()
  }),
)
const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  }),
  page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
try {
  await page.goto('http://127.0.0.1:5190')
  await page.evaluate(
    (store) => localStorage.setItem('design-disaster-investigations-v1', store),
    readFileSync(`${out}/complete-store.json`, 'utf8'),
  )
  await page.goto('http://127.0.0.1:5190/#view=designeye')
  await page.reload()
  await page.getByRole('heading', { name: 'Your Design Eye.' }).waitFor()
  await page
    .getByText('5 / 5 investigations complete.', { exact: false })
    .waitFor()
  await page.evaluate(() => document.fonts.ready)
  console.log(
    'CSS container division',
    await page.evaluate(() =>
      CSS.supports('transform', 'scale(calc(1px / 1px))'),
    ),
  )
  await page.pdf({
    path: `${out}/design-eye-full.pdf`,
    preferCSSPageSize: true,
    printBackground: true,
  })
  await page.emulateMedia({ media: 'print' })
  await page.screenshot({
    path: `${out}/print-preview.png`,
    fullPage: true,
  })
  writeFileSync(
    `${out}/print-dom-check.json`,
    JSON.stringify(
      await page
        .locator('[aria-hidden=true][style*="aspect-ratio"]')
        .evaluateAll((els) =>
          els.map((el) => ({
            width: el.getBoundingClientRect().width,
            content: el.firstChild.getBoundingClientRect().width,
            scale: getComputedStyle(el.firstChild).transform,
          })),
        ),
      null,
      2,
    ),
  )
} finally {
  await browser.close()
  server.kill()
}
