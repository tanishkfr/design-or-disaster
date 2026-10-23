"""Package existing browser evidence; never generate application mockups."""
from pathlib import Path
from html import escape
from urllib.parse import urlsplit, unquote
from html.parser import HTMLParser
import hashlib
import json
import shutil
import subprocess
import tempfile
import zipfile
from PIL import Image
from pypdf import PdfReader

base = Path.cwd()
evidence = base / 'output/release-candidate'
dest = evidence / 'review-package'
archive = base / 'output/design-or-disaster-v2-review.zip'
assert not dest.exists(), 'Preserve the previous package before rebuilding.'
assert not archive.exists(), 'Preserve the previous ZIP before rebuilding.'
for folder in ['screenshots', 'docs', 'exports', 'evidence']:
    (dest / folder).mkdir(parents=True, exist_ok=True)

# Group, filename, real source, screen name, description, viewport.
gallery = [
    ('Opening', 'cover-desktop', 'closure-surfaces/desktop-cover.png', 'Cover', 'The publication, Split instrument and invitation to investigate.', 'Desktop 1440 × 900'),
    ('Opening', 'index-desktop', 'closure-surfaces/desktop-index.png', 'Case index', 'Five open editorial rows; original archive remains a separate route.', 'Desktop 1440 × 900'),
]
for case, title in [('001', 'Mobile Banking'), ('006', 'Benefits Form'), ('010', 'Animated Portfolio'), ('012', 'Bulletin'), ('015', 'Brutalist Fashion Store')]:
    gallery.append(('Five investigations', f'{case}-first', f'final/chrome/desktop-case-{case}-first.png', title, 'First look at the actual authored exhibit; Benefits opens with its reconstructed source image.', 'Desktop 1440 × 900'))
    gallery.append(('Five investigations', f'{case}-task', f'final/chrome/desktop-case-{case}-task.png', f'{title} / second look task', 'A real working state reached through the browser task. Fictional entries only.', 'Desktop 1440 × 900'))
