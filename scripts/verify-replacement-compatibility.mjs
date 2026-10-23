import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { CASES } from '../src/data/cases.js'

const out='output/final-fixes/replacement-compatibility'
mkdirSync(out,{recursive:true})
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5214','--strictPort'],{stdio:'pipe',windowsHide:true})
await new Promise((resolve,reject)=>{server.stdout.on('data',d=>d.toString().includes('Local:')&&resolve());server.on('error',reject)})
const browser=await chromium.launch({channel:'chrome'})
const results=[]
try {
 for(const id of ['case-002','case-011','case-012']) {
  const page=await browser.newPage({reducedMotion:'reduce'})
  const submission={caseId:id,verdict:'needs_revision',evidenceMap:[{id:'legacy',x:50,y:40,lens:'trust',note:'Synthetic old-image observation'}],evidenceTags:['trust'],writtenRuling:'An existing synthetic saved ruling.',confidence:'confident',timestamp:1}
  await page.goto('http://127.0.0.1:5214')
  await page.evaluate(record=>localStorage.setItem('design-eye-profile',JSON.stringify({coldOpenCompleted:true,casesCompleted:1,submissions:[record]})),submission)
  await page.goto('http://127.0.0.1:5214/#view=archive');await page.reload()
  await page.locator('summary').filter({hasText:'Original ten-case archive'}).click()
  await page.locator('details button').filter({hasText:CASES.find(c=>c.id===id).title}).click()
  await page.getByText('Synthetic old-image observation',{exact:true}).waitFor()
  await page.getByText(CASES.find(c=>c.id===id).imageNotice,{exact:true}).waitFor()
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('design-eye-profile')).submissions[0])
  assert.deepEqual(saved,submission,'Replacement must preserve the existing judgment and coordinates')
  await page.screenshot({path:`${out}/${id}-saved-record.png`,fullPage:true})
  results.push({id,noticeVisible:true,recordUnchanged:true})
  await page.close()
 }
 writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2))
 console.log(JSON.stringify(results))
} finally {await browser.close();server.kill()}
