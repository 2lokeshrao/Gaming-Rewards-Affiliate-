import re

with open('src/components/CustomPageView.tsx', 'r') as f:
    text = f.read()

header = """    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* Mini Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
            <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">BonusPromoCode</span>
          </a>
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </a>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">"""

text = re.sub(
    r'<div className="bg-slate-950 text-slate-300 font-sans pt-8 pb-16">\s*<div className="max-w-7xl mx-auto px-4">',
    header,
    text
)

# Fix closing tags
text = re.sub(r'<\/div>\s*<\/div>\s*\);\s*};', '</main>\n    </div>\n  );\n};', text)

with open('src/components/CustomPageView.tsx', 'w') as f:
    f.write(text)

