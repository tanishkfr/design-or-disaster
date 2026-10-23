import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import assert from 'node:assert/strict'

const packaged = process.argv.includes('--package')
const root=packaged?'output/excellence/extracted-review':'portfolio-case-study'
const out='output/excellence/portable-browser'
mkdirSync(out,{recursive:true})
const browser=await chromium.launch({channel:'chrome'})
const results=[]
try {
  const context=await browser.newContext({offline:true,viewport:{width:1440,height:900}})
  const page=await context.newPage()
  const errors=[],network=[]
  page.on('pageerror',e=>errors.push(e.message))
  page.on('request',request=>{if(/^https?:/.test(request.url()))network.push(request.url())})
  if(!packaged) {
    await page.goto(pathToFileURL(path.resolve('output/release-candidate/review-package/docs/CASESTUDY.html')).href)
    await page.screenshot({path:`${out}/before-case-study-desktop.png`,fullPage:true})
    await page.screenshot({path:`${out}/before-case-study-opening.png`})
  }
  for(const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:width===768?1024:900})
    const url=pathToFileURL(path.resolve(root,packaged?'case-study/index.html':'index.html')).href
    await page.goto(url)
    await page.getByRole('heading',{name:/A judgment should/}).waitFor()
    const images=await page.locator('img').evaluateAll(async els=>{
      await Promise.all(els.map(el=>el.decode()))
      return els.map(el=>({src:el.getAttribute('src'),width:el.naturalWidth,height:el.naturalHeight}))
    })
    assert.ok(images.every(image=>image.width>0))
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`case study ${width} overflow`)
    await page.screenshot({path:`${out}/${packaged?'extracted':'presentation'}-${width}.png`,fullPage:true})
    await page.screenshot({path:`${out}/${packaged?'extracted':'presentation'}-${width}-opening.png`})
    for(const [i,section] of (await page.locator('main>section').all()).entries()) {
      if(width===1440) await section.screenshot({path:`${out}/presentation-section-${String(i+1).padStart(2,'0')}.png`})
    }
    results.push({width,images:images.length,overflow:false})
  }
  if(packaged) {
    await page.goto(pathToFileURL(path.resolve(root,'index.html')).href)
    const imageCount=await page.locator('img').evaluateAll(async els=>{
      for(const el of els)el.loading='eager'
      await Promise.all(els.map(el=>el.decode()))
      return els.length
    })
    await page.screenshot({path:`${out}/extracted-gallery-opening.png`})
    results.push({galleryImagesDecoded:imageCount})
    await page.getByRole('link',{name:'Portable text edition / HTML'}).click()
    await page.getByRole('heading',{name:'Your Design Eye.',exact:true}).waitFor()
  }
  assert.deepEqual(errors,[])
  assert.deepEqual(network,[])
  writeFileSync(`${out}/${packaged?'package':'presentation'}-results.json`,JSON.stringify({browser:browser.version(),offline:true,results,errors,network},null,2))
  console.log(JSON.stringify({results,errors,network},null,2))
} finally {await browser.close()}
