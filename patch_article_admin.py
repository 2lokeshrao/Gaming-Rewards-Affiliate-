import re

with open('src/components/AiArticleManagerTab.tsx', 'r') as f:
    text = f.read()

settings_ui = """
      {/* Auto-Blogger Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-400" />
          Automated Content Service
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Enable the Gemini-powered background service to automatically generate trending articles and save them as drafts for your review.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 text-white cursor-pointer bg-slate-950 p-4 rounded-xl border border-slate-800">
            <input 
              type="checkbox"
              checked={config.autoBlogSettings?.enabled || false}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...config.autoBlogSettings, enabled: e.target.checked}} as any)}
              className="w-5 h-5 accent-purple-500 rounded"
            />
            <span className="font-bold">Enable Automated Auto-Blogger</span>
          </label>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Interval (Hours)</label>
            <input 
              type="number"
              min="1"
              value={config.autoBlogSettings?.intervalHours || 24}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...config.autoBlogSettings, intervalHours: parseInt(e.target.value)}} as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" 
            />
          </div>
        </div>
      </div>
"""

if "Auto-Blogger Configuration" not in text:
    text = text.replace("{/* Generator Section */}", settings_ui + "\n      {/* Generator Section */}")

# Fix article list to show drafts and published
article_list_item = """
            <div key={art.id} className={`bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between ${art.status === 'draft' ? 'opacity-70 border-dashed' : ''}`}>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-sm">{art.title}</h5>
                  {art.status === 'draft' && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded uppercase font-bold tracking-wider">Draft</span>}
                </div>
                <div className="flex gap-3 text-xs text-slate-400 mt-1">
                  <span className="bg-slate-800 px-2 py-0.5 rounded">{art.category}</span>
                  <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  <span>/blog/{art.slug}</span>
                </div>
              </div>
"""
text = re.sub(r'<div key=\{art\.id\} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">.*?</div>\n              <div className="flex gap-2">', article_list_item + '              <div className="flex gap-2">', text, flags=re.DOTALL)

with open('src/components/AiArticleManagerTab.tsx', 'w') as f:
    f.write(text)
