import { chromium, firefox } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { CASES } from '../src/data/cases.js'
import { CURATED_IDS } from '../src/investigation/capabilities.js'

const out=process.env.VERIFY_OUT??'output/final-fixes/before'
mkdirSync(out,{recursive:true})
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5212','--strictPort'],{stdio:'pipe',windowsHide:true})
const kind=process.env.VERIFY_BROWSER??'chrome'
const browser=kind==='firefox'?await firefox.launch({executablePath:'C:/Users/User/AppData/Local/ms-playwright/firefox-1555/firefox/firefox.exe'}):await chromium.launch({channel:kind==='edge'?'msedge':'chrome'})
const results=[]
const questions={
 'case-001':'When does calm become equal weight?',
 'case-006':'What should a shared screen remember?',
 'case-010':'How much expression helps you see the work?',
 'case-012':'Can density help you find what matters?',
 'case-015':'What earns trust beyond the first impression?',
}
try{
 await new Promise((resolve,reject)=>{server.stdout.on('data',d=>d.toString().includes('Local:')&&resolve());server.on('error',reject)})
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
 await page.goto('http://127.0.0.1:5212/#view=archive')
 await page.evaluate(()=>document.fonts.ready)
 const inspect=async(id,label)=>{
   const state=await page.locator('[class*="collectionPreview"]').evaluate(el=>({caption:el.querySelector('[class*="previewCaption"]').textContent,question:el.querySelector('h3').textContent,case:el.querySelector('[data-case]').dataset.case,src:el.querySelector('img').getAttribute('src'),currentSrc:el.querySelector('img').currentSrc,active:document.querySelector('[class*="activeCase"] h3')?.textContent,focused:document.activeElement.textContent.slice(0,90)}))
   results.push({id,label,...state})
   return state
 }
 for(const id of CURATED_IDS){
  const row=page.getByRole('button').filter({has:page.getByRole('heading',{name:CASES.find(c=>c.id===id).title,exact:true})})
  await row.hover(); await row.focus()
  await inspect(id,'before-scroll')
  await page.evaluate(()=>window.scrollTo(0,0))
  await page.locator('[class*="collectionPreview"] img').evaluate(img=>img.decode())
  await page.screenshot({path:`${out}/desktop-preview-${id}.png`,fullPage:true})
  const state=await inspect(id,'after-capture')
  if(process.env.ASSERT_SYNC==='1'){
   assert.equal(state.case,id)
   assert.equal(state.src,`/previews/${id}.png`)
   assert.equal(state.active,CASES.find(c=>c.id===id).title)
   assert.ok(state.caption.includes(CASES.find(c=>c.id===id).number))
   assert.equal(state.question,questions[id])
   const misleading=await page.locator('[data-catalogue-case]').evaluateAll(rows=>rows.filter(row=>!row.className.includes('activeCase')&&getComputedStyle(row.querySelector('h3')).color==='rgb(255, 99, 77)').length)
   assert.equal(misleading,0,'Signal color must identify only the selected preview')
  }
 }
 if(process.env.ASSERT_SYNC==='1'){
  for(const reducedMotion of ['reduce','no-preference']){
   await page.emulateMedia({reducedMotion})
   for(const id of [...CURATED_IDS,...CURATED_IDS].reverse()){
    const row=page.locator(`[data-catalogue-case="${id}"] > button`).first()
    await row.hover()
    await page.waitForFunction(id=>document.querySelector('[class*="collectionPreview"]').dataset.previewCase===id,id)
    const state=await inspect(id,`rapid-${reducedMotion}`)
    assert.equal(state.question,questions[id])
    assert.equal(state.src,`/previews/${id}.png`)
   }
  }
  await page.mouse.move(1400,10)
  await page.reload()
  for(const id of CURATED_IDS){
   const row=page.locator(`[data-catalogue-case="${id}"] > button`).first()
   let tabs=0
   while(!await row.evaluate(el=>el===document.activeElement)){
    assert.ok(++tabs<40,'Catalogue row reachable in sequential Tab order')
    await page.keyboard.press('Tab')
   }
   const state=await inspect(id,'tab-only')
   assert.equal(state.case,id)
   assert.equal(state.question,questions[id])
  }
  for(const width of [320,375,390,430,768]){
   await page.setViewportSize({width,height:844})
   await page.goto('http://127.0.0.1:5212/?state='+width+'#view=archive')
   if(width<651){
    for(const id of CURATED_IDS){
     const title=CASES.find(c=>c.id===id).title
     const toggle=page.getByRole('button',{name:`Preview ${title}`,exact:true})
     await toggle.click()
     const panel=page.locator(`#preview-${id}`)
     assert.equal(await panel.getAttribute('data-preview-case'),id)
     assert.equal(await panel.locator('h3').innerText(),questions[id])
     await panel.locator('img').evaluate(img=>img.decode())
     assert.equal(await toggle.getAttribute('aria-expanded'),'true')
     await toggle.click()
    }
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   results.push({width,label:'mobile-preview-and-reflow',pass:true})
  }
 }
 writeFileSync(`${out}/preview-states.json`,JSON.stringify({browser:browser.version(),results},null,2))
 console.log(JSON.stringify(results,null,2))
}finally{await browser.close();server.kill()}
