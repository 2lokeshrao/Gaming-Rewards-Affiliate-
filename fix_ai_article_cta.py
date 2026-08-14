import re

with open('src/components/AiArticleView.tsx', 'r') as f:
    text = f.read()

cta_code = """
                {/* CTA Section */}
                {(() => {
                  const targetPlatform = article.platformId 
                    ? platforms.find(p => p.id === article.platformId) 
                    : (platforms.length > 0 ? platforms[0] : null);
                  
                  if (!targetPlatform) return null;
                  
                  return (
                    <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white mb-2">Ready to Start Winning?</h3>
                        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                          Join {targetPlatform.name} today and claim your exclusive {targetPlatform.bonusText || 'Welcome Bonus'}!
                        </p>
                        <button 
                          onClick={() => onClaimClick(targetPlatform)}
                          className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95"
                        >
                          Claim Bonus & Play Now
                        </button>
                      </div>
                    </div>
                  );
                })()}
"""

if "CTA Section" not in text:
    text = text.replace("                </div>\n                \n                {article.tags", "                </div>\n                " + cta_code + "\n                {article.tags")

with open('src/components/AiArticleView.tsx', 'w') as f:
    f.write(text)
