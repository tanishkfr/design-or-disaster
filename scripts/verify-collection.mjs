import { chromium, firefox } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import {
  CURATED_IDS,
  INVESTIGATIONS,
} from '../src/investigation/capabilities.js'
import { CASES } from '../src/data/cases.js'
import { markFirst, submitJudgment } from './investigation-browser-helpers.mjs'
const out = process.env.VERIFY_OUT ?? 'output/phase-2.2'
const browserName = process.env.VERIFY_BROWSER ?? 'chrome'
const preview = process.env.VERIFY_PREVIEW === '1'
mkdirSync(out, { recursive: true })
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', ...(preview ? ['preview'] : []), '--host', '127.0.0.1', '--port', '5188', '--strictPort'],
  { stdio: 'pipe', windowsHide: true },
)
await new Promise((resolve) =>
  server.stdout.on('data', (data) => {
    if (data.toString().includes('Local:')) resolve()
  }),
)
const browser = browserName === 'firefox'
  ? await firefox.launch({ executablePath: process.env.FIREFOX_PATH ?? 'C:/Users/User/AppData/Local/ms-playwright/firefox-1555/firefox/firefox.exe' })
  : await chromium.launch({ executablePath: browserName === 'edge'
    ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    : 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const results = [],
  errors = [],
  key = 'design-disaster-investigations-v1',
  base = 'http://127.0.0.1:5188'
let activePage
const observations = {
  'case-001': ['The equal-weight actions let me choose a route without a dominant prompt.', 'The receipt names the amount and recipient, making the demo result explicit.', 'quick-actions', 'transfer'],
  'case-006': ['The linked error summary offers a visible route back to incomplete fields.', 'The receipt distinguishes a local demo result from a real eligibility decision.', null, 'form-receipt'],
  'case-010': ['The expressive opening makes the designer’s visual voice part of the evidence.', 'The project states the designer’s role without claiming a commercial outcome.', 'expression', 'project-role'],
  'case-012': ['Prices and areas can be scanned before opening a listing.', 'Collection details help a decision, but the seller remains unverified.', 'listing-results', 'listing-trust'],
  'case-015': ['The blunt masthead gives the small collection a deliberate visual voice.', 'The bag records my chosen size and makes the absence of checkout explicit.', 'brand-expression', 'product-information'],
}
async function locateFinding(page, id, second = false) {
  await page.getByText('Classification & position', { exact: true }).click()
  const target = await page.evaluate(({ key, id, second, region }) => {
    const r = JSON.parse(localStorage.getItem(key)).records[id]
    const look = second ? r.secondLook : r.firstLook
    return look.snapshots?.[look.activeSnapshotId]?.targets.find((item) => item.id === region)
  }, { key, id, second, region: observations[id][second ? 3 : 2] })
  for (const [axis, value] of Object.entries(target ? { x: target.x, y: target.y } : { x: 48, y: 43 }))
    await page.getByRole('spinbutton', { name: `Evidence ${axis} percent`, exact: true }).fill(String(Math.round(value)))
  const lenses = { 'case-001': ['hierarchy', 'usability'], 'case-006': ['accessibility', 'trust'], 'case-010': ['delight', 'trust'], 'case-012': ['usability', 'trust'], 'case-015': ['delight', ''] }
  await page.getByRole('combobox', { name: 'Evidence classification', exact: true }).selectOption(lenses[id][second ? 1 : 0])
}
async function capture(page, name) {
  if (name.endsWith('-collection'))
    await page.getByRole('heading', { name: /The case/ }).waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true, animations: 'disabled' })
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    name + ' horizontal overflow',
  )
  results.push(name + ' / no horizontal overflow')
}
async function task(page, id) {
  if (id === 'case-001') {
    await page.getByRole('button', { name: 'Activity', exact: true }).click()
    await page
      .getByRole('textbox', { name: 'Find a transaction' })
      .fill('Northline')
    await page.getByRole('button', { name: /Northline refund/ }).click()
    await page.getByText('Reference DEMO-REFUND.', { exact: false }).waitFor()
    await page.getByRole('button', { name: 'Transfer', exact: true }).click()
    await page.getByRole('button', { name: 'Confirm demo transfer' }).click()
    await page.getByRole('alert').waitFor()
    await page
      .getByRole('textbox', { name: 'Demo recipient' })
      .fill('Alex Demo')
    await page.getByRole('textbox', { name: 'Demo amount' }).fill('12.40')
    await page.getByRole('button', { name: 'Confirm demo transfer' }).click()
    await page
      .getByRole('heading', { name: 'Demo transfer confirmed.' })
      .waitFor()
  } else if (id === 'case-006') {
    await page
      .getByRole('button', { name: 'Submit demo application', exact: true })
      .click()
    await page.getByRole('heading', { name: /There is a problem/ }).waitFor()
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
    await page.getByRole('checkbox').check()
    await page
      .getByRole('button', { name: 'Simulate interruption', exact: true })
      .click()
    await page
      .getByLabel('Demo recovery reference', { exact: true })
      .fill('TEST-1042')
    await page.getByRole('button', { name: 'Restore demo draft' }).click()
    assert.equal(
      await page
        .getByLabel('Fictional applicant name', { exact: true })
        .inputValue(),
      'Alex Sample',
    )
    await page
      .getByRole('button', { name: 'Submit demo application', exact: true })
      .click()
    await page
      .getByRole('heading', { name: 'Demo application received.' })
      .waitFor()
  } else if (id === 'case-010') {
    await page.getByRole('button', { name: 'Motion on', exact: true }).click()
    await page
      .getByRole('button', { name: 'Open Tidal / interaction design →' })
      .click()
    await page.getByText(/Role: interaction design, prototyping/).waitFor()
    await page.getByRole('button', { name: 'SIGNAL', exact: true }).click()
    await page.getByRole('button', { name: 'contact', exact: true }).click()
    await page.getByText('Fictional contact: mae@example.test').waitFor()
    await page.getByRole('button', { name: 'Back to selected work →' }).click()
  } else if (id === 'case-012') {
    await page.getByRole('button', { name: 'Furniture', exact: true }).click()
    await page
      .getByRole('textbox', { name: 'Search listings', exact: true })
      .fill('desk')
    await page
      .getByRole('spinbutton', { name: 'Maximum demo price (£)', exact: true })
      .fill('45')
    await page.getByRole('button', { name: /Solid wood desk/ }).click()
    await page.getByRole('button', { name: 'Save to demo shortlist' }).click()
    await page
      .getByRole('button', { name: '← Results, filters retained' })
      .click()
    assert.equal(
      await page
        .getByRole('textbox', { name: 'Search listings', exact: true })
        .inputValue(),
      'desk',
    )
    await page.getByText('1 fictional listings / 1 saved').waitFor()
  } else {
    await page.getByRole('button', { name: /FIELD COAT/ }).click()
    await page
      .getByRole('button', { name: 'ADD TO DEMO BAG', exact: true })
      .click()
    await page.getByRole('alert').waitFor()
    await page
      .getByRole('combobox', { name: 'Choose demo size', exact: true })
      .selectOption('M')
    await page
      .getByRole('button', { name: 'ADD TO DEMO BAG', exact: true })
      .click()
    await page.getByText('FIELD COAT / M', { exact: true }).waitFor()
  }
}
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['mobile', 390, 844],
    ...(process.env.VERIFY_COMPACT === '1' ? [['compact',320,844]] : []),
  ]) {
    if (process.env.VERIFY_VIEWPORT && process.env.VERIFY_VIEWPORT !== name) continue
    const context = await browser.newContext({
        acceptDownloads: true,
        viewport: { width, height },
        hasTouch: ['mobile','compact'].includes(name) && browserName !== 'firefox',
        reducedMotion: name === 'desktop' ? 'no-preference' : 'reduce',
      }),
      page = await context.newPage()
    activePage = page
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(base)
    await page
      .getByRole('button', { name: 'Case index ↗', exact: true })
      .click()
    await capture(page, name + '-collection')
    for (const id of CURATED_IDS) {
      const caseData = CASES.find((item) => item.id === id),
        config = INVESTIGATIONS[id]
      await page
        .getByRole('button')
        .filter({
          has: page.getByRole('heading', { name: caseData.title, exact: true }),
        })
        .click()
      await page
        .getByRole('heading', { name: 'What catches your attention?' })
        .waitFor()
      await capture(page, `${name}-${id}-first`)
      if (id !== 'case-006')
        await page.getByRole('button', { name: 'Mark', exact: true }).click()
      await markFirst(
        page,
        observations[id][0],
      )
      await locateFinding(page, id)
      // Leave the numeric edit normally before full-page capture. Resizing a
      // screenshot with it focused can restore Chrome's old focus scroll offset
      // between pointerdown/up on the next control (see diagnostic evidence).
      await page.keyboard.press('Tab')
      await capture(page, `${name}-${id}-marking`)
      await page
        .getByRole('button', { name: 'Make first judgment →', exact: true })
        .click()
      await submitJudgment(page, false, {
        reason:
          observations[id][0],
        confidence: 'On balance',
      })
      for (const document of config.context)
        await page
          .getByRole('button')
          .filter({ hasText: document.title })
          .click()
      await capture(page, `${name}-${id}-context`)
      await page
        .getByRole('button', { name: 'Take a second look →', exact: true })
        .click()
      await task(page, id)
      await capture(page, `${name}-${id}-task`)
      await page.reload()
      await page.getByRole('button', { name: 'Mark', exact: true }).click()
      await markFirst(
        page,
        observations[id][1],
      )
      await locateFinding(page, id, true)
      const stored = await page.evaluate(
        ({ key, id }) => JSON.parse(localStorage.getItem(key)).records[id],
        { key, id },
      )
      assert.ok(stored.secondLook.marks[0].frameId)
      assert.notEqual(
        stored.firstLook.marks[0].id,
        stored.secondLook.marks[0].id,
      )
      await page
        .getByRole('button', { name: 'Make second judgment →', exact: true })
        .click()
      await submitJudgment(page, true, {
        verdict: id === 'case-001' ? 'Strong Design' : 'Needs Revision',
        reason:
          id === 'case-010'
            ? observations[id][0]
            : observations[id][1],
        confidence: id === 'case-012' ? 'With reservation' : 'I stand by this',
      })
      await page
        .getByRole('button', { name: 'Complete investigation →', exact: true })
        .click()
      await page
        .getByText(
          'Your investigation is complete and saved in this browser.',
          { exact: true },
        )
        .waitFor()
      await capture(page, `${name}-${id}-reflection`)
      if (id !== 'case-015') {
        await page
          .getByRole('button', {
            name: 'Compare the authored jurors →',
            exact: true,
          })
          .click()
        await page.getByRole('heading', { name: /Same evidence/ }).waitFor()
        for (const label of [
          'The Scanner',
          'The Advocate',
          'The Operator',
          'The Skeptic',
          'The Romantic',
          'All layers',
        ])
          await page.getByRole('button', { name: label, exact: true }).click()
        await page
          .getByRole('button')
          .filter({
            hasText:
              config.exhibit.id === 'banking-v1'
                ? 'The equally weighted action row'
                : id === 'case-006'
                  ? 'The linked error summary'
                  : id === 'case-010'
                    ? 'The expressive project surface'
                    : 'The dense results list',
          })
          .click()
        const range = page.getByRole('slider', {
          name: 'Perspective reveal divider',
        })
        await range.focus()
        await range.press('Home')
        assert.equal(await range.inputValue(), '0')
        await range.press('End')
        assert.equal(await range.inputValue(), '100')
        await range.fill('45')
        await capture(page, `${name}-${id}-perspectives`)
        await page.reload()
        await page.getByRole('button', { name: '← Your reflection' }).click()
      } else {
        assert.equal(
          await page
            .getByRole('button', {
              name: 'Compare the authored jurors →',
              exact: true,
            })
            .count(),
          0,
        )
        assert.ok(
          !(await page.locator('main').innerText()).includes('The Scanner'),
        )
      }
      await page
        .getByRole('button', { name: '← Case index', exact: true })
        .click()
    }
    await page
      .getByRole('button', { name: 'Your Design Eye ↗', exact: true })
      .click()
    await page.getByRole('heading', { name: 'Your Design Eye.' }).waitFor()
    await capture(page, name + '-report')
    await page.reload()
    assert.ok(
      (await page.locator('main').innerText()).includes(
        '5 / 5 investigations complete.',
      ),
    )
    if (name === 'desktop') {
      const downloadEvent = page.waitForEvent('download')
      await page.getByRole('button', { name: 'Save summary PNG ↓' }).click()
      const download = await downloadEvent
      await download.saveAs(`${out}/design-eye-summary.png`)
      if (browserName !== 'firefox') await page.pdf({
        path: `${out}/design-eye-full.pdf`,
        printBackground: true,
        preferCSSPageSize: true,
      })
      writeFileSync(
        `${out}/complete-store.json`,
        await page.evaluate((key) => localStorage.getItem(key), key),
      )
      results.push(browserName === 'firefox' ? 'Actual PNG downloaded; Firefox PDF automation unavailable' : 'Actual PNG downloaded and PDF printed')
    }
    await page.goBack()
    await page.getByRole('heading', { name: /The case/ }).waitFor()
    await page.goForward()
    await page.getByRole('heading', { name: 'Your Design Eye.' }).waitFor()
    await context.close()
  }
  assert.deepEqual(errors, [])
  writeFileSync(
    `${out}/journey-results.json`,
    JSON.stringify({ browser: browserName, version: browser.version(), preview, results, errors }, null, 2),
  )
  console.log(JSON.stringify({ results, errors }, null, 2))
} catch (error) {
  if (activePage && !activePage.isClosed()) {
    await activePage.screenshot({ path: `${out}/failure.png`, fullPage: true })
    writeFileSync(`${out}/failure-dom.txt`, await activePage.locator('body').innerText())
  }
  console.error(error)
  writeFileSync(
    `${out}/failure.json`,
    JSON.stringify({ error: error.stack, results, errors }, null, 2),
  )
  throw error
} finally {
  await browser.close()
  server.kill()
}
