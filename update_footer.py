import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

# Replace hardcoded columns with dynamic config columns
# Search for: <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto py-6 border-b border-slate-800/80 mb-6">
replacement_code = """          {/* Dynamic Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto py-6 border-b border-slate-800/80 mb-6">
            <div>
              <h4 className="text-white font-bold mb-3 uppercase text-[10px] tracking-wider">Top Brands</h4>
              <ul className="space-y-2">
                {platforms.filter(p => p.isActive).slice(0, 4).map(p => (
                  <li key={p.id}>
                    <a href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${geo.countryCode ? geo.countryCode.toLowerCase() : 'global'}`}
                       onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${geo.countryCode ? geo.countryCode.toLowerCase() : 'global'}`); window.dispatchEvent(new PopStateEvent('popstate')); }}
                       className="text-slate-400 hover:text-amber-400 transition-colors">
                      {p.name} Reviews
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {(config.footerColumns || []).map(col => (
              <div key={col.id}>
                <h4 className="text-white font-bold mb-3 uppercase text-[10px] tracking-wider">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url}
                         onClick={(e) => { 
                           if (link.url.startsWith('/')) {
                             e.preventDefault(); 
                             window.history.pushState({}, '', link.url); 
                             window.dispatchEvent(new PopStateEvent('popstate')); 
                           }
                         }}
                         className="text-slate-400 hover:text-emerald-400 transition-colors"
                         target={link.url.startsWith('http') ? '_blank' : '_self'}
                         rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
"""

pattern = r'<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto py-6 border-b border-slate-800/80 mb-6">[\s\S]*?(?=<div className="flex items-center justify-center gap-2 font-bold text-slate-200">)'

text = re.sub(pattern, replacement_code + "          ", text)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)
