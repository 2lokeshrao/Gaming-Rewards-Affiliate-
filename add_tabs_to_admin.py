import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Imports
if "import { AiArticleManagerTab }" not in text:
    text = text.replace(
        "import { AdminDashboardTab } from './AdminDashboardTab';",
        "import { AdminDashboardTab } from './AdminDashboardTab';\nimport { AiArticleManagerTab } from './AiArticleManagerTab';\nimport { FooterManagerTab } from './FooterManagerTab';"
    )

# Sidebar buttons
sidebar_buttons = """
            <button
              onClick={() => { setActiveTab('articles'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'articles' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              } hover:bg-slate-800`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Auto-Blogger</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('footer'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'footer' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              } hover:bg-slate-800`}
            >
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-cyan-400" />
                <span>Footer & Links Manager</span>
              </div>
            </button>
"""
if "AI Auto-Blogger" not in text:
    text = text.replace(
        "<span>Custom Pages</span>\n              </div>\n            </button>",
        "<span>Custom Pages</span>\n              </div>\n            </button>\n" + sidebar_buttons
    )

# Tab Contents
tab_contents = """
          {/* TAB: AI ARTICLES */}
          {activeTab === 'articles' && (
            <AiArticleManagerTab
              config={config}
              platforms={platforms}
              onSaveConfig={onSaveConfig}
            />
          )}

          {/* TAB: FOOTER MANAGER */}
          {activeTab === 'footer' && (
            <FooterManagerTab
              config={config}
              onSaveConfig={onSaveConfig}
            />
          )}
"""
if "<AiArticleManagerTab" not in text:
    text = text.replace(
        "</Suspense>\n    </div>\n  );\n};",
        tab_contents + "\n        </div>\n      </div>\n    </div>\n  );\n};\n"
    )

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
