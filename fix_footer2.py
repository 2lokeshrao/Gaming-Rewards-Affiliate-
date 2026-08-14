import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    '            ))}\n          <div className="flex items-center justify-center gap-2 font-bold text-slate-200">',
    '            ))}\n          </div>\n          <div className="flex items-center justify-center gap-2 font-bold text-slate-200">'
)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)
