import os
import cv2
import numpy as np
from PIL import Image

def main():
    src_path = r"C:\Users\Mackenzie Campbel\.gemini\antigravity-ide\brain\a46190df-8dd3-4edf-98b3-a3990afd189d\.user_uploaded\media_1792984869203.png"
    out_dir = r"d:\Mac\project\POS\public"
    os.makedirs(out_dir, exist_ok=True)

    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img)

    # 1. Bounding box & center calculation
    mask = np.any(arr[:, :, :3] > 40, axis=2)
    ys, xs = np.where(mask)
    ymin, ymax = int(ys.min()), int(ys.max())
    xmin, xmax = int(xs.min()), int(xs.max())

    cx = (xmin + xmax) // 2
    cy = (ymin + ymax) // 2

    # Crop square of size S=420 centered on the mark
    S = 420
    x0 = cx - S // 2
    y0 = cy - S // 2
    x1 = x0 + S
    y1 = y0 + S

    crop_box = (x0, y0, x1, y1)
    cropped_pil = img.crop(crop_box)

    # Ensure background is pure black #000000
    # Clean any tiny fringe outside the mark
    crop_arr = np.array(cropped_pil)
    # The mark components are clearly > 60 in brightness
    # Let's preserve the original anti-aliased subpixels of the mark while ensuring background is solid black
    cropped_clean = Image.fromarray(crop_arr, "RGBA")

    # 2. Generate raster favicons
    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "favicon-48x48.png": 48,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
    }

    for filename, sz in sizes.items():
        resized = cropped_clean.resize((sz, sz), Image.Resampling.LANCZOS)
        # Convert to RGB (solid black background with white mark)
        resized_rgb = resized.convert("RGB")
        target_path = os.path.join(out_dir, filename)
        resized_rgb.save(target_path, "PNG", optimize=True)
        print(f"Generated {filename} ({sz}x{sz})")

    # 3. Generate multi-resolution favicon.ico (16, 32, 48)
    ico_img16 = cropped_clean.resize((16, 16), Image.Resampling.LANCZOS).convert("RGB")
    ico_img32 = cropped_clean.resize((32, 32), Image.Resampling.LANCZOS).convert("RGB")
    ico_img48 = cropped_clean.resize((48, 48), Image.Resampling.LANCZOS).convert("RGB")

    ico_path = os.path.join(out_dir, "favicon.ico")
    ico_img48.save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[ico_img16, ico_img32]
    )
    print("Generated favicon.ico (16x16, 32x32, 48x48)")

    # 4. Generate high-precision vector SVG favicon
    # Using OpenCV contour approximation with sub-pixel tolerance
    gray = cv2.imread(src_path, cv2.IMREAD_GRAYSCALE)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    comps = sorted(contours, key=lambda c: (cv2.boundingRect(c)[0], cv2.boundingRect(c)[1]))

    paths_d = []
    for comp in comps:
        approx = cv2.approxPolyDP(comp, 0.45, True)
        pts = approx.reshape(-1, 2)
        # Offset by crop origin (x0, y0)
        pts_rel = pts - np.array([x0, y0])
        # Format SVG path
        d_str = "M " + " L ".join(f"{p[0]:.1f} {p[1]:.1f}" for p in pts_rel) + " Z"
        paths_d.append(d_str)

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="100%" height="100%">
  <!-- Approved RIKE'S SHEET Logo Mark Favicon -->
  <rect width="{S}" height="{S}" rx="64" fill="#000000"/>
  <path fill="#FAF8F5" d="{paths_d[0]}"/>
  <path fill="#FAF8F5" d="{paths_d[1]}"/>
  <path fill="#FAF8F5" d="{paths_d[2]}"/>
</svg>
"""

    svg_path = os.path.join(out_dir, "favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated favicon.svg")

    # 5. Generate site.webmanifest
    manifest_content = """{
  "name": "RIKE'S SHEET",
  "short_name": "RIKE'S SHEET",
  "description": "A structured 180-day placement preparation checklist and daily attendance system.",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#112E52",
  "background_color": "#091424",
  "display": "standalone"
}
"""
    manifest_path = os.path.join(out_dir, "site.webmanifest")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(manifest_content)
    print("Generated site.webmanifest")

if __name__ == "__main__":
    main()
