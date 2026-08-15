import re

with open('src/components/OfferGrid.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add "Verified today" badge inside the mapping
pattern = r'(<div className="flex items-start justify-between mb-4">)'
replacement = r"""<div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-3 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Verified {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
              </div>\n              \1"""

content = re.sub(pattern, replacement, content)

with open('src/components/OfferGrid.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
