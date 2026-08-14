import re

with open('src/components/AiArticleManagerTab.tsx', 'r') as f:
    text = f.read()

# Add a text area for Topics and Categories in the Auto-Blogger Configuration
topics_ui = """
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content Categories (comma separated)</label>
            <input 
              type="text"
              value={config.autoBlogSettings?.categories?.join(', ') || 'Gaming, Crypto, Finance, Loans, Virtual Cards'}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...(config.autoBlogSettings || {}), categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}} as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" 
              placeholder="e.g. Gaming, Crypto, Loans"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Topics / Prompts (comma separated)</label>
            <textarea 
              value={config.autoBlogSettings?.topics?.join(', ') || 'Best crypto wallets for gaming, Top virtual cards for cashout, Instant loan apps for gamers'}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...(config.autoBlogSettings || {}), topics: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}} as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono text-sm" 
              rows={3}
              placeholder="Enter specific topics you want the AI to write about"
            />
          </div>
"""

# Insert into the Auto-Blogger Configuration div
text = text.replace("Interval (Hours)</label>", "Interval (Hours)</label>") # Just checking it exists
text = re.sub(r'(<label className="block text-xs font-bold text-slate-400 uppercase mb-1">Interval \(Hours\)</label>.*?</div>\n\s*</div>)', r'\1\n' + topics_ui, text, flags=re.DOTALL)

with open('src/components/AiArticleManagerTab.tsx', 'w') as f:
    f.write(text)
