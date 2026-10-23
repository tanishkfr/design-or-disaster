"""Assemble genuine local evidence and verify the extracted offline package."""
from pathlib import Path
from PIL import Image, ImageDraw
from html import escape
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import hashlib
import json
import shutil
import zipfile
import sys
import subprocess

base = Path.cwd()
root = base / 'output/excellence'
presentation = base / 'portfolio-case-study'
media = presentation / 'media'
media.mkdir(exist_ok=True)
sources = {
    'catalogue.png': root / 'final-surfaces/catalogue-detail.png',
    'instrument.png': root / 'final-surfaces/workbench-detail.png',
    'cover.png': root / 'verified/surfaces/desktop-cover.png',
    'two-looks.png': root / 'verified/chrome/desktop-case-001-reflection.png',
    'reveal.png': root / 'verified/refinements/desktop-contradiction.png',
    'one-page.png': root / 'acceptance/design-eye-one-page.png',
}
for name, source in sources.items():
    assert source.is_file(), source
    shutil.copy2(source, media / name)
for source in (base / 'public/previews').glob('*.png'):
    shutil.copy2(source, media / source.name)

comparisons = root / 'comparisons'
comparisons.mkdir(exist_ok=True)
for viewport, label in [('desktop','index'),('desktop','marking'),('mobile','marking'),('mobile','judgment')]:
    images = [Image.open(root / folder / f'{viewport}-{label}.png').convert('RGB') for folder in ['before','final-surfaces']]
    width = images[0].width
    assert images[1].width == width
    sheet = Image.new('RGB', (width*2+40, max(i.height for i in images)+70), '#181b20')
    draw = ImageDraw.Draw(sheet)
    for i, image in enumerate(images):
        x = i*(width+40)
        draw.text((x+12,20), f'{"BEFORE" if i == 0 else "AFTER"} / {viewport} {label}', fill='#f3f1eb')
        sheet.paste(image,(x,70))
    sheet.save(comparisons / f'{viewport}-{label}.png')
shutil.copy2(comparisons / 'mobile-marking.png',media / 'mobile-comparison.png')
for name, paths, labels, preview_width in [
    ('report-editions', [root/'verified/chrome/design-eye-summary.png',root/'acceptance/design-eye-one-page.png'], ['Existing full summary / retained','New compact edition / same saved fixture'],800),
    ('case-study', [root/'portable-browser/before-case-study-opening.png',root/'portable-browser/presentation-1440-opening.png'], ['Before / explanatory review page','After / editorial case study'],1440),
]:
    if all(p.is_file() for p in paths):
        images=[Image.open(p).convert('RGB') for p in paths]
        images=[im.resize((preview_width,round(im.height*preview_width/im.width))) for im in images]
        sheet=Image.new('RGB',(preview_width*2+40,max(im.height for im in images)+70),'#181b20')
        draw=ImageDraw.Draw(sheet)
        for i,im in enumerate(images):
            draw.text((i*(preview_width+40)+12,20),labels[i],fill='#f3f1eb')
            sheet.paste(im,(i*(preview_width+40),70))
        sheet.save(comparisons/f'{name}.png')
if '--package' not in sys.argv:
    print('Prepared portable presentation media and matched comparisons.')
    raise SystemExit(0)

