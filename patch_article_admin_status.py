import re

with open('src/components/AiArticleManagerTab.tsx', 'r') as f:
    text = f.read()

status_select = """
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                <select 
                  value={editingArticle.status || 'published'}
                  onChange={e => setEditingArticle({...editingArticle, status: e.target.value as any})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
              <div className="md:col-span-2" data-color-mode="dark">
"""
text = text.replace('<div data-color-mode="dark">', status_select)
text = text.replace('className="grid grid-cols-2 gap-4"', 'className="grid grid-cols-1 md:grid-cols-3 gap-4"')

with open('src/components/AiArticleManagerTab.tsx', 'w') as f:
    f.write(text)
