import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'\{p\.isFeatured && \(\s*<span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-\[10px\] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">\s*<Flame className="w-3 h-3 text-amber-400 fill-amber-400" />\s*Top\s*</span>\s*\)\}')

replacement = """{p.isFeatured && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${p.featuredRank === 1 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : p.featuredRank === 2 ? 'bg-slate-300/20 text-slate-300 border-slate-300/40' : p.featuredRank === 3 ? 'bg-orange-600/30 text-orange-300 border-orange-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                                <Flame className="w-3 h-3 fill-current" />
                                {p.featuredRank === 1 ? 'Gold' : p.featuredRank === 2 ? 'Silver' : p.featuredRank === 3 ? 'Bronze' : 'Top'}
                              </span>
                            )}"""

new_content = pattern.sub(replacement, content)
if new_content != content:
    with open('src/components/AdminPanel.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Not found")
