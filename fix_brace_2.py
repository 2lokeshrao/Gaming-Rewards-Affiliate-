import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Fix pattern: space + `} + newline + space + >
text = re.sub(r'(\s+)`\}\n(\s+)>', r'\1}`}\n\2>', text)
text = re.sub(r'(\s+)`\n(\s+)>', r'\1}`}\n\2>', text)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
