import re

with open('src/components/TopThreeCarousel.tsx', 'r') as f:
    content = f.read()

fallback = """
                    {['en', 'fr', 'de', 'it', 'pl'].includes(language) && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Crypto</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Visa / MC</span>
                      </>
                    )}
                    {['zh-CN', 'ja', 'ko', 'vi', 'th', 'id', 'ar', 'tr'].includes(language) && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">Tether (USDT)</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Bank Transfer</span>
                      </>
                    )}
"""

# Replace `{language === 'en' && (` with the fallback
content = content.replace("{language === 'en' && (", fallback.strip() + "\n                    {language === 'unmatched_now' && (")

with open('src/components/TopThreeCarousel.tsx', 'w') as f:
    f.write(content)

with open('src/components/OfferGrid.tsx', 'r') as f:
    content2 = f.read()

fallback_grid = """
                  {['en', 'fr', 'de', 'it', 'pl'].includes(language) && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Crypto</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Visa / MC</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Skrill</span>
                    </>
                  )}
                  {['zh-CN', 'ja', 'ko', 'vi', 'th', 'id', 'ar', 'tr'].includes(language) && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">Tether (USDT)</span>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Bank Transfer</span>
                    </>
                  )}
"""

content2 = content2.replace("{language === 'en' && (", fallback_grid.strip() + "\n                  {language === 'unmatched_now' && (")

with open('src/components/OfferGrid.tsx', 'w') as f:
    f.write(content2)