dest = root / 'review-package'
assert not dest.exists(), 'Preserve prior package before rebuilding'
dest.mkdir()
shutil.copytree(presentation, dest / 'case-study')
shutil.copytree(comparisons, dest / 'comparisons')
docs = dest / 'docs'
docs.mkdir()
document_names = ['CASESTUDY.md','PORTFOLIO-EXCELLENCE-AUDIT.md','PORTFOLIO-EXCELLENCE-HANDOFF.md','IMAGE-PROVENANCE.md','REMAINING-VALIDATION.md']
for name in document_names:
    text=(base/name).read_text(encoding='utf-8-sig')
    if name=='CASESTUDY.md': text=text.replace('portfolio-case-study/','../case-study/')
    (docs/name).write_text(text,encoding='utf-8')
    # Preserve exact prose as a readable review copy; the editorial case study
    # above is the media-rich presentation, not a Markdown preformatted dump.
    (docs/name.replace('.md','.html')).write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(name)}</title><style>body{{max-width:100ch;margin:auto;padding:32px;font:16px/1.7 system-ui;background:#f3f1eb;color:#181b20}}pre{{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}}a{{color:#163f65}}</style><p><a href="../index.html">Review gallery</a> / <a href="../case-study/index.html">Visual case study</a></p><pre>{escape(text)}</pre></html>',encoding='utf-8')
exports=dest/'exports'
exports.mkdir()
for source in [root/'acceptance/design-eye-one-page.png', root/'acceptance/design-eye-text-record.html',root/'verified/chrome/design-eye-summary.png',root/'verified/chrome/design-eye-full.pdf']:
    shutil.copy2(source,exports/source.name)

screens=dest/'screenshots'
screens.mkdir()
gallery=[]
def add(source,name,caption):
    assert source.is_file(), source
    shutil.copy2(source,screens/name)
    gallery.append((name,caption))
for view in ['desktop','tablet','mobile']:
    for case in ['001','006','010','012','015']:
        for state in ['first','marking','task','reflection']:
            filename=f'{view}-case-{case}-{state}.png'
            add(root/'verified/chrome'/filename,filename,f'{view} / case {case} / {state}')
for source in (root/'compact').glob('compact-case-*.png'):
    add(source,source.name,source.stem.replace('-',' '))
for view in ['desktop','tablet','mobile','compact']:
    for state in ['index','marking','judgment']:
        name=f'{view}-{state}.png'
        add(root/'final-surfaces'/name,name,f'{view} / final {state}')
for name in ['desktop-contradiction.png','desktop-report-opening.png']:
    add(root/'verified/refinements'/name,name,name.removesuffix('.png'))
for source in (root/'acceptance').glob('*-preview-*.png'):
    add(source,source.name,source.stem)
evidence=dest/'evidence'
evidence.mkdir()
for folder in ['verified','acceptance','final-surfaces']:
    for source in (root/folder).rglob('*.json'):
        if source.name=='complete-store.json' or 'failure' in source.name: continue
        target=evidence/folder/source.relative_to(root/folder)
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(source,target)
for name in ['check-final.log','dependency-audit.json','design-detector.json','compact.log','environment.json','provenance-check.json','pdf-structure.json']:
    if (root/name).is_file():shutil.copy2(root/name,evidence/name)
for source in (root/'verified').glob('*.log'):shutil.copy2(source,evidence/source.name)
for source in (root/'verified/export-review').glob('*.png'):
    add(source,source.name,'Actual export render / '+source.stem)

style='body{margin:0;background:#0b0d10;color:#f3f1eb;font:16px/1.6 system-ui}main{max-width:1440px;margin:auto;padding:32px 24px}a{color:#ff947f;text-underline-offset:4px}h1{font-size:clamp(40px,6vw,80px);line-height:1.1;letter-spacing:-.04em}h2{margin-top:64px}nav{display:flex;flex-wrap:wrap;gap:20px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}figure{margin:0;border-top:1px solid #555;padding-top:16px}img{display:block;width:100%;height:360px;object-fit:contain;object-position:top;background:#181b20}figcaption{margin:12px 0 24px;color:#b5b8be}.notice{max-width:90ch;padding:20px 0;border-block:1px solid #555}@media(max-width:800px){.grid{grid-template-columns:1fr}img{height:480px}}'
cards=''.join(f'<figure><a href="screenshots/{name}"><img loading="lazy" src="screenshots/{name}" alt="{escape(caption)}"></a><figcaption>{escape(caption)} / <a href="screenshots/{name}">full resolution</a></figcaption></figure>' for name,caption in gallery)
links=''.join(f'<li><a href="docs/{name.replace(".md",".html")}">{name}</a></li>' for name in document_names)
matched=''.join(f'<figure><a href="comparisons/{p.name}"><img src="comparisons/{p.name}" alt="Matched before and after {escape(p.stem)}"></a><figcaption>{escape(p.stem)} / same viewport and task</figcaption></figure>' for p in comparisons.glob('*.png'))
(dest/'index.html').write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Design or Disaster? — excellence review</title><style>{style}</style><main><p>D/D · 23 October 2026 · LOCAL REVIEW</p><h1>The evidence behind<br>a judgment.</h1><p class="notice">Engineering results and limitations are recorded in the handoff. Publication remains CONDITIONALLY READY: three image decisions, human accessibility/device/browser acceptance and actual participants remain open. Actual screenshots, synthetic QA records. This is an independent-review package, not publication authorization.</p><nav><a href="case-study/index.html">Open the visual case study ↗</a><a href="#comparisons">Before / after</a><a href="#exports">Actual exports</a><a href="#documents">Read the handoff</a></nav><section id="documents"><h2>Documentation</h2><ul>{links}</ul></section><section id="comparisons"><h2>Matched comparisons</h2><div class="grid">{matched}</div></section><section id="exports"><h2>Actual exports</h2><ul><li><a href="exports/design-eye-one-page.png">Compact editorial sheet / PNG</a></li><li><a href="exports/design-eye-summary.png">Full summary / PNG</a></li><li><a href="exports/design-eye-full.pdf">Full evidence record / PDF</a></li><li><a href="exports/design-eye-text-record.html">Portable text edition / HTML</a></li></ul><p>The text edition is the nonvisual alternative. PDF tagging is not certified. All entries shown are synthetic test data.</p></section><section><h2>Five investigations and final surfaces</h2><div class="grid">{cards}</div></section><p>Raw checks and logs are under evidence/. All links and image files are local; no external runtime or font request is needed. <a href="review-manifest.json">Manifest and SHA-256 hashes</a></p></main></html>',encoding='utf-8')

class Targets(HTMLParser):
    def __init__(self):super().__init__();self.values=[]
    def handle_starttag(self,tag,attrs):
        for k,v in attrs:
            if k in ['src','href'] and v:self.values.append(v)
def check(folder):
    targets=0;images=0
    for page in folder.rglob('*.html'):
        parser=Targets();parser.feed(page.read_text(encoding='utf-8-sig'))
        for value in parser.values:
            url=urlsplit(value)
            if url.scheme or not url.path:continue
            target=(page.parent/unquote(url.path)).resolve()
            assert target.is_relative_to(folder.resolve()),(page,value)
            assert target.is_file(),(page,value)
            targets+=1
    for path in folder.rglob('*.png'):
        with Image.open(path) as image:image.verify()
        images+=1
    return {'resource_targets':targets,'decoded_pngs':images}
files={str(p.relative_to(dest)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in dest.rglob('*') if p.is_file()}
assert not any('node_modules' in name or name.endswith(('.env','.key','.pem')) for name in files)
sha=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
(dest/'review-manifest.json').write_text(json.dumps({'local_only':True,'delivery_sha':sha,'tested_application_sha':'d9cbfaa160c73063ffb389e58160765f20ee0d61','files':files},indent=2),encoding='utf-8')
check(dest)
archive=base/'output/design-or-disaster-v2-excellence-review.zip'
assert not archive.exists(),'Preserve previous archive before rebuild'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as zip_file:
    for path in dest.rglob('*'):
        if path.is_file():zip_file.write(path,str(path.relative_to(dest)))
extracted=root/'extracted-review'
assert not extracted.exists()
with zipfile.ZipFile(archive) as zip_file:
    assert zip_file.testzip() is None
    zip_file.extractall(extracted)
for name,digest in files.items():assert hashlib.sha256((extracted/name).read_bytes()).hexdigest()==digest,name
verification={'path':str(archive),'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'files':len(files)+1,'extracted':str(extracted),**check(extracted)}
(root/'package-verification.json').write_text(json.dumps(verification,indent=2),encoding='utf-8')
print(json.dumps(verification,indent=2))

