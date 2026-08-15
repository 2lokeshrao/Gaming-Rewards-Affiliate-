import re
import base64
import os

with open('src/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all /logos/*.png
for root, _, files in os.walk('public/logos'):
    for file in files:
        if file.endswith('.png'):
            path = f"/logos/{file}"
            filepath = os.path.join(root, file)
            
            # Determine mime type (since rajabets is jpeg)
            mime = "image/png"
            if file == "rajabets.png":
                mime = "image/jpeg"
                
            with open(filepath, 'rb') as img_f:
                b64 = base64.b64encode(img_f.read()).decode('utf-8')
                
            data_uri = f"data:{mime};base64,{b64}"
            content = content.replace(f'logoUrl: "{path}"', f'logoUrl: "{data_uri}"')

with open('src/data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Base64 injected")
