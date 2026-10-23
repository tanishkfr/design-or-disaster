import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import {
  markFirst,
  submitJudgment,
  revealContext,
} from './investigation-browser-helpers.mjs'

const out = process.env.VERIFY_OUT ?? 'output/phase-2.1'
mkdirSync(out, { recursive: true })
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5184'],
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
const results = [],
  errors = []
const key = 'design-disaster-investigations-v1'
const record = (page) =>
  page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).records['case-006'],
    key,
  )
async function capture(page, name) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => {})),
    ),
  )
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  const overflow = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }))
  assert.ok(
    overflow.scroll <= overflow.width,
    `${name}: overflow ${JSON.stringify(overflow)}`,
  )
  results.push(`${name}: captured, no overflow`)
}
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['mobile', 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: name === 'mobile',
      reducedMotion: name === 'desktop' ? 'no-preference' : 'reduce',
    })
    const page = await context.newPage()
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('http://127.0.0.1:5184')
    await page.getByRole('button', { name: 'Case index ↗' }).click()
    await page
      .getByRole('button').filter({has:page.getByRole('heading',{name:'The Benefits Form',exact:true})})
      .click()
    await page
      .getByRole('heading', {
        name: 'What catches your attention?',
        exact: true,
      })
      .waitFor()
    assert.equal(
      await page
        .getByRole('button', { name: 'Hierarchy', exact: true })
        .count(),
      0,
    )
    await capture(page, `${name}-first-look`)
    await markFirst(page)
    await page.reload()
    assert.equal((await record(page)).stage, 'FIRST_LOOK')
    await page.getByRole('textbox', { name: 'Marker 1 observation' }).waitFor()
    assert.equal(
      await page
        .getByRole('textbox', { name: 'Marker 1 observation' })
        .inputValue(),
      'The error summary and warning compete for attention.',
    )
    await page
      .getByRole('button', { name: 'Make first judgment →', exact: true })
      .click()
    await capture(page, `${name}-first-judgment`)
    await submitJudgment(page)
    const sealed = (await record(page)).firstJudgment
    await page.reload()
    assert.equal((await record(page)).stage, 'CONTEXT')
    await page
      .getByRole('button', { name: /What the image can—and cannot—tell you/ })
      .click()
    await capture(page, `${name}-context`)
    await revealContext(page)
    await page
      .getByRole('button', { name: 'Submit demo application', exact: true })
      .click()
    await page.getByRole('heading', { name: 'There is a problem' }).waitFor()
    assert.equal(
      await page.locator('[aria-label="Application errors"]').count(),
      1,
    )
    await capture(page, `${name}-validation`)
    // Capture the actual error state; a keyboard point must not activate the form.
    await page.getByRole('button', { name: 'Mark', exact: true }).click()
    const viewer = page.getByRole('button', {
      name: /Mark unclassified evidence/,
    })
    await viewer.focus()
    await viewer.press('ArrowDown')
    await viewer.press('Enter')
    await page
      .getByRole('textbox', { name: 'Marker 1 observation' })
      .fill('The linked error summary gives a way to recover.')
    const firstFrame = (await record(page)).secondLook.activeSnapshotId
    const eventsBefore = (await record(page)).secondLook.exhibit.events
    const percentBefore = await viewer
      .locator('span')
      .filter({ hasText: /^01$/ })
      .evaluate((el) => ({ x: el.style.left, y: el.style.top }))
    await page.setViewportSize({
      width: width === 390 ? 768 : 390,
      height: 844,
    })
    const percentAfter = await viewer
      .locator('span')
      .filter({ hasText: /^01$/ })
      .evaluate((el) => ({ x: el.style.left, y: el.style.top }))
    assert.deepEqual(percentAfter, percentBefore)
    const actualPosition = await viewer.evaluate((element) => {
      const mark = [...element.querySelectorAll('span')].find(
        (item) => item.textContent.trim() === '01',
      )
      const bounds = element.getBoundingClientRect(),
        point = mark.getBoundingClientRect()
      return {
        x: ((point.x + point.width / 2 - bounds.x) / bounds.width) * 100,
        y: ((point.y + point.height / 2 - bounds.y) / bounds.height) * 100,
      }
    })
    assert.ok(
      Math.abs(actualPosition.x - 50) < 0.2 &&
        Math.abs(actualPosition.y - 55) < 0.2,
      'Rendered mark geometry must match its stored coordinates after resize',
    )
    assert.deepEqual(
      (await record(page)).secondLook.exhibit.events,
      eventsBefore,
    )
    await page.setViewportSize({ width, height })
    await capture(page, `${name}-mark-errors`)
    await page.getByRole('button', { name: 'Explore', exact: true }).click()
    await page
      .getByRole('link', {
        name: 'Use the fictional name Alex Sample.',
        exact: true,
      })
      .click()
    assert.equal(
      await page
        .locator('#demo-name')
        .evaluate((el) => document.activeElement === el),
      true,
    )
    await page
      .getByLabel('Fictional applicant name', { exact: true })
      .fill('Alex Sample')
    await page.getByLabel('Demo reference', { exact: true }).fill('TEST-1042')
    await page
      .getByLabel('Assistance to explore', { exact: true })
      .selectOption('food')
    await page
      .getByLabel('Fictional reply route', { exact: true })
      .selectOption('library')
    await page
      .getByRole('checkbox', {
        name: 'I am using fictional details for this demonstration.',
      })
      .check()
    // Switching modes while a field is focused preserves the input state.
    await page.locator('#demo-name').focus()
    await page.getByRole('button', { name: 'Mark', exact: true }).click()
    await page.getByRole('button', { name: 'Explore', exact: true }).click()
    assert.equal(await page.locator('#demo-name').inputValue(), 'Alex Sample')
    await page
      .getByRole('button', { name: 'Simulate interruption', exact: true })
      .click()
    assert.equal(await page.locator('#demo-name').count(), 0)
    await page.reload()
    await page
      .getByRole('heading', { name: 'Session interrupted.', exact: true })
      .waitFor()
    await capture(page, `${name}-interruption`)
    await page
      .getByRole('button', { name: 'Restore demo draft', exact: true })
      .click()
    await page
      .getByText('Use TEST-1042 to restore the fictional draft.', {
        exact: true,
      })
      .waitFor()
    await page
      .getByLabel('Demo recovery reference', { exact: true })
      .fill('TEST-1042')
    await page
      .getByRole('button', { name: 'Restore demo draft', exact: true })
      .click()
    assert.equal(await page.locator('#demo-name').inputValue(), 'Alex Sample')
    await page
      .getByRole('button', { name: 'Submit demo application', exact: true })
      .click()
    await page
      .getByRole('heading', { name: 'Demo application received.', exact: true })
      .waitFor()
    await page.getByRole('button', { name: 'Mark', exact: true }).click()
    await page.getByRole('button', { name: /Region$/ }).click()
    const receiptViewer = page.getByRole('button', {
      name: /Mark unclassified evidence/,
    })
    await receiptViewer.scrollIntoViewIfNeeded()
    const bounds = await receiptViewer.boundingBox()
    if (name === 'mobile') {
      const cdp = await context.newCDPSession(page)
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [
          {
            x: bounds.x + bounds.width * 0.15,
            y: bounds.y + bounds.height * 0.15,
          },
        ],
      })
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          {
            x: bounds.x + bounds.width * 0.8,
            y: bounds.y + bounds.height * 0.4,
          },
        ],
      })
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      })
    } else {
      await page.mouse.move(
        bounds.x + bounds.width * 0.15,
        bounds.y + bounds.height * 0.15,
      )
      await page.mouse.down()
      await page.mouse.move(
        bounds.x + bounds.width * 0.8,
        bounds.y + bounds.height * 0.4,
        { steps: 5 },
      )
      await page.mouse.up()
    }
    await page
      .getByRole('textbox', { name: 'Marker 1 observation' })
      .fill('Completion confirms where the demo task ends.')
    await page.getByText('Classification & position', { exact: true }).click()
    await page
      .getByRole('spinbutton', { name: 'Evidence x percent' })
      .fill('12')
    await capture(page, `${name}-second-look`)
    const marked = (await record(page)).secondLook.marks
    assert.equal(marked.length, 2)
    assert.equal(marked[0].frameId, firstFrame)
    assert.ok(marked[1].width > 0)
    await page
      .getByRole('button', { name: 'Make second judgment →', exact: true })
      .click()
    await submitJudgment(page, true, {
      verdict: name === 'desktop' ? 'Strong Design' : 'Needs Revision',
      reason:
        name === 'mobile'
          ? 'The error summary makes the next action visible.'
          : 'Recovering the fictional draft adds a useful path through the interruption.',
    })
    await page.reload()
    assert.equal((await record(page)).stage, 'REFLECTION')
    assert.deepEqual((await record(page)).firstJudgment, sealed)
    await capture(page, `${name}-reflection`)
    await page
      .getByRole('textbox', { name: /What influenced your decision/ })
      .fill(
        'The recovery behavior mattered; it did not erase the visual concerns.',
      )
    await page
      .getByRole('button', { name: 'Complete investigation →', exact: true })
      .click()
    await page
      .getByText('Your investigation is complete and saved in this browser.', {
        exact: true,
      })
      .waitFor()
    await page.getByRole('button', { name: 'Case index', exact: false }).click()
    await page
      .getByRole('button').filter({has:page.getByRole('heading',{name:'The Benefits Form',exact:true})})
      .waitFor()
    await page.reload()
    const profile = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('design-eye-profile')),
    )
    assert.equal(
      profile.submissions.filter((s) => s.caseId === 'case-006').length,
      1,
    )
    assert.equal(profile.casesCompleted, 1)
    results.push(
      `${name}: full first/context/second/reflection loop, reload at four stages, independent judgments, validation, interruption/recovery, Explore/Mark isolation, responsive coordinates, completion projection PASS`,
    )
    await context.close()
  }
  assert.deepEqual(errors, [])
} finally {
  writeFileSync(
    `${out}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
  await browser.close()
  server.kill()
}
console.log(results.join('\n'))
