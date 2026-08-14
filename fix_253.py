import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

bad = """              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'partnerapi' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              `}"""

good = """              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'partnerapi' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}"""
              
text = text.replace(bad, good)

# Just fix all of them globally
text = re.sub(r'(\s+)activeTab === \'([^\']+)\' \? \'([^\']+)\' : \'([^\']+)\'\n(\s+)`\}', 
              r'\1activeTab === \'\2\' ? \'\3\' : \'\4\'\n\5}`}', text)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
