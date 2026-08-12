import re

with open('src/components/OfferGrid.tsx', 'r') as f:
    content = f.read()

target = """                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{p.rating} / 10</span>
                </div>"""

replacement = """                <div className="flex items-center gap-2 mt-1">
                  <div className="flex" title={`${p.averageUserRating || p.starRating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(p.averageUserRating || p.starRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-amber-400 font-bold">{p.averageUserRating?.toFixed(1) || p.starRating}.0 / 5.0</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:inline-block">({(p.totalReviewsCount || 10500).toLocaleString()} Reviews)</span>
                </div>"""

content = content.replace(target, replacement)

with open('src/components/OfferGrid.tsx', 'w') as f:
    f.write(content)
