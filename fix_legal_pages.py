import re

def fix_legal_page(filename):
    with open(filename, 'r') as f:
        text = f.read()

    header = """    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* Mini Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="flex items-center gap-2 group">
            <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">BonusPromoCode</span>
          </a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </a>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">"""

    text = re.sub(
        r'<div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 font-sans">\s*<div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">',
        header,
        text
    )

    text = re.sub(r'<\/div>\s*<\/div>\s*\);\s*};', '</div>\n      </main>\n    </div>\n  );\n};', text)
    
    # Remove the back to home link inside the content
    text = re.sub(r'<div className="mt-8 pt-6 border-t border-slate-800">\s*<a href="/" onClick=.*?>&larr; Back to Home<\/a>\s*<\/div>', '', text)

    with open(filename, 'w') as f:
        f.write(text)

fix_legal_page('src/components/PrivacyPolicy.tsx')
fix_legal_page('src/components/TermsConditions.tsx')
