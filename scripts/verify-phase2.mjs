import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5179'],
  { stdio: 'pipe', windowsHide: true },
)
await new Promise((resolve, reject) => {
  server.stdout.on('data', (data) => {
    if (data.toString().includes('Local:')) resolve()
  })
  server.on('error', reject)
})
const out = process.env.VERIFY_OUT ?? 'output/playwright'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const results = []
const errors = []
async function capture(page, name) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }))
  assert.ok(
    dimensions.scroll <= dimensions.width,
    `${name}: overflow ${JSON.stringify(dimensions)}`,
  )
  results.push(`${name}: captured; no horizontal overflow`)
}
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['mobile', 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
      hasTouch: name === 'mobile',
    })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('http://127.0.0.1:5179')
    await page.getByRole('heading', { name: /DESIGN/ }).waitFor()
    await capture(page, `${name}-cover`)
    const split = page.getByRole('slider', { name: 'Split reveal position' })
    await split.focus()
    await split.press('Home')
    assert.equal(await split.inputValue(), '0')
    await split.press('End')
    assert.equal(await split.inputValue(), '100')
    await page.goto('http://127.0.0.1:5179/#view=coldopen')
    await page.reload()
    await page
      .getByRole('button', { name: /Mark hierarchy evidence/ })
      .waitFor()
    await capture(page, `${name}-coldopen`)
    await page.getByRole('button', { name: 'Return to cover' }).click()
    await page.goto('http://127.0.0.1:5179/?fixture=initial-index#view=archive')
    await page.reload()
    await page
      .locator('summary')
      .filter({ hasText: 'Original ten-case archive' })
      .click()
    await page.getByRole('heading', { name: 'The case index.' }).waitFor()
    await capture(page, `${name}-index`)
    await page.getByRole('button', { name: /001 Mobile Banking/ }).click()
    await page
      .getByRole('heading', {
        name: 'Mobile Banking Dashboard',
        exact: true,
        level: 1,
      })
      .waitFor()
    await page
      .getByRole('button', { name: /Mark hierarchy evidence/ })
      .waitFor()
    await capture(page, `${name}-workbench`)
    const viewer = page.getByRole('button', { name: /Mark hierarchy evidence/ })
    // Keyboard point placement and note editing.
    await viewer.focus()
    await viewer.press('ArrowRight')
    await viewer.press('Enter')
    await page
      .getByRole('textbox', { name: 'Marker 1 observation' })
      .fill('Primary actions have equal visual weight.')
    // Rectangle drag in either direction, then geometry editing.
    await page.getByRole('button', { name: /Region$/, exact: false }).click()
    await viewer.scrollIntoViewIfNeeded()
    const box = await viewer.boundingBox()
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.7)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.4, {
      steps: 6,
    })
    await page.mouse.up()
    await page
      .getByRole('textbox', { name: 'Marker 2 observation' })
      .fill('The action row competes with the balance.')
    await page.getByText('Classification & position', { exact: true }).click()
    await page
      .getByRole('spinbutton', { name: 'Evidence x percent' })
      .fill('15')
    await capture(page, `${name}-instrument`)
    await page
      .getByRole('button', { name: 'Strong Design', exact: true })
      .click()
    await page
      .getByRole('textbox', { name: /Your ruling/ })
      .fill('The restrained dashboard supports a familiar task.')
    await page.getByRole('button', { name: 'On balance.', exact: true }).click()
    await page
      .getByRole('button', { name: 'Submit verdict →', exact: true })
      .click()
    await page.getByRole('tab', { name: 'Your view', exact: true }).waitFor()
    // Perspective arrivals are bounded, even when motion is reduced.
    await page.getByRole('tab', { name: 'Scanner', exact: true }).click()
    await page
      .getByRole('button', { name: 'Compare with your evidence', exact: true })
      .click()
    const reveal = page.getByRole('slider', {
      name: 'Perspective comparison divider',
    })
    await reveal.focus()
    await reveal.press('Home')
    assert.equal(await reveal.inputValue(), '0')
    await reveal.press('End')
    assert.equal(await reveal.inputValue(), '100')
    await reveal.fill('50')
    await page
      .getByRole('button', { name: 'Next Case →', exact: true })
      .waitFor()
    await capture(page, `${name}-comparison`)
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('design-eye-profile')),
    )
    assert.equal(saved.submissions.length, 1)
    assert.equal(saved.submissions[0].evidenceMap.length, 2)
    assert.ok(saved.submissions[0].evidenceMap[1].width > 0)
    await page.reload()
    // Starting from index before cold-open completion still retains saved cases.
    await page.goto('http://127.0.0.1:5179/?fixture=saved-index#view=archive')
    await page.reload()
    await page
      .locator('summary')
      .filter({ hasText: 'Original ten-case archive' })
      .click()
    await page.getByRole('button', { name: /001 Mobile Banking/ }).click()
    await page.getByRole('tab', { name: 'Your view', exact: true }).waitFor()
    assert.ok(
      await page
        .getByText('Primary actions have equal visual weight.', { exact: true })
        .isVisible(),
    )
    await page.getByRole('button', { name: 'Return to archive' }).click()
    await page.getByRole('button', { name: 'Your Design Eye ↗' }).click()
    await page.getByRole('heading', { name: 'Your Design Eye.' }).waitFor()
    await capture(page, `${name}-report`)
    results.push(
      `${name}: Split keyboard, point keyboard, reverse rectangle drag, geometry edit, ruling, confidence, submission, Reveal keyboard, persistence and saved-record reopening PASS`,
    )
    await context.close()
  }
  assert.deepEqual(errors, [])
  results.push('No page errors in all three viewport journeys.')
} finally {
  writeFileSync(
    `${out}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
  await browser.close()
  server.kill()
}
console.log(results.join('\n'))
