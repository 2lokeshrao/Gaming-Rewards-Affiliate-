import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

# Add Custom Pages column to the footer
custom_pages_col = """
            {customPages && customPages.filter(p => p.isActive).length > 0 && (
              <div>
                <h4 className="text-white font-bold mb-3 uppercase text-[10px] tracking-wider">Pages</h4>
                <ul className="space-y-2">
                  {customPages.filter(p => p.isActive).map(p => (
                    <li key={p.id}>
                      <a href={`/${p.slug}`}
                         onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', `/${p.slug}`); window.dispatchEvent(new PopStateEvent('popstate')); }}
                         className="text-slate-400 hover:text-emerald-400 transition-colors">
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
"""

if "Pages</h4>" not in text:
    text = text.replace("{(config.footerColumns || []).map(col => (", custom_pages_col + "\n            {(config.footerColumns || []).map(col => (")

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)
