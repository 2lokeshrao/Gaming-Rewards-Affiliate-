import os
import re

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Find lucide-react imports
            match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content)
            if match:
                imports_str = match.group(1)
                icons = [i.strip() for i in imports_str.split(',')]
                
                unused = []
                for icon in icons:
                    if not icon: continue
                    # Check if the icon is used in the content (excluding the import statement)
                    # We remove the import statement from content to avoid false positives
                    content_without_import = content.replace(match.group(0), '')
                    # check for `<Icon` or `icon={Icon}` or `[Icon]` or `Icon,` or `Icon}` or `Icon `
                    if not re.search(rf'\b{icon}\b', content_without_import):
                        unused.append(icon)
                
                if unused:
                    print(f"{filepath}: Unused icons: {unused}")
