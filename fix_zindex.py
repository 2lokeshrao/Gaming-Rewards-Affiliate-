import os
import glob

def replace_zindex(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to replace 'z-50' with 'z-[200]' in fixed overlays
    new_content = content.replace("fixed inset-0 z-50", "fixed inset-0 z-[200]")
    new_content = new_content.replace("fixed inset-0 bg-black/80 flex items-center justify-center z-50", "fixed inset-0 bg-black/80 flex items-center justify-center z-[200]")
    new_content = new_content.replace("fixed top-20 right-6 z-50", "fixed top-20 right-6 z-[200]")
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            replace_zindex(os.path.join(root, file))

