import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { CASES } from '../src/data/cases.js'
import { CURATED_IDS } from '../src/investigation/capabilities.js'

const out = process.env.VERIFY_OUT ?? 'output/excellence/acceptance'
const fixture = process.env.VERIFY_FIXTURE ?? 'output/excellence/verified/chrome/complete-store.json'
mkdirSync(out,{recursive:true})
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5211','--strictPort'],{stdio:'pipe',windowsHide:true})
const browser=await chromium.launch({channel:'chrome'})
const results=[],errors=[]
try {
  await new Promise((resolve,reject)=>{server.stdout.on('data',d=>d.toString().includes('Local:')&&resolve());server.on('error',reject)})
  const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true,reducedMotion:'reduce'})
  const page=await context.newPage()
  page.on('pageerror',e=>errors.push(e.message))
  const base='http://127.0.0.1:5211'
  const button=name=>page.getByRole('button',{name,exact:true})
  await page.goto(`${base}/#view=archive`)
  for(const id of CURATED_IDS) {
    const row=page.getByRole('button').filter({has:page.getByRole('heading',{name:CASES.find(c=>c.id===id).title,exact:true})})
    await row.hover()
    assert.equal(await page.locator('[class*="collectionPreview"] img').getAttribute('src'),`/previews/${id}.png`)
    await row.focus()
    assert.equal(await page.locator('[class*="collectionPreview"] img').getAttribute('src'),`/previews/${id}.png`)
    await page.evaluate(()=>window.scrollTo(0,0))
    await page.screenshot({path:`${out}/desktop-preview-${id}.png`,fullPage:true})
  }
  results.push('All five catalogue previews respond to hover and keyboard focus; real image paths match selection')
  for(const width of [768,390,320]) {
    await page.setViewportSize({width,height:844})
    for(const id of CURATED_IDS) {
      if(width<651) {
        const toggle=button(`Preview ${CASES.find(c=>c.id===id).title}`)
        await toggle.click()
        assert.equal(await toggle.getAttribute('aria-expanded'),'true')
        await page.locator(`#preview-${id} img`).waitFor({state:'visible'})
        assert.equal(await page.locator('[class*="mobilePreview"]').count(),1)
        await page.screenshot({path:`${out}/${width}-preview-${id}.png`,fullPage:true})
        await toggle.click()
        assert.equal(await toggle.getAttribute('aria-expanded'),'false')
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
    }
  }
  results.push('390/320 previews expand one at a time, collapse explicitly and retain direct entry; 768/390/320 no overflow')
  await page.setViewportSize({width:1440,height:900})
  await page.getByRole('button').filter({has:page.getByRole('heading',{name:'Mobile Banking Dashboard',exact:true})}).click()
  await button('Mark').click()
  const viewer=page.getByRole('button',{name:/Mark unclassified evidence/})
  await viewer.scrollIntoViewIfNeeded()
  await viewer.click({position:{x:150,y:170}})
  await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Marker 1 observation')
  const note=page.getByRole('textbox',{name:'Marker 1 observation'})
  await note.fill('A long observation remains readable and editable beside the selected mark. The same frame is retained.')
  await viewer.click({position:{x:150,y:170}})
  await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Marker 1 observation')
  assert.equal(await page.getByRole('textbox',{name:/Marker \d observation/}).count(),1)
  assert.ok(await note.evaluate(el=>document.activeElement===el))
  assert.ok(await note.inputValue())
  const position=await note.boundingBox()
  const frame=await viewer.boundingBox()
  assert.ok(position.x>frame.x+frame.width)
  assert.ok(position.y>=0&&position.y+position.height<=900)
  await page.setViewportSize({width:390,height:844})
  await page.locator('[class*="stageDisclosure"] > summary').click()
  await page.getByRole('navigation',{name:'Investigation stages'}).waitFor({state:'visible'})
  await page.locator('[class*="stageDisclosure"] > summary').click()
  await page.setViewportSize({width:1440,height:900})
  await page.getByRole('navigation',{name:'Investigation stages'}).waitFor({state:'visible'})
  results.push('Pointer reselects an existing mark without duplicating it; note receives focus in the adjacent visible inspector')
  results.push('Compact stage disclosure opens/closes and desktop navigation returns after viewport resize')
  await page.evaluate(store=>localStorage.setItem('design-disaster-investigations-v1',store),readFileSync(fixture,'utf8'))
  await page.goto(`${base}/#view=designeye`)
  await page.reload()
  await page.getByRole('heading',{name:'Your Design Eye.'}).waitFor()
  for(const [label,file] of [['Save one-page PNG ↓','design-eye-one-page.png'],['Save text HTML ↓','design-eye-text-record.html']]) {
    const pending=page.waitForEvent('download')
    await button(label).click()
    const download=await pending
    await download.saveAs(`${out}/${file}`)
    assert.equal(await download.failure(),null)
  }
  const dimensions=await page.evaluate(async()=>{
    const blob=await fetch('/previews/case-001.png').then(r=>r.blob())
    const bitmap=await createImageBitmap(blob)
    return {previewWidth:bitmap.width,previewHeight:bitmap.height}
  })
  const text=readFileSync(`${out}/design-eye-text-record.html`,'utf8')
  const store=JSON.parse(readFileSync(fixture,'utf8'))
  const escape=s=>s.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
  let statements=0
  for(const r of Object.values(store.records)) {
    for(const key of ['firstJudgment','secondJudgment']) {assert.ok(text.includes(escape(r[key].writtenRuling)));statements++}
    for(const look of [r.firstLook,r.secondLook]) for(const mark of look.marks) {assert.ok(text.includes(escape(mark.note)));statements++}
  }
  assert.ok(!text.includes('<script'))
  assert.ok(!text.includes('The Scanner'))
  results.push(`Actual compact PNG and portable text HTML downloaded; HTML preserves all ${statements} saved statements and sealed boundary`)
  const saved=await browser.newPage()
  await saved.goto(new URL(`file:///${process.cwd().replaceAll('\\','/')}/${out}/design-eye-text-record.html`).href)
  await saved.getByRole('heading',{name:'Your Design Eye.',exact:true}).waitFor()
  assert.equal(await saved.locator('main h2').count(),6)
  await saved.screenshot({path:`${out}/text-edition.png`,fullPage:true})
  await saved.close()
  assert.deepEqual(errors,[])
  writeFileSync(`${out}/results.json`,JSON.stringify({browser:browser.version(),results,errors,dimensions},null,2))
  console.log(JSON.stringify({results,errors},null,2))
} finally {await browser.close();server.kill()}
