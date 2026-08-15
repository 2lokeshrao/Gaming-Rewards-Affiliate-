import re

with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(<a href=\{`/brands/.*?className=\"text-slate-400 hover:text-amber-400 transition-colors\">)(\s*\{p.name\} Reviews)"
replacement = r"\1\n                      {p.name} Promo Code 2026"

content = re.sub(pattern, replacement, content)

with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
