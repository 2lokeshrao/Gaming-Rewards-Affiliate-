import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

pages_ui = """
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-amber-400" /> Custom CMS Pages</h3>
                  <button onClick={handleSavePages} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold text-sm">
                    Save Changes
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Page Title</label>
                    <input type="text" value={pageTitle} onChange={e => { setPageTitle(e.target.value); if(!editingPageId) setPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Slug</label>
                    <input type="text" value={pageSlug} onChange={e => setPageSlug(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">HTML Content</label>
                  <textarea rows={10} value={pageContent} onChange={e => setPageContent(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-sm"></textarea>
                </div>
                
                <button onClick={handleAddOrUpdatePage} className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg uppercase w-full font-bold">
                  {editingPageId ? 'Update Page' : 'Add New Page'}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-bold">Existing Pages</h4>
                {pagesList.map(p => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-white">{p.title}</h5>
                      <p className="text-xs text-slate-400">/{p.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditPage(p)} className="p-2 bg-slate-800 text-blue-400 rounded hover:bg-slate-700"><Settings className="w-4 h-4" /></button>
                      <button onClick={() => handleDeletePage(p.id)} className="p-2 bg-slate-800 text-red-400 rounded hover:bg-slate-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
"""

if "activeTab === 'pages' && (" not in text:
    text = text.replace("          {activeTab === 'subpartners' && (", pages_ui + "\n          {activeTab === 'subpartners' && (")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
