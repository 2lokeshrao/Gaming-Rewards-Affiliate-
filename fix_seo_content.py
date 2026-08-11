import re

with open('src/components/SeoContentSection.tsx', 'r') as f:
    content = f.read()

# Update TOC links
toc_old = """      {/* Table of Contents */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-10">
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-amber-400" />
          <span>Table of Contents</span>
        </h3>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <a href="#seo-compare-table" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            2026 Gaming & Custom Coupon Search Index
          </a>
          <a href="#seo-how-to-use" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            How to Use Verification Codes
          </a>
          <a href="#seo-faq-section" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Frequently Asked Questions
          </a>
        </nav>
      </div>"""

toc_new = """      {/* Table of Contents */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-10 shadow-lg">
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-amber-400" />
          <span>Table of Contents</span>
        </h3>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <a href="#seo-compare-table" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            2026 Gaming & Custom Coupon Search Index
          </a>
          <a href="#seo-article-blocks" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Trust & Legitimacy Guide
          </a>
          <a href="#seo-tag-cloud" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Popular Search Tags
          </a>
        </nav>
      </div>"""

content = content.replace(toc_old, toc_new)

# Add ids to these sections
content = content.replace('<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-xs sm:text-sm leading-relaxed">', '<div id="seo-article-blocks" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-xs sm:text-sm leading-relaxed scroll-mt-24">')
content = content.replace('<div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">', '<div id="seo-tag-cloud" className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400 scroll-mt-24">')

# Also wait, we haven't defined breadcrumbSchemaData yet in SeoContentSection!
breadcrumb_schema_js = """  const breadcrumbSchemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bonuspromocode.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Promo Codes 2026",
        "item": "https://bonuspromocode.in/#seo-content-section"
      }
    ]
  };
"""

content = content.replace('  const faqSchemaData', breadcrumb_schema_js + '\n  const faqSchemaData')

with open('src/components/SeoContentSection.tsx', 'w') as f:
    f.write(content)
