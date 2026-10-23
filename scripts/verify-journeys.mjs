import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { CASES } from '../src/data/cases.js'

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5181'],
  { stdio: 'pipe', windowsHide: true },
)
await new Promise((resolve) =>
  server.stdout.on('data', (data) => {
    if (data.toString().includes('Local:')) resolve()
  }),
)
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
})
const results = []
const errors = []
async function newPage(options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    ...options,
  })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('http://127.0.0.1:5181')
  return page
}
async function rule(page) {
  await page.getByText('Choose a named region instead', { exact: true }).click()
  await page.getByRole('button', { name: 'Named interface regions' }).count() // region group contains semantic buttons below
  await page
    .locator('[aria-label="Named interface regions"] button')
    .first()
    .click()
  await page
    .getByRole('textbox', { name: 'Marker 1 observation' })
    .fill('The primary region determines where attention goes.')
  await page
    .getByRole('button', { name: 'Needs Revision', exact: true })
    .click()
  await page
    .getByRole('textbox', { name: /Your ruling/ })
    .fill('The evidence suggests a hierarchy worth reconsidering.')
  const confidence = page.getByRole('button', {
    name: 'On balance.',
    exact: true,
  })
  if (await confidence.count()) await confidence.click()
  await page.getByRole('button', { name: /Submit.*verdict/ }).click()
  await page.getByRole('tab', { name: 'Your view', exact: true }).waitFor()
}
async function next(page, sealed = false) {
  if (!sealed)
    await page.getByRole('tab', { name: 'Scanner', exact: true }).click()
  await page
    .getByRole('button', {
      name: sealed ? 'The record →' : 'Next Case →',
      exact: true,
    })
    .click()
}
try {
  const page = await newPage()
  await page.goto('http://127.0.0.1:5181/#view=coldopen')
  await page.reload()
  await rule(page)
  await next(page)
  await page.getByRole('heading', { name: 'The case index.' }).waitFor()
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('design-eye-profile'))
          .coldOpenCompleted,
    ),
    true,
  )
  await page.reload()
  await page.getByRole('heading', { name: 'The case index.' }).waitFor()
  results.push(
    'Primary cover → cold open → comparison → index, including reload: PASS',
  )
  for (let i = 1; i < CASES.length; i++) {
    const c = CASES[i]
    const archive = page
      .locator('details')
      .filter({
        has: page
          .locator('summary')
          .filter({ hasText: 'Original ten-case archive' }),
      })
    if ((await archive.getAttribute('open')) === null)
      await archive.locator('summary').click()
    await archive
      .getByRole('button')
      .filter({ hasText: c.title })
      .first()
      .click()
    await page
      .getByRole('heading', { name: c.title, exact: true, level: 1 })
      .waitFor()
    await rule(page)
    if (c.caseStatus === 'sealed') {
      assert.equal(await page.getByRole('tab').count(), 1)
      assert.equal(
        await page
          .getByRole('button', { name: 'Compare with your evidence' })
          .count(),
        0,
      )
      await next(page, true)
    } else {
      await next(page)
      const continueButton = page.getByRole('button', {
        name: 'Continue Investigation →',
        exact: true,
      })
      await Promise.race([
        page.getByRole('heading', { name: 'The case index.' }).waitFor(),
        continueButton.waitFor(),
      ])
      if (await continueButton.isVisible()) await continueButton.click()
    }
  }
  await page
    .getByRole('heading', { name: 'The investigation record.' })
    .waitFor()
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('design-eye-profile')).submissions
          .length,
    ),
    10,
  )
  results.push(
    'All ten cases, movement unlocks, meet-panel, intermission, sealed privacy, final report: PASS',
  )
  await page
    .getByRole('button', { name: 'Restart Investigation', exact: true })
    .click()
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('design-eye-profile')).submissions
          .length,
    ),
    10,
  )
  await page
    .getByRole('button', { name: 'Erase progress and restart?', exact: true })
    .click()
  await page.getByRole('button', { name: 'Begin the investigation' }).waitFor()
  results.push('Report reset requires second action: PASS')
  await page.getByRole('button', { name: 'Case index ↗', exact: true }).click()
  await page
    .getByRole('button', { name: 'Take the five-minute path ↗', exact: true })
    .click()
  await page
    .getByRole('heading', {
      name: 'The Animated Portfolio',
      exact: true,
      level: 1,
    })
    .waitFor()
  await page.reload()
  await rule(page)
  await next(page)
  await rule(page)
  await next(page, true)
  await page
    .getByRole('heading', { name: 'The investigation record.' })
    .waitFor()
  results.push(
    'Five-minute path through contested and sealed cases to report: PASS',
  )
  const touch = await newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  })
  await touch.goto('http://127.0.0.1:5181/#view=coldopen')
  await touch.reload()
  const viewer = touch.getByRole('button', { name: /Mark hierarchy evidence/ })
  await viewer.scrollIntoViewIfNeeded()
  let box = await viewer.boundingBox()
  await touch.touchscreen.tap(box.x + box.width * 0.5, box.y + box.height * 0.3)
  await touch
    .getByRole('textbox', { name: 'Marker 1 observation' })
    .fill('Touch point')
  await touch.getByRole('button', { name: /Region$/ }).tap()
  await viewer.scrollIntoViewIfNeeded()
  box = await viewer.boundingBox()
  const cdp = await touch.context().newCDPSession(touch)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: box.x + box.width * 0.2, y: box.y + box.height * 0.3 }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: box.x + box.width * 0.7, y: box.y + box.height * 0.6 }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await touch
    .getByRole('textbox', { name: 'Marker 2 observation' })
    .fill('Touch rectangle')
  const region = touch
    .locator('button[aria-label^="Mark hierarchy"] span')
    .filter({ hasText: /^02$/ })
  const before = await region.evaluate((el) => ({
    left: el.style.left,
    width: el.style.width,
  }))
  await touch.setViewportSize({ width: 768, height: 1024 })
  const after = await region.evaluate((el) => ({
    left: el.style.left,
    width: el.style.width,
  }))
  assert.deepEqual(after, before)
  await touch.getByRole('button', { name: 'Remove evidence mark 1' }).click()
  assert.equal(
    await touch.getByRole('textbox', { name: /Marker .* observation/ }).count(),
    1,
  )
  results.push(
    'Emulated touch point + touch rectangle, geometry survives resize, mark removal: PASS',
  )
  // Genuine legacy shape, without optional rectangle fields.
  await touch.evaluate(() =>
    localStorage.setItem(
      'design-eye-profile',
      JSON.stringify({
        coldOpenCompleted: true,
        casesCompleted: 1,
        submissions: [
          {
            caseId: 'case-001',
            verdict: 'needs_revision',
            evidenceMap: [
              {
                id: 'legacy',
                x: 50,
                y: 40,
                lens: 'trust',
                note: 'Legacy point record',
              },
            ],
            evidenceTags: ['trust'],
            writtenRuling: 'An existing saved ruling.',
            confidence: 'confident',
            timestamp: 1,
          },
        ],
      }),
    ),
  )
  await touch.goto('http://127.0.0.1:5181/#view=archive')
  await touch.reload()
  await touch
    .locator('summary')
    .filter({ hasText: 'Original ten-case archive' })
    .click()
  await touch.getByRole('button', { name: /001 Mobile Banking/ }).click()
  await touch.getByText('Legacy point record', { exact: true }).waitFor()
  results.push(
    'Legacy point-only profile reopens as a readable saved comparison: PASS',
  )
  const normal = await newPage({ reducedMotion: 'no-preference' })
  const splitRegion = normal
    .locator(
      '[aria-label="The Split: one interface, competing readings"] > div',
    )
    .nth(1)
  const splitBounds = await splitRegion.boundingBox()
  await normal.mouse.move(
    splitBounds.x + splitBounds.width * 0.25,
    splitBounds.y + 30,
  )
  const splitValue = Number(
    await normal
      .getByRole('slider', { name: 'Split reveal position' })
      .inputValue(),
  )
  assert.ok(splitValue > 20 && splitValue < 30)
  await normal.goto('http://127.0.0.1:5181/#view=coldopen')
  await normal.reload()
  await rule(normal)
  const showAll = normal.getByRole('button', {
    name: 'Show all five',
    exact: true,
  })
  if (await showAll.isVisible()) await showAll.click()
  await normal.getByRole('tab', { name: 'Combined', exact: true }).click()
  await normal.getByRole('tab', { name: 'Your view', exact: true }).focus()
  await normal
    .getByRole('tab', { name: 'Your view', exact: true })
    .press('ArrowRight')
  assert.equal(
    await normal
      .getByRole('tab', { name: 'Scanner', exact: true })
      .getAttribute('aria-selected'),
    'true',
  )
  await normal
    .getByRole('button', { name: 'Compare with your evidence' })
    .click()
  const divider = normal.locator('[class*="revealDivider"]')
  await divider.scrollIntoViewIfNeeded()
  const handle = await divider.boundingBox()
  const stage = await normal.locator('[role="tabpanel"]').boundingBox()
  await normal.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  )
  await normal.mouse.down()
  await normal.mouse.move(
    stage.x + stage.width * 0.75,
    handle.y + handle.height / 2,
    { steps: 5 },
  )
  await normal.mouse.up()
  const position = Number(
    await normal
      .getByRole('slider', { name: 'Perspective comparison divider' })
      .inputValue(),
  )
  assert.ok(position > 70 && position < 80)
  results.push(
    'Normal motion: Split follows pointer, reveal-all stays available, juror arrow keys and direct divider drag: PASS',
  )
  assert.deepEqual(errors, [])
  results.push('Runtime errors: none')
} finally {
  writeFileSync(
    `${process.env.VERIFY_OUT ?? 'output/playwright'}/journeys.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
  await browser.close()
  server.kill()
}
console.log(results.join('\n'))
