import re

with open('src/components/AiArticleManagerTab.tsx', 'r') as f:
    text = f.read()

# Add a "Write Manually" button.
# Replace the Generate button block
old_buttons = """        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !topic}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isGenerating ? 'AI is researching & writing...' : 'Generate Full SEO Article'}
        </button>"""

new_buttons = """        <div className="flex gap-4">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? 'AI is researching & writing...' : 'Generate Full SEO Article'}
          </button>
          
          <button 
            onClick={() => {
              const platform = platforms.find(p => p.id === selectedPlatformId);
              setEditingArticle({
                id: 'new_' + Math.floor(Math.random() * 1000000),
                slug: '',
                title: '',
                content: '# Write your article here...',
                category: category || categories[0],
                platformId: selectedPlatformId || undefined,
                platformName: platform?.name,
                metaTitle: '',
                metaDescription: '',
                publishedAt: new Date().toISOString(),
                author: 'Admin',
                tags: [],
                views: 0
              });
            }}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex justify-center items-center gap-2"
          >
            <Edit3 className="w-5 h-5" />
            Write Manually
          </button>
        </div>"""

text = text.replace(old_buttons, new_buttons)

# Fix handleSaveEdit to handle appending new articles
old_save_edit = """  const handleSaveEdit = () => {
    if (!editingArticle) return;
    const updated = articles.map(a => a.id === editingArticle.id ? editingArticle : a);
    setArticles(updated);
    onSaveConfig({ ...config, articles: updated });
    setEditingArticle(null);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };"""

new_save_edit = """  const handleSaveEdit = () => {
    if (!editingArticle) return;
    
    // Auto-generate slug if it's missing or empty
    if (!editingArticle.slug || editingArticle.id.startsWith('new_')) {
      editingArticle.slug = editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!editingArticle.slug) editingArticle.slug = 'article-' + Math.floor(Math.random() * 1000);
    }

    let updated;
    if (editingArticle.id.startsWith('new_')) {
      // Remove 'new_' prefix to save as a real id
      const newArt = { ...editingArticle, id: 'art_' + Math.floor(Math.random() * 1000000) };
      updated = [newArt, ...articles];
    } else {
      updated = articles.map(a => a.id === editingArticle.id ? editingArticle : a);
    }
    
    setArticles(updated);
    onSaveConfig({ ...config, articles: updated });
    setEditingArticle(null);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };"""

text = text.replace(old_save_edit, new_save_edit)

with open('src/components/AiArticleManagerTab.tsx', 'w') as f:
    f.write(text)
