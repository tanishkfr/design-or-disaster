import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import {
  completeFlagship,
  markFirst,
} from './investigation-browser-helpers.mjs'

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5185'],
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
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const page = await context.newPage()
const results = [],
  errors = []
page.on('pageerror', (error) => errors.push(error.message))
const key = 'design-disaster-investigations-v1'
const old = {
  caseId: 'case-006',
  verdict: 'needs_revision',
  confidence: 'confident',
  confidenceInferred: false,
  evidenceMap: [
    {
      id: 'old-point',
      x: 50,
      y: 31,
      lens: 'trust',
      note: 'A legacy observation.',
    },
  ],
  evidenceTags: ['trust'],
  writtenRuling: 'An earlier single-look judgment.',
  timestamp: 1,
}
try {
  await page.goto('http://127.0.0.1:5185')
  await page.evaluate(
    (old) =>
      localStorage.setItem(
        'design-eye-profile',
        JSON.stringify({
          coldOpenCompleted: true,
          metPanel: false,
          casesCompleted: 1,
          submissions: [old],
        }),
      ),
    old,
  )
  await page.goto('http://127.0.0.1:5185/#view=archive');await page.reload()
  await page
    .getByRole('button').filter({has:page.getByRole('heading',{name:'The Benefits Form',exact:true})})
    .click()
  await page
    .getByRole('button', {
      name: 'Read your earlier single-look ruling',
      exact: true,
    })
    .click()
  await page.getByText('A legacy observation.', { exact: true }).waitFor()
  const before = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).records['case-006'],
    key,
  )
  assert.equal(before.secondJudgment, null)
  await page
    .getByRole('button', { name: 'Return to archive', exact: true })
    .click()
  await page
    .getByRole('button').filter({has:page.getByRole('heading',{name:'The Benefits Form',exact:true})})
    .click()
  await completeFlagship(page)
  const profile = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('design-eye-profile')),
  )
  assert.deepEqual(profile.submissions, [old])
  assert.equal(profile.casesCompleted, 1)
  results.push(
    'Legacy Benefits Form ruling remains readable and unchanged after Second Look completion; no duplicate completion: PASS',
  )
  await page.getByRole('button', { name: 'New attempt', exact: true }).click()
  let store = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  )
  assert.equal(store.records['case-006'].stage, 'COMPLETE')
  const completedId = store.records['case-006'].id
  await page
    .getByRole('button', { name: 'Confirm new attempt', exact: true })
    .click()
  await page
    .getByRole('heading', { name: 'What catches your attention?', exact: true })
    .waitFor()
  store = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  )
  assert.notEqual(store.records['case-006'].id, completedId)
  assert.equal(store.history['case-006'][0].id, completedId)
  await page
    .getByText('1 earlier completed attempt preserved', { exact: true })
    .click()
  await page.getByRole('button', { name: /Read attempt 1/ }).click()
  await page
    .getByText('Your investigation is complete and saved in this browser.', {
      exact: true,
    })
    .waitFor()
  assert.equal(
    await page
      .getByRole('textbox', { name: /What influenced/ })
      .getAttribute('readonly'),
    '',
  )
  await page
    .getByRole('button', { name: 'Return to current attempt', exact: true })
    .click()
  await page
    .getByRole('heading', { name: 'What catches your attention?', exact: true })
    .waitFor()
  await markFirst(page, 'The new attempt has separate evidence.')
  await page.reload()
  await page.getByRole('textbox', { name: 'Marker 1 observation' }).waitFor()
  assert.equal(
    await page
      .getByRole('textbox', { name: 'Marker 1 observation' })
      .inputValue(),
    'The new attempt has separate evidence.',
  )
  results.push(
    'Two-action restart, preserved completed history, read-only historical review and independent new attempt reload: PASS',
  )
  const other = await context.newPage()
  other.on('pageerror', (error) => errors.push(error.message))
  await other.goto('http://127.0.0.1:5185')
  await other
    .getByRole('textbox', { name: 'Marker 1 observation' })
    .fill('Updated from another tab.')
  await page.waitForFunction(
    () =>
      document.querySelector('[aria-label="Marker 1 observation"]')?.value ===
      'Updated from another tab.',
  )
  results.push(
    'Cross-tab storage events refresh the active investigation without overwriting its newer revision: PASS',
  )
  await other.close()
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), key)
  await page.reload()
  await page.getByRole('heading', { name: 'The case index.' }).waitFor()
  await page
    .getByRole('button').filter({has:page.getByRole('heading',{name:'The Benefits Form',exact:true})})
    .click()
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), key),
    '{broken',
  )
  assert.equal(
    (
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem('design-eye-profile')),
      )
    ).submissions.length,
    1,
  )
  assert.equal(await page.getByRole('alert').count(), 1)
  results.push(
    'Corrupted new-schema storage is reported and retained; legacy profile is untouched: PASS',
  )
  assert.deepEqual(errors, [])
} finally {
  writeFileSync(
    `${process.env.VERIFY_OUT ?? 'output/phase-2.1'}/contracts.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
  await browser.close()
  server.kill()
}
console.log(results.join('\n'))
