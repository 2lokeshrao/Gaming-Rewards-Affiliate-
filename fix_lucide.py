import os
import re

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content)
            if match:
                imports_str = match.group(1)
                icons = [i.strip() for i in imports_str.split(',')]
                
                used_icons = []
                for icon in icons:
                    if not icon: continue
                    # check for `as`
                    real_icon_name = icon
                    if ' as ' in icon:
                        real_icon_name = icon.split(' as ')[1].strip()
                        
                    content_without_import = content.replace(match.group(0), '')
                    if re.search(rf'\b{real_icon_name}\b', content_without_import):
                        used_icons.append(icon)
                
                # Reconstruct import statement
                if used_icons:
                    new_import_str = f"import {{ {', '.join(used_icons)} }} from 'lucide-react'"
                else:
                    new_import_str = ""
                
                new_content = content.replace(match.group(0), new_import_str)
                with open(filepath, 'w') as f:
                    f.write(new_content)
                
                print(f"Fixed {filepath}: kept {len(used_icons)} out of {len(icons)} icons.")
