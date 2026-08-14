import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Add import
if "import { CustomPageManagerTab }" not in text:
    text = text.replace("import { AiArticleManagerTab }", "import { AiArticleManagerTab } from './AiArticleManagerTab';\nimport { CustomPageManagerTab }")
    # Actually wait, maybe AiArticleManagerTab is imported from ./AiArticleManagerTab. Let's just append at the end of imports.
    text = re.sub(r'import \{ AiArticleManagerTab \} from [^\n]+', r'\g<0>\nimport { CustomPageManagerTab } from "./CustomPageManagerTab";', text)

# Add state and navigation item
sidebar_item = """
            <button 
              onClick={() => { setActiveTab('articles'); setIsMobileMenuOpen(false); }}
"""

custom_page_btn = """
            <button 
              onClick={() => { setActiveTab('pages'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              } hover:bg-slate-800`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Custom Pages</span>
              </div>
            </button>
            <button 
              onClick={() => { setActiveTab('articles'); setIsMobileMenuOpen(false); }}
"""
if "<span>Custom Pages</span>" not in text:
    text = text.replace(sidebar_item, custom_page_btn)

# Ensure Globe is imported
if "Globe" not in text:
    text = text.replace("RefreshCw", "Globe, RefreshCw")

# Add the Tab
tab_code = """
          {/* TAB: CUSTOM PAGES */}
          {activeTab === 'pages' && (
            <CustomPageManagerTab
              pages={pagesList}
              onSavePages={(newPages) => {
                setPagesList(newPages);
                if (onSaveCustomPages) onSaveCustomPages(newPages);
              }}
            />
          )}

          {/* TAB: AI ARTICLES */}
"""
if "{/* TAB: CUSTOM PAGES */}" not in text:
    text = text.replace("          {/* TAB: AI ARTICLES */}", tab_code)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
