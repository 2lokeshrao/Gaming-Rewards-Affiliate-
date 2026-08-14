import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

ad_html_block = """                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Use <code className="text-amber-400 font-mono">&#123;&#123;country&#125;&#125;</code> as a dynamic placeholder for the user's detected country.
                  </span>
                </div>
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">Sidebar Ad/Widget HTML</label>
                  <textarea
                    rows={4}
                    value={localConfig.sidebarAdHtml || ''}
                    onChange={e => setLocalConfig({ ...localConfig, sidebarAdHtml: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm focus:border-purple-500 outline-none"
                    placeholder="<img src='...' /> or <script>...</script>"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    HTML injected into the right/left sidebar on Brand and Custom Pages. Useful for AdSense or direct banner ads.
                  </span>"""

text = text.replace("""                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Use <code className="text-amber-400 font-mono">&#123;&#123;country&#125;&#125;</code> as a dynamic placeholder for the user's detected country.
                  </span>""", ad_html_block)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
