import { spawn } from 'node:child_process'
import { mkdirSync, openSync, closeSync, writeFileSync, readFileSync } from 'node:fs'

// Preserve every previous phase's artifacts; each suite owns a fresh directory.
const root = process.env.VERIFY_ROOT ?? 'output/release-candidate'
let resumeAt = process.env.VERIFY_FROM
const results = resumeAt ? JSON.parse(readFileSync(`${root}/regression-results.json`, 'utf8')).filter(result => result.code === 0) : []
async function run(name, script, environment = {}, args = []) {
  if (resumeAt && name !== resumeAt) return
  resumeAt = null
  const out = environment.VERIFY_OUT ?? `${root}/${name}`
  mkdirSync(out, { recursive: true })
  const log = `${root}/${name}.log`, fd = openSync(log, 'w')
  const started = Date.now()
  console.log(`START ${name}`)
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`scripts/${script}.mjs`, ...args], { env: { ...process.env, VERIFY_OUT: out, ...environment }, stdio: ['ignore', fd, fd], windowsHide: true })
    child.on('exit', resolve)
    child.on('error', reject)
  })
  closeSync(fd)
  results.push({ name, script, code, durationMs: Date.now() - started, log, out })
  writeFileSync(`${root}/regression-results.json`, JSON.stringify(results, null, 2))
  console.log(`${code === 0 ? 'PASS' : 'FAIL'} ${name}`)
  if (code !== 0) throw new Error(`${name} failed; inspect ${log}`)
}
for (const browser of ['chrome', 'edge', 'firefox'])
  await run(browser, 'verify-collection', { VERIFY_OUT: `${root}/${browser}`, VERIFY_BROWSER: browser, VERIFY_PREVIEW: '1' })
await run('collection-contracts', 'verify-collection-contracts', { VERIFY_OUT: `${root}/chrome` })
await run('exports', 'verify-exports', { VERIFY_OUT: `${root}/chrome` })
await run('investigation', 'verify-investigation')
await run('investigation-contracts', 'verify-investigation-contracts')
await run('journeys', 'verify-journeys')
await run('phase2', 'verify-phase2')
await run('refinements', 'verify-refinements', { VERIFY_FIXTURE: `${root}/chrome/complete-store.json` })
await run('surfaces', 'review-phase23', {}, ['after'])
await run('accessibility', 'review-release', { VERIFY_FIXTURE: `${root}/chrome/complete-store.json` })
await run('performance', 'measure-phase23')
