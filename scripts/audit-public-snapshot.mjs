import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const git=(...args)=>execFileSync('git',args,{maxBuffer:20*1024*1024})
const base=process.env.PR_BASE??'origin/main'
const baseSha=git('rev-parse',base).toString().trim()
const head=git('rev-parse','HEAD').toString().trim()
const commits=git('rev-list',`${base}..HEAD`).toString().trim().split('\n').filter(Boolean)
assert.equal(commits.length,1,'Public snapshot must expose exactly one new commit')
const parents=git('show','-s','--format=%P','HEAD').toString().trim().split(' ')
assert.deepEqual(parents,[baseSha],'Only parent must be the verified public base')
const blocked=new Set(['ed352a75461d58409bb803a1c59ec8631bc21dd6','76e0e50ecd48c298448ce6d4499e745ef538cdcf','39562107fa3a9f87b06ab312b12732be89824086'])
const forbidden=/(^|\/)(?:output|node_modules|\.git|\.claude|\.vercel|playwright-report|test-results)(?:\/|$)|(?:SnapchatImage|arcimage|ioscalendar)\.png$|\.(?:zip|pdf|pem|key)$|(^|\/)\.env(?:\.|$)/i
const secret=/(?:gh[pousr]_[A-Za-z0-9]{24,}|github_pat_[A-Za-z0-9_]{30,}|sk-proj-[A-Za-z0-9_-]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{20,})/
const tracked=git('ls-tree','-rz','--full-tree','HEAD').toString().split('\0').filter(Boolean).map(line=>{
 const [meta,path]=line.split('\t'); const [mode,type,sha]=meta.split(' ');return{mode,type,sha,path}
})
for(const entry of tracked){assert.ok(!forbidden.test(entry.path),`Excluded path: ${entry.path}`)}
const introduced=git('rev-list','--objects','HEAD',`^${base}`).toString().trim().split('\n').filter(Boolean)
const blobs=[]
for(const line of introduced){
 const [sha,...parts]=line.split(' ')
 assert.ok(!blocked.has(sha),`Uncleared source object introduced: ${sha}`)
 if(git('cat-file','-t',sha).toString().trim()!=='blob')continue
 const bytes=git('cat-file','blob',sha)
 const binary=bytes.includes(0)
 const name=parts.join(' ')
 assert.ok(!forbidden.test(name),`Excluded object path: ${name}`)
 if(!binary)assert.ok(!secret.test(bytes.toString('utf8')),`Potential credential in ${name}`)
 blobs.push({sha,path:name,bytes:bytes.length,binary})
}
const deployment=JSON.parse(git('show','HEAD:vercel.json').toString())
assert.equal(deployment.git.deploymentEnabled['codex/design-or-disaster-v2-pr'],false)
mkdirSync('output/final-fixes',{recursive:true})
const result={base:baseSha,head,newCommits:commits,parents,trackedFiles:tracked.length,newBlobs:blobs.length,newBinaryBlobs:blobs.filter(b=>b.binary),forbiddenPaths:0,blockedNewObjects:0,credentialMatches:0,branchDeploymentDisabled:true,scope:'Newly exposed snapshot objects only. Former supplied captures remain in already-public base history; this does not clear or remove them.',blobs}
writeFileSync('output/final-fixes/public-object-audit.json',JSON.stringify(result,null,2))
console.log(JSON.stringify({...result,blobs:undefined,newBinaryBlobs:result.newBinaryBlobs.map(b=>({path:b.path,sha:b.sha,bytes:b.bytes}))},null,2))