gallery += [
    ('Evidence and interpretation', 'evidence-edit', 'final/chrome/desktop-case-001-marking.png', 'Evidence annotation and editing', 'A described mark, explicit classification and numerical geometry controls.', 'Desktop 1440 × 900'),
    ('Evidence and interpretation', 'context', 'final/chrome/desktop-case-006-context.png', 'Context reveal', 'Authored provenance sits beside the preserved first evidence.', 'Desktop 1440 × 900'),
    ('Evidence and interpretation', 'second-look', 'final/chrome/desktop-case-001-reflection.png', 'Two looks / independent judgments', 'A changed verdict with both reasons and separate captured states preserved.', 'Desktop 1440 × 900'),
    ('Evidence and interpretation', 'perspectives', 'final/chrome/desktop-case-001-perspectives.png', 'Spatial perspective comparison', 'Visitor and authored readings share one selected coordinate plane.', 'Desktop 1440 × 900'),
    ('Evidence and interpretation', 'contradiction', 'final/refinements/desktop-contradiction.png', 'Contradiction inspection', 'Shared Benefits region, distinct readings and stated uncertainty.', 'Desktop 1440 × 900'),
    ('Evidence and interpretation', 'sealed', 'final/chrome/desktop-case-015-reflection.png', 'Sealed finale', 'The personal record exposes no authored outside position.', 'Desktop 1440 × 900'),
    ('Record and export', 'report-opening', 'final/refinements/desktop-report-opening.png', 'Design Eye / opening', 'Counts describe saved decisions and explicit classifications.', 'Desktop 1440 × 900'),
    ('Record and export', 'report-full', 'final/chrome/desktop-report.png', 'Design Eye / full document', 'The complete synthetic five-case record. Open full resolution to read.', 'Desktop 1440 × 900, full page'),
    ('Record and export', 'pdf-bank', 'final/export-review/chrome-page-02.png', 'Exported investigation / PDF page', 'Rendered actual PDF with lower Banking transactions and saved note intact.', 'A4 PDF render'),
    ('Record and export', 'pdf-sheet', 'final/export-review/chrome-contact-sheet.png', 'All fourteen PDF pages', 'Pagination overview; full PDF is included separately.', 'PDF overview'),
    ('Mobile and tablet', 'mobile-cover', 'closure-surfaces/mobile-cover.png', 'Mobile / cover', 'Same visual identity at the reference mobile width.', 'Mobile 390 × 844'),
    ('Mobile and tablet', 'mobile-index', 'closure-surfaces/mobile-index.png', 'Mobile / index', 'Responsive collection rows and original archive disclosure.', 'Mobile 390 × 844'),
    ('Mobile and tablet', 'mobile-marking', 'final/chrome/mobile-case-001-marking.png', 'Mobile / annotation editing', 'Populated, wrapping observation with classification and position controls.', 'Mobile 390 × 844'),
    ('Mobile and tablet', 'mobile-benefits', 'final/chrome/mobile-case-006-task.png', 'Mobile / Benefits second look', 'Synthetic application receipt after validation and recovery.', 'Mobile 390 × 844'),
    ('Mobile and tablet', 'mobile-sealed', 'final/chrome/mobile-case-015-reflection.png', 'Mobile / sealed record', 'Independent judgments and preserved evidence on the narrow layout.', 'Mobile 390 × 844'),
    ('Mobile and tablet', 'tablet-context', 'final/chrome/tablet-case-006-context.png', 'Tablet / context', 'Preserved first map alongside authored scenario context.', 'Tablet 768 × 1024'),
    ('Closure evidence', 'reset-before', 'reset-before/after-four-seconds.png', 'Before / reset after four seconds', 'Baseline confirmation had expired and returned to Reset.', 'Desktop 1440 × 900'),
    ('Closure evidence', 'reset-after', 'reset-closure/after-four-seconds.png', 'After / reset after four seconds', 'Same saved QA fixture and viewport: confirmation remains, with explanation and explicit cancel.', 'Desktop 1440 × 900'),
    ('Closure evidence', 'reset-mobile', 'reset-closure/confirmation-320.png', 'Reset / narrow reflow', 'Cancel follows the explanation; navigation wraps with space around the wordmark.', 'Reflow 320 CSS pixels'),
    ('Closure evidence', 'about', 'accessibility-closure/about.png', 'Source integrity and privacy', 'Specific reconstruction history, unresolved capture sources and shared-browser boundaries.', 'Desktop 1440 × 900'),
]
for _, name, source, *_ in gallery:
    assert (evidence / source).is_file(), source
    shutil.copy2(evidence / source, dest / 'screenshots' / f'{name}.png')

