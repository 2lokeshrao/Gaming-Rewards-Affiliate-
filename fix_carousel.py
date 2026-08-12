import re

with open('src/components/TopThreeCarousel.tsx', 'r') as f:
    content = f.read()

target1 = """                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-bold">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-slate-300 ml-1">({p.rating}/10)</span>
                      </div>"""

replacement1 = """                      <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-bold">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(p.averageUserRating || p.starRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`} />
                          ))}
                        </div>
                        <span className="text-slate-300">({(p.totalReviewsCount || 10500).toLocaleString()})</span>
                      </div>"""

target2 = """                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Trust Rating</span>
                    <span className="text-lg font-black text-emerald-400">{p.rating} / 10</span>
                  </div>"""

replacement2 = """                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Global Rating</span>
                    <span className="text-lg font-black text-emerald-400">{p.averageUserRating?.toFixed(1) || p.starRating}.0<span className="text-xs text-emerald-600">/5</span></span>
                  </div>"""

content = content.replace(target1, replacement1).replace(target2, replacement2)

with open('src/components/TopThreeCarousel.tsx', 'w') as f:
    f.write(content)
