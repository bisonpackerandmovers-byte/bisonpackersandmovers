from pathlib import Path
import re
root = Path(r'c:\Users\ruhan\Downloads\bison-packers-movers')

for path in sorted(root.glob('*.html')):
    if path.name == 'track-shipment.html':
        continue
    text = path.read_text(encoding='utf-8')
    original = text

    if '<link rel="icon"' not in text:
        text = text.replace('<link rel="stylesheet" href="css/style.css">', '<link rel="icon" type="image/svg+xml" href="images/favicon.svg">\n<link rel="apple-touch-icon" href="images/logo.svg">\n<link rel="stylesheet" href="css/style.css">')

    text = text.replace('<span class="brand-mark">B</span>', '<img class="brand-logo" src="images/logo.svg" alt="Bison Packers and Movers logo">')
    text = text.replace('<li><a href="track-shipment.html">Track Shipment</a></li>', '')
    text = text.replace('<a href="track-shipment.html">Track Shipment</a>', '')
    text = text.replace('href="track-shipment.html"', '')
    text = text.replace('href="track-shipment.html"', '')
    if text != original:
        path.write_text(text, encoding='utf-8')

track_path = root / 'track-shipment.html'
if track_path.exists():
    track_path.unlink()

js_path = root / 'js' / 'script.js'
if js_path.exists():
    js_text = js_path.read_text(encoding='utf-8')
    js_text = re.sub(r'\s*/\* ---------- Track shipment.*?\n\n', '\n', js_text, flags=re.S)
    js_path.write_text(js_text, encoding='utf-8')
