import re
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add CustomPage to imports
if "CustomPage" not in content:
    content = content.replace("GamingPlatform, GlobalConfig, PlatformStats", "GamingPlatform, GlobalConfig, PlatformStats, CustomPage")

# Add CustomPage state
state_additions = """
  const [pagesList, setPagesList] = useState<CustomPage[]>(customPages || []);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');

  const handleSavePages = async () => {
    try {
      const response = await fetch('/api/admin/custom-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: pagesList })
      });
      if (response.ok) {
        alert('Custom pages saved successfully! Please wait a moment and refresh.');
      }
    } catch (error) {
      console.error('Error saving pages:', error);
      alert('Failed to save pages');
    }
  };

  const handleAddOrUpdatePage = () => {
    if (!pageTitle || !pageSlug) {
      alert("Title and Slug are required.");
      return;
    }
    
    if (editingPageId) {
      setPagesList(pagesList.map(p => p.id === editingPageId ? {
        ...p,
        title: pageTitle,
        slug: pageSlug.replace(/[^a-z0-9-]/g, '').toLowerCase(),
        content: pageContent
      } : p));
      setEditingPageId(null);
    } else {
      setPagesList([...pagesList, {
        id: Date.now().toString(),
        title: pageTitle,
        slug: pageSlug.replace(/[^a-z0-9-]/g, '').toLowerCase(),
        content: pageContent,
        isActive: true
      }]);
    }
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
  };

  const handleEditPage = (p: CustomPage) => {
    setEditingPageId(p.id);
    setPageTitle(p.title);
    setPageSlug(p.slug);
    setPageContent(p.content);
  };
  
  const handleDeletePage = (id: string) => {
    setPagesList(pagesList.filter(p => p.id !== id));
  };
"""

if "const handleSavePages =" not in content:
    content = content.replace("const handleSavePlatforms = async", state_additions + "\n  const handleSavePlatforms = async")

# Add tab button
tab_btn = """            <button 
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5" /> Custom Pages
            </button>"""
if "Custom Pages" not in content:
    content = content.replace("activeTab === 'subpartners'", tab_btn + "\n            <button \n              onClick={() => setActiveTab('subpartners')}")
    # Fix import
    content = content.replace("Settings, Shield,", "Settings, Shield, FileText,")

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
                
                <button onClick={handleAddOrUpdatePage} className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg uppercase">
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
                      <button onClick={() => handleEditPage(p)} className="p-2 bg-slate-800 text-blue-400 rounded"><Settings className="w-4 h-4" /></button>
                      <button onClick={() => handleDeletePage(p.id)} className="p-2 bg-slate-800 text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
"""
if "activeTab === 'pages'" not in content:
    content = content.replace("{activeTab === 'analytics' && (", pages_ui + "\n          {activeTab === 'analytics' && (")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
