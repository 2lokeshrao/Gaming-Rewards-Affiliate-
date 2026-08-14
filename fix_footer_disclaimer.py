import re

with open('src/types.ts', 'r') as f:
    text = f.read()

if "footerDisclaimerText?:" not in text:
    text = text.replace("copyrightText?: string;", "copyrightText?: string;\n  footerDisclaimerText?: string;")

with open('src/types.ts', 'w') as f:
    f.write(text)


with open('src/components/FooterManagerTab.tsx', 'r') as f:
    text = f.read()

disclaimer_state = """
  const [footerDisclaimerText, setFooterDisclaimerText] = useState(config.footerDisclaimerText || 'This site is an independent gaming review and affiliate portal. We provide promotional bonus codes and reviews for licensed online gaming and sports platforms. Please gamble responsibly. 18+ Only.');
"""
text = text.replace("  const [copyrightText, setCopyrightText] = useState(", disclaimer_state + "  const [copyrightText, setCopyrightText] = useState(")

save_handler = """  const handleSave = () => {
    onSaveConfig({ ...config, footerColumns: columns, copyrightText, footerDisclaimerText });
"""
text = text.replace("  const handleSave = () => {\n    onSaveConfig({ ...config, footerColumns: columns, copyrightText });", save_handler)

ui_field = """
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 space-y-4">
        <div>
          <label className="block text-white font-bold mb-2">Copyright & Footer Text</label>
          <input 
            type="text" 
            value={copyrightText}
            onChange={e => setCopyrightText(e.target.value)}
            placeholder="e.g. My Website &copy; 2024"
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
          />
          <p className="text-xs text-slate-400 mt-2">Use &amp;copy; for the copyright symbol.</p>
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Footer Disclaimer Text</label>
          <textarea 
            rows={3}
            value={footerDisclaimerText}
            onChange={e => setFooterDisclaimerText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
"""
text = re.sub(r'<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">.*?<div className="grid grid-cols-1 md:grid-cols-2 gap-6">', ui_field, text, flags=re.DOTALL)

with open('src/components/FooterManagerTab.tsx', 'w') as f:
    f.write(text)


with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

replacement = """          <p className="max-w-3xl mx-auto leading-relaxed text-slate-400 text-[11px]">
            {config.footerDisclaimerText || 'This site is an independent gaming review and affiliate portal. We provide promotional bonus codes and reviews for licensed online gaming and sports platforms. Please gamble responsibly. 18+ Only.'} <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/privacy-policy'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="underline hover:text-amber-400 ml-2">{t('footer.privacy')}</a> | <a href="/terms" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/terms'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="underline hover:text-amber-400 ml-2">{t('footer.terms')}</a>
          </p>"""

text = re.sub(r'<p className="max-w-3xl mx-auto leading-relaxed text-slate-400 text-\[11px\]">.*?</p>', replacement, text, flags=re.DOTALL)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)

