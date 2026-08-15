import re

with open('src/components/TopThreeCarousel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(<div className="absolute top-4 left-4 z-10 flex gap-2">)'
replacement = r"""\1
                <div className="bg-emerald-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow flex items-center gap-1 backdrop-blur-sm">
                  <CheckCircle2 className="w-3 h-3" /> Verified {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
                </div>"""

content = re.sub(pattern, replacement, content)

with open('src/components/TopThreeCarousel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
