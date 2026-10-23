export async function markFirst(
  page,
  note = 'The error summary and warning compete for attention.',
) {
  const viewer = page.getByRole('button', {
    name: /Mark unclassified evidence/,
  })
  await viewer.waitFor()
  await viewer.focus()
  await viewer.press('ArrowRight')
  await viewer.press('Enter')
  await page.getByRole('textbox', { name: 'Marker 1 observation' }).fill(note)
}
export async function submitJudgment(
  page,
  second = false,
  {
    verdict = 'Needs Revision',
    reason = 'The error summary makes the next action visible.',
    confidence = 'On balance',
  } = {},
) {
  await page.getByRole('button', { name: verdict, exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your reasoning', exact: true })
    .fill(reason)
  await page.getByRole('radio', { name: confidence, exact: true }).check()
  await page
    .getByRole('button', {
      name: second ? 'Seal second judgment →' : 'Seal first judgment →',
      exact: true,
    })
    .click()
}
export async function revealContext(page) {
  for (const title of [
    'A borrowed computer. A task to finish.',
    'What the image can—and cannot—tell you.',
    'Try the boundary between privacy and recovery.',
  ])
    await page.getByRole('button').filter({ hasText: title }).click()
  await page
    .getByRole('button', { name: 'Take a second look →', exact: true })
    .click()
}
export async function markSecond(
  page,
  note = 'The recovery route preserves a fictional draft.',
) {
  await page.getByRole('button', { name: 'Mark', exact: true }).click()
  const viewer = page.getByRole('button', {
    name: /Mark unclassified evidence/,
  })
  await viewer.focus()
  await viewer.press('Enter')
  await page.getByRole('textbox', { name: 'Marker 1 observation' }).fill(note)
}
export async function completeFlagship(page) {
  await markFirst(page)
  await page
    .getByRole('button', { name: 'Make first judgment →', exact: true })
    .click()
  await submitJudgment(page)
  await revealContext(page)
  await markSecond(page)
  await page
    .getByRole('button', { name: 'Make second judgment →', exact: true })
    .click()
  await submitJudgment(page, true)
  await page
    .getByRole('button', { name: 'Complete investigation →', exact: true })
    .click()
  await page
    .getByText('Your investigation is complete and saved in this browser.', {
      exact: true,
    })
    .waitFor()
}
