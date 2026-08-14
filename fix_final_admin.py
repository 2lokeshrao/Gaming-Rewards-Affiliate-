import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Fix the button for Custom Pages / Subpartners
bad_block_1 = """            </div>
              activeTab === 'subpartners'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >"""

good_block_1 = """            </div>
          </button>
          <button 
            onClick={() => setActiveTab('subpartners')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'subpartners'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >"""

text = text.replace(bad_block_1, good_block_1)

# Fix the weird random button
bad_block_2 = """          {            <button 
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5" /> Custom Pages
            </button>
          {activeTab === 'subpartners' && ("""

good_block_2 = """          {activeTab === 'subpartners' && ("""

text = text.replace(bad_block_2, good_block_2)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
