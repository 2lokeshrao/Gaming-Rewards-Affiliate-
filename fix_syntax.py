import re
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix 1
bad_1 = """            <button 
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5" /> Custom Pages
            </button>
            <button 
              onClick={() => setActiveTab('subpartners')} ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >"""

good_1 = """            <button 
              onClick={() => setActiveTab('pages')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between cursor-pointer ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Custom Pages</span>
              </div>
            </button>
            <button 
              onClick={() => { setActiveTab('subpartners'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between cursor-pointer ${
                activeTab === 'subpartners' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >"""
content = content.replace(bad_1, good_1)

# Fix 2
bad_2 = """                          <button 
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5" /> Custom Pages
            </button>
            <button 
              onClick={() => setActiveTab('subpartners')}
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >"""

good_2 = """                          <button 
            onClick={() => setActiveTab('pages')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'pages'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>Custom Pages</span>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('subpartners')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'subpartners'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >"""
content = content.replace(bad_2, good_2)

# Fix 3
bad_3 = """              }`}
            >
              <FileText className="w-5 h-5" /> Custom Pages
            </button>
            <button 
              onClick={() => setActiveTab('subpartners')} && ("""

good_3 = """              }`}
            >
              <FileText className="w-5 h-5" /> Custom Pages
            </button>
          {activeTab === 'subpartners' && ("""
content = content.replace(bad_3, good_3)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
