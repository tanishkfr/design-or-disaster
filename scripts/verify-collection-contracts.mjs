import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { CASES } from '../src/data/cases.js'
import { CURATED_IDS } from '../src/investigation/capabilities.js'
import { createInvestigation } from '../src/investigation/engine.js'
import {
  spatialPositions,
  perspectiveFrames,
} from '../src/investigation/perspectives.js'
const root = process.env.VERIFY_OUT ?? 'output/phase-2.2',
  key = 'design-disaster-investigations-v1',
  base = 'http://127.0.0.1:5191'
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5191'],
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
  context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: 'reduce',
  }),
  page = await context.newPage(),
  results = [],
  errors = []
page.on('pageerror', (error) => errors.push(error.message))
const store = JSON.parse(readFileSync(`${root}/complete-store.json`, 'utf8'))
async function route(view, id) {
  await page.goto(`${base}/#view=${view}${id ? '&case=' + id : ''}`)
  await page.reload()
}
try {
  await page.goto(base)
  await page.evaluate(
    ({ key, store }) => localStorage.setItem(key, JSON.stringify(store)),
    { key, store },
  )
  for (const id of CURATED_IDS) {
    await route('perspectives', id)
    if (id === 'case-015') {
      await page
        .getByRole('heading', {
          name: 'This record has no outside interpretation.',
        })
        .waitFor()
      assert.equal(
        await page
          .getByRole('group', { name: 'Authored perspectives' })
          .count(),
        0,
      )
      results.push(
        'Sealed perspective deep link discloses no authored material',
      )
      continue
    }
    const data = CASES.find((c) => c.id === id),
      frame = perspectiveFrames(store.records[id], data)[0],
      position = spatialPositions(id, frame).find((p) => p.lens === 'hierarchy')
    await page
      .getByRole('button', { name: 'The Scanner', exact: true })
      .waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    )
    const region = page.locator('[class*="authoredRegion"]').first()
    await region.waitFor()
    const stage = page.locator('[class*="comparison"]').first()
    const { s, r } = await stage.evaluate((el) => ({
      s: el.getBoundingClientRect().toJSON(),
      r: el
        .querySelector('[class*=authoredRegion]')
        .getBoundingClientRect()
        .toJSON(),
    }))
    assert.ok(
      Math.abs(r.x - (s.x + (s.width * position.target.left) / 100)) < 1.5,
    )
    assert.ok(
      Math.abs(r.y - (s.y + (s.height * position.target.top) / 100)) < 1.5,
    )
    const range = page.getByRole('slider', {
      name: 'Perspective reveal divider',
    })
    await range.fill('44')
    await page.getByRole('button', { name: 'The Romantic', exact: true }).tap()
    assert.equal(await range.inputValue(), '44')
    await page.getByRole('button', { name: 'All layers', exact: true }).tap()
    await page.screenshot({
      path: `${root}/mobile-${id}-all-layers.png`,
      fullPage: true,
    })
    results.push(
      `${id}: authored rectangle matches captured geometry; touch perspective switch preserves reveal`,
    )
  }
  await route('archive')
  const legacyArchive = page.locator('details').filter({
    has: page
      .locator('summary')
      .filter({ hasText: 'Original ten-case archive' }),
  })
  assert.ok(
    (await legacyArchive.locator('summary').innerText()).includes(
      '0 single-look rulings',
    ),
  )
  await legacyArchive.locator('summary').click()
  assert.ok(
    (
      await legacyArchive
        .getByRole('button', { name: /001 Mobile Banking Dashboard/ })
        .innerText()
    ).includes('Second Look saved'),
  )
  await page.screenshot({
    path: `${root}/mobile-legacy-archive-with-v2-records.png`,
    fullPage: true,
  })
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  )
  results.push(
    'Archive distinguishes Second Look completion from genuine single-look rulings',
  )
  await route('investigation', 'case-001')
  await page.getByRole('button', { name: 'New attempt', exact: true }).tap()
  await page
    .getByRole('button', { name: 'Confirm new attempt', exact: true })
    .tap()
  await page.getByRole('button', { name: 'Mark', exact: true }).tap()
  const viewer = page.getByRole('button', {
    name: /Mark unclassified evidence/,
  })
  await viewer.scrollIntoViewIfNeeded()
  let b = await viewer.boundingBox()
  await page.touchscreen.tap(b.x + b.width * 0.3, b.y + b.height * 0.3)
  await page
    .getByRole('textbox', { name: 'Marker 1 observation' })
    .fill('The controls form an equal row.')
  await page
    .getByRole('combobox', { name: 'Evidence classification' })
    .selectOption('hierarchy')
  await page.getByRole('button', { name: /Region$/ }).tap()
  await viewer.scrollIntoViewIfNeeded()
  b = await viewer.boundingBox()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: b.x + b.width * 0.2, y: b.y + b.height * 0.25 }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: b.x + b.width * 0.7, y: b.y + b.height * 0.5 }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await page
    .getByRole('textbox', { name: 'Marker 2 observation' })
    .fill('A touch rectangle records this region.')
  let current = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).records['case-001'],
    key,
  )
  assert.equal(current.firstLook.marks.length, 2)
  assert.ok(current.firstLook.marks[1].width > 40)
  assert.equal(current.firstLook.exhibit.screen, 'dashboard')
  const marks = JSON.stringify(current.firstLook.marks),
    snapshot = current.firstLook.snapshots[current.firstLook.activeSnapshotId]
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
  const element = viewer.locator('span').filter({ hasText: /^02$/ }).first()
  const box = await element.boundingBox(),
    host = await viewer.boundingBox(),
    m = current.firstLook.marks[1]
  await page.screenshot({
    path: `${root}/touch-resize-check.png`,
    fullPage: true,
  })
  assert.ok(Math.abs(box.x - (host.x + (host.width * m.x) / 100)) < 2)
  assert.ok(Math.abs(box.width - (host.width * m.width) / 100) < 2)
  const content = await viewer
    .locator('[data-evidence-region="quick-actions"]')
    .boundingBox()
  const target = snapshot.targets.find((t) => t.id === 'quick-actions')
  assert.ok(
    Math.abs(content.x - (host.x + (host.width * target.left) / 100)) < 2,
  )
  await page.reload()
  await page.getByRole('button', { name: 'Mark', exact: true }).click()
  current = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).records['case-001'],
    key,
  )
  assert.equal(JSON.stringify(current.firstLook.marks), marks)
  results.push(
    'V2 touch point and rectangle, explicit lens, frozen action isolation, real resize geometry and reload: PASS',
  )
  const other = await context.newPage()
  await other.goto(`${base}/#view=investigation&case=case-001`)
  await other.getByRole('button', { name: 'Mark', exact: true }).click()
  await other
    .getByRole('textbox', { name: 'Marker 1 observation' })
    .fill('A second tab revised this draft.')
  await page
    .getByRole('textbox', { name: 'Marker 1 observation' })
    .filter({ visible: true })
    .waitFor()
  await page.waitForFunction(
    () =>
      document.querySelector('[aria-label="Marker 1 observation"]')?.value ===
      'A second tab revised this draft.',
  )
  await other.close()
  results.push('V2 interactive draft propagates across tabs')
  const partial = {
    ...store,
    records: {
      'case-006': store.records['case-006'],
      'case-010': createInvestigation('case-010', 'partial', Date.now()),
    },
  }
  await page.evaluate(
    ({ key, partial }) => localStorage.setItem(key, JSON.stringify(partial)),
    { key, partial },
  )
  await route('designeye')
  await page
    .getByText('1 / 5 investigations complete.', { exact: false })
    .waitFor()
  await page.screenshot({ path: `${root}/partial-report.png`, fullPage: true })
  results.push(
    'Partial report distinguishes one complete, one unfinished and three unstarted cases',
  )
  await context.addInitScript((key) => {
    localStorage.removeItem(key)
    localStorage.setItem(
      'design-eye-profile',
      JSON.stringify({
        coldOpenCompleted: true,
        submissions: [
          {
            caseId: 'case-001',
            verdict: 'needs_revision',
            confidence: null,
            writtenRuling: 'An original single-look statement.',
            evidenceMap: [],
            evidenceTags: [],
            timestamp: 1,
          },
        ],
        casesCompleted: 1,
      }),
    )
  }, key)
  await route('designeye')
  await page
    .getByText('0 / 5 investigations complete.', { exact: false })
    .waitFor()
  await page
    .getByText('An original single-look statement.', { exact: true })
    .waitFor()
  await page.screenshot({
    path: `${root}/legacy-only-report.png`,
    fullPage: true,
  })
  results.push(
    'Legacy-only report retains original statement without manufactured before/after judgments',
  )
  await route('verdictchamber', 'case-015')
  await page.getByRole('heading', { name: 'The case index.' }).waitFor()
  results.push('Missing verdict deep link falls back safely')
  assert.deepEqual(errors, [])
  console.log(results.join('\n'))
} finally {
  writeFileSync(
    `${root}/collection-contracts.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
  await browser.close()
  server.kill()
}
