"""Read and render the application's real browser exports; not a PDF generator."""
import json
import os
import re
from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader
import pypdfium2 as pdfium

root = Path(os.environ.get('VERIFY_ROOT', 'output/phase-2.3'))
out = root / 'export-review'
out.mkdir(exist_ok=True)
store = json.loads((root / 'chrome/complete-store.json').read_text(encoding='utf-8'))
expected = []
for record in store['records'].values():
    expected.extend(record[k]['writtenRuling'] for k in ['firstJudgment', 'secondJudgment'])
    expected.extend(mark['note'] for k in ['firstLook', 'secondLook'] for mark in record[k]['marks'])

def compact(value):
    return re.sub(r'\s+', '', value)

def embedded(font):
    font = font.get_object()
    if font.get('/Subtype') == '/Type3':
        return True
    if '/DescendantFonts' in font:
        return all(embedded(item) for item in font['/DescendantFonts'])
    descriptor = font.get('/FontDescriptor')
    return bool(descriptor and any(key in descriptor.get_object() for key in ['/FontFile', '/FontFile2', '/FontFile3']))

results = {}
for name in ['chrome', 'edge']:
    path = root / name / 'design-eye-full.pdf'
    if not path.exists():
        continue
    reader = PdfReader(path)
    text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    missing = [value for value in expected if compact(value) not in compact(text)]
    assert not missing, f'{name} missing saved content: {missing}'
    assert not any(voice in text for voice in ['The Scanner', 'The Advocate', 'The Operator', 'The Skeptic', 'The Romantic'])
    first_bank_page = reader.pages[1].extract_text() or ''
    assert all(value in first_bank_page for value in ['Studio rent', 'Northline Rail', 'Northline refund', 'Corner market']), f'{name}: captured banking content clipped during pagination'
    fonts = []
    for page in reader.pages:
        resources = page.get('/Resources').get_object()
        fonts.extend(embedded(font) for font in resources.get('/Font', {}).get_object().values())
    assert all(fonts), f'{name}: font without embedded data'
    pdf = pdfium.PdfDocument(str(path))
    pages = []
    for index in range(len(pdf)):
        image = pdf[index].render(scale=1.25).to_pil().convert('RGB')
        image.save(out / f'{name}-page-{index+1:02}.png')
        image.thumbnail((400, 560))
        pages.append(image)
    sheet = Image.new('RGB', (1260, ((len(pages)+2)//3)*600), '#d5d5d5')
    draw = ImageDraw.Draw(sheet)
    for index, image in enumerate(pages):
        x, y = (index % 3)*420+10, (index//3)*600+26
        sheet.paste(image, (x, y))
        draw.text((x, y-20), f'{name} / page {index+1}', fill='#111111')
    sheet.save(out / f'{name}-contact-sheet.png')
    results[name] = {'pages': len(reader.pages), 'saved_statements_checked': len(expected), 'missing': missing, 'embedded_font_resources': len(fonts), 'authored_names_absent': True}

png = Image.open(root / 'chrome/design-eye-summary.png')
results['png'] = {'size': list(png.size), 'format': png.format}
for index, y in enumerate(range(0, png.height, 1400)):
    png.crop((0, y, png.width, min(png.height, y+1400))).save(out / f'png-detail-{index+1}.png')
(out / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print(json.dumps(results, indent=2))
