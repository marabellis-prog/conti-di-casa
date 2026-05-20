"""Genera le icone della casetta (twemoji 1F3E0) in tutte le dimensioni richieste.

Strategia: scarica il PNG twemoji 72x72 dal CDN come sorgente, poi riscala
con Pillow LANCZOS. Per le icone PWA/Apple aggiunge sfondo arrotondato scuro
dietro l'emoji (la casa di per sé ha sfondo trasparente).
"""

import os
import urllib.request
from io import BytesIO

from PIL import Image, ImageDraw

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_URL = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e0.png'

# (file, size, with_background, corner_radius, fg_scale)
# fg_scale = quanto della superficie viene occupata dalla casa (es. 0.72 = 72%)
TASKS = [
    ('favicon.png', 96, False, 0, 1.0),
    ('favicon-32.png', 32, False, 0, 1.0),
    ('apple-touch-icon.png', 180, True, 38, 0.72),
    ('apple-touch-icon-76.png', 76, True, 16, 0.72),
    ('apple-touch-icon-120.png', 120, True, 26, 0.72),
    ('apple-touch-icon-152.png', 152, True, 32, 0.72),
    ('apple-touch-icon-167.png', 167, True, 35, 0.72),
    ('apple-touch-icon-180.png', 180, True, 38, 0.72),
    ('icon-192.png', 192, True, 40, 0.72),
    ('icon-512.png', 512, True, 108, 0.72),
]

BG_COLOR = (15, 20, 25, 255)  # #0f1419


def fetch_source():
    print(f'Scarico {SRC_URL}')
    req = urllib.request.Request(SRC_URL, headers={'User-Agent': 'icon-builder/1.0'})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()
    img = Image.open(BytesIO(data)).convert('RGBA')
    print(f'Sorgente: {img.size}, mode={img.mode}')
    return img


def build_icon(src: Image.Image, size: int, with_bg: bool, radius: int, fg_scale: float) -> Image.Image:
    """Costruisce un PNG quadrato di lato `size` con la casa (opzionalmente su sfondo arrotondato)."""
    if with_bg:
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        # Sfondo arrotondato scuro
        if radius > 0:
            bg = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            mask = Image.new('L', (size, size), 0)
            ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
            bg_solid = Image.new('RGBA', (size, size), BG_COLOR)
            bg.paste(bg_solid, (0, 0), mask)
        else:
            bg = Image.new('RGBA', (size, size), BG_COLOR)
        canvas.alpha_composite(bg)
        # Casa scalata
        inner = max(1, int(round(size * fg_scale)))
        house = src.resize((inner, inner), Image.LANCZOS)
        off = (size - inner) // 2
        canvas.alpha_composite(house, (off, off))
        return canvas
    else:
        return src.resize((size, size), Image.LANCZOS)


def main():
    src = fetch_source()
    for name, size, bg, radius, fg_scale in TASKS:
        img = build_icon(src, size, bg, radius, fg_scale)
        out_path = os.path.join(OUT_DIR, name)
        img.save(out_path, 'PNG', optimize=True)
        size_kb = os.path.getsize(out_path) / 1024
        print(f'{name}: {size}x{size} ({size_kb:.1f} KB)')


if __name__ == '__main__':
    main()
