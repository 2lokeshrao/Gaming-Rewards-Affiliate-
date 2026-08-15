import os
import glob
from PIL import Image

for file in glob.glob("public/logos/*.png"):
    if "placeholder" in file:
        continue
    try:
        img = Image.open(file)
        img = img.convert("RGBA")
        img.save(file, "PNG")
        print(f"Converted {file}")
    except Exception as e:
        print(f"Error converting {file}: {e}")
