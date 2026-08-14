import re

with open('src/components/FooterManagerTab.tsx', 'r') as f:
    text = f.read()

copyright_state = """
  const [copyrightText, setCopyrightText] = useState(config.copyrightText || `BonusPromoCode.in Affiliate Portal &copy; ${new Date().getFullYear()}`);
"""

save_handler = """  const handleSave = () => {
    onSaveConfig({ ...config, footerColumns: columns, copyrightText });
"""

ui_field = """
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
"""

text = text.replace("  const [savedToast, setSavedToast] = useState(false);", "  const [savedToast, setSavedToast] = useState(false);" + copyright_state)
text = text.replace("  const handleSave = () => {\n    onSaveConfig({ ...config, footerColumns: columns });", save_handler)
text = text.replace("      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">", ui_field)

with open('src/components/FooterManagerTab.tsx', 'w') as f:
    f.write(text)
