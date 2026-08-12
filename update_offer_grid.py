import re

with open('src/components/OfferGrid.tsx', 'r') as f:
    content = f.read()

target = """                  {p.isFeatured && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      FEATURED
                    </span>
                  )}"""

replacement = """                  {p.isFeatured && !p.featuredRank && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      FEATURED
                    </span>
                  )}
                  {p.isFeatured && p.featuredRank === 1 && (
                    <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                      🥇 GOLD RANK
                    </span>
                  )}
                  {p.isFeatured && p.featuredRank === 2 && (
                    <span className="bg-slate-300/20 border border-slate-300/50 text-slate-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      🥈 SILVER RANK
                    </span>
                  )}
                  {p.isFeatured && p.featuredRank === 3 && (
                    <span className="bg-orange-700/30 border border-orange-500/50 text-orange-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      🥉 BRONZE RANK
                    </span>
                  )}"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/OfferGrid.tsx', 'w') as f:
        f.write(content)
    print("Success replacing in OfferGrid.tsx")
else:
    print("Target not found in OfferGrid.tsx")
