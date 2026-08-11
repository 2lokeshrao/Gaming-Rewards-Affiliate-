import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

bad_button = """            <button
              onClick={() => { setActiveTab('seo_health'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'seo_health' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>SEO Health Limits</span>
            </button>"""

good_desktop_button = """          <button
            onClick={() => setActiveTab('seo_health')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'seo_health'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 text-blue-400" />
            <span>SEO Health Limits</span>
          </button>"""

# Replace the second occurrence of bad_button
parts = content.split(bad_button)
if len(parts) == 3:
    content = parts[0] + bad_button + parts[1] + good_desktop_button + parts[2]
else:
    print("Warning: unexpected number of matches")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