documents = ['CASESTUDY.md', 'PHASE-2.3-AUDIT.md', 'PHASE-2.3-HANDOFF.md', 'IMAGE-PROVENANCE.md', 'RELEASE-CANDIDATE-REPORT.md', 'REMAINING-VALIDATION.md']
style = 'body{margin:0;background:#f4f1eb;color:#171a1d;font:16px/1.6 system-ui,sans-serif}main{max-width:1440px;margin:auto;padding:40px 24px}h1{font-size:clamp(38px,6vw,78px);line-height:1.05;letter-spacing:-.04em}h2{margin-top:64px}a{color:#1a4e6b;text-underline-offset:4px}nav{display:flex;flex-wrap:wrap;gap:16px}.notice{padding:20px;border:1px solid #8a8379;max-width:90ch}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}figure{margin:0;padding-top:16px;border-top:1px solid #9b968e}figure img{display:block;width:100%;height:440px;object-fit:contain;object-position:top;background:#dedad2}figcaption{margin:12px 0 24px}figcaption p{margin:4px 0}small{color:#4b5157}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:15px/1.7 ui-monospace,monospace;max-width:100ch}table{border-collapse:collapse}td,th{border-bottom:1px solid #aaa;padding:10px;text-align:left}@media(max-width:700px){.grid{grid-template-columns:1fr}main{padding:24px 16px}figure img{height:480px}}'
doc_links = []
for name in documents:
    source = (base / name).read_text(encoding='utf-8')
    # Keep prose intact while making the case study's image links portable.
    if name == 'CASESTUDY.md':
        for old, new in {
            'output/release-candidate/final/chrome/desktop-case-001-marking.png': '../screenshots/evidence-edit.png',
            'output/release-candidate/closure-surfaces/desktop-cover.png': '../screenshots/cover-desktop.png',
            'output/release-candidate/closure-surfaces/desktop-index.png': '../screenshots/index-desktop.png',
            'output/release-candidate/final/chrome/desktop-case-001-reflection.png': '../screenshots/second-look.png',
            'output/release-candidate/final/refinements/desktop-contradiction.png': '../screenshots/contradiction.png',
            'output/release-candidate/final/export-review/png-detail-1.png': '../exports/design-eye-summary.png',
            'output/release-candidate/review-package/index.html': '../index.html',
        }.items():
            source = source.replace(old, new)
    if name.startswith('PHASE-'):
        source = '> Historical checkpoint. Earlier output folders are not bundled. See ../index.html and RELEASE-CANDIDATE-REPORT.md for current evidence.\n\n' + source
        source = source.replace('output/phase-2.3/index.html', '../index.html')
    (dest / 'docs' / name).write_text(source, encoding='utf-8')
    html_name = name.replace('.md', '.html')
    historical = 'Historical Phase 2.3 document; use the closure report for current results. Older local output folders are not included.' if name.startswith('PHASE-') else 'Review copy. The gallery supplies full-resolution visual evidence; Markdown source is included alongside this page.'
    (dest / 'docs' / html_name).write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(name)}</title><style>{style}</style><main><a href="../index.html">← Review gallery</a><p>{historical}</p><a href="{name}">Markdown source</a><pre>{escape(source)}</pre></main></html>', encoding='utf-8')
    doc_links.append(f'<li><a href="docs/{html_name}">{escape(name)}</a></li>')

for name in ['design-eye-summary.png', 'design-eye-full.pdf']:
    shutil.copy2(evidence / 'final/chrome' / name, dest / 'exports' / name)
proofs = {
    'regression-results.json': 'final/regression-results.json',
    'chrome-journeys.json': 'final/chrome/journey-results.json',
    'edge-journeys.json': 'final/edge/journey-results.json',
    'firefox-nightly-journeys.json': 'final/firefox/journey-results.json',
    'accessibility.json': 'accessibility-closure/results.json',
    'reset-regression.json': 'reset-closure/results.json',
    'export-inspection.json': 'final/export-review/results.json',
    'performance.json': 'final/performance/results.json',
    'asset-inventory.json': 'asset-inventory.json',
    'audit-before.json': 'audit-baseline.json',
    'audit-final.json': 'audit-final.json',
    'audit-production-final.json': 'audit-production-final.json',
    'check.log': 'check-closure.log',
    'environment.json': 'environment.json',
}
for name, source in proofs.items():
    shutil.copy2(evidence / source, dest / 'evidence' / name)

sections = []
for group in dict.fromkeys(item[0] for item in gallery):
    figures = []
    for category, name, _, title, description, viewport in gallery:
        if category != group:
            continue
        figures.append(f'<figure><a href="screenshots/{name}.png"><img loading="lazy" src="screenshots/{name}.png" alt="{escape(title)}"></a><figcaption><strong>{escape(title)}</strong><p>{escape(description)}</p><small>{escape(viewport)} · <a href="screenshots/{name}.png">Full-resolution PNG</a></small></figcaption></figure>')
    sections.append(f'<section><h2>{escape(group)}</h2><div class="grid">{"".join(figures)}</div></section>')
html = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Design or Disaster? — Independent review</title><style>{style}</style><main>
<p>DESIGN / DISASTER? · v2 · 23 October 2026</p><h1>The evidence behind<br>a judgment.</h1>
<p>Actual release-candidate application screenshots, synthetic investigation records and documented limits.</p>
<p class="notice"><strong>Publication: CONDITIONALLY READY. Engineering: PASS in the tested scope.</strong><br>Seven reconstructed image origins are documented; three supplied capture sources/permissions remain unresolved in the application. Real screen-reader, physical-device, Safari, stable Firefox and participant acceptance remain open. This package is for independent review; it is not unrestricted image licensing or publication approval.</p>
<nav aria-label="Review resources"><a href="#documents">Read the reports</a><a href="#exports">Open actual exports</a><a href="#evidence">Inspect verification data</a></nav>
<section id="documents"><h2>Review documentation</h2><ul>{''.join(doc_links)}</ul><p>The two Phase 2.3 documents are preserved historical checkpoints. Current claims are in the release-candidate report. This package runs without external fonts, scripts or services.</p></section>
{''.join(sections)}
<section id="exports"><h2>Actual exports</h2><p>Synthetic QA entries only. PNG is an excerpted text summary; PDF contains the full saved marked states and context. No real participant writings are included.</p><ul><li><a href="exports/design-eye-summary.png">PNG summary · 1600 × 4073</a></li><li><a href="exports/design-eye-full.pdf">Full investigation PDF · fourteen A4 pages</a></li></ul></section>
<section id="evidence"><h2>Verification evidence</h2><ul>{''.join(f'<li><a href="evidence/{name}">{name}</a></li>' for name in proofs)}</ul><a href="review-manifest.json">File hashes and tested implementation commit</a></section>
</main></html>'''
(dest / 'index.html').write_text(html, encoding='utf-8')
sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
files = {p.relative_to(dest).as_posix(): {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(dest.rglob('*')) if p.is_file()}
manifest = {'implementationCommit': sha, 'baseline': '813b570e17088fc0e05f9c9966d93ee527b03684', 'screenshots': len(gallery), 'scope': 'Actual local browser evidence; synthetic records; no participant study, no publication clearance', 'files': files}
(dest / 'review-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=7) as z:
    for p in sorted(dest.rglob('*')):
        if p.is_file():
            z.write(p, p.relative_to(dest).as_posix())

# Extract into a fresh arbitrary directory and verify the extracted copies.
extracted = Path(tempfile.mkdtemp(prefix='portable-check-', dir=evidence))
with zipfile.ZipFile(archive) as z:
    for name in z.namelist():
        assert (extracted / name).resolve().is_relative_to(extracted.resolve())
        assert not any(x in name.lower() for x in ['node_modules', '.env', '.git/', 'credentials'])
    z.extractall(extracted)
for name, expected in files.items():
    p = extracted / name
    assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest() == expected['sha256'], name
for p in extracted.rglob('*.png'):
    with Image.open(p) as im:
        im.verify()
reader = PdfReader(extracted / 'exports/design-eye-full.pdf')
assert len(reader.pages) == 14
assert 'Northline refund' in '\n'.join(p.extract_text() or '' for p in reader.pages)

class Resources(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in ['href', 'src'] or not value or value.startswith('#'):
                continue
            url = urlsplit(value)
            assert not url.scheme and not url.netloc and not value.startswith(('/', '\\')), value
            assert (self.document.parent / unquote(url.path)).is_file(), value

for p in extracted.rglob('*.html'):
    parser = Resources()
    parser.document = p
    parser.feed(p.read_text(encoding='utf-8'))
result = {'archive': str(archive), 'bytes': archive.stat().st_size, 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'files': len(files) + 1, 'screenshots': len(gallery), 'extractedTo': str(extracted), 'verification': 'PASS: hashes, every HTML resource, every PNG decoded, PDF text and fourteen pages verified after extraction'}
(evidence / 'package-verification.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result, indent=2))
