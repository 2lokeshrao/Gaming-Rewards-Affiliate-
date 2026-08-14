import re

with open('src/components/Sidebar.tsx', 'r') as f:
    text = f.read()

# Make sure we import FileText
if "FileText" not in text:
    text = text.replace("import { Star, ChevronRight }", "import { Star, ChevronRight, FileText }")

# Define the recent articles block
recent_articles_block = """
      {/* Related/Recent Articles */}
      {config.articles && config.articles.filter(a => a.status !== 'draft').length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Related Articles</h3>
          </div>
          <div className="space-y-4">
            {config.articles.filter(a => a.status !== 'draft').slice(0, 5).map(article => (
              <a 
                key={article.id}
                href={`/blog/${article.slug}`}
                onClick={(e) => handleNav(e, `/blog/${article.slug}`)}
                className="group block"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-300 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h4>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                      {article.category}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
"""

if "Related/Recent Articles" not in text:
    # Insert before Custom Pages or at the bottom
    text = text.replace("    </div>\n  );\n};\n", recent_articles_block + "    </div>\n  );\n};\n")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(text)
