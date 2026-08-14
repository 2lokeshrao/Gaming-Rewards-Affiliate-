with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

bad1 = """            <button 
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
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-400" />"""

# Fix JSX formatting
content = content.replace("              }`} >", "              }`} >\n")

# Fix line 1468
content = content.replace("            {activeTab === 'subpartners' && (", "            {activeTab === 'subpartners' && (")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
