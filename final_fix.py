import re
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

bad_blocks = re.findall(r'className=\{`w-full[^}]*\$\{[^}]*\}\s*<button', content)
for bad in bad_blocks:
    good = bad.replace("<button", "}`} >")
    content = content.replace(bad, good)

# Fix remaining broken `<button onClick` without preceding closing tags
content = re.sub(r'className=\{`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors \$\{\s*<button', 
                 r'className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors ${', content)
                 
with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
