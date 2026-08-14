import re

with open('src/components/ProgrammaticSeoArticles.tsx', 'r') as f:
    content = f.read()

# Replace snippet with full article
old_snippet = r"\{/\* SEO Snippet & Internal Link \*/\}.*?</div>"

new_article = """{/* SEO Article Text */}
                      <article className="prose prose-invert prose-slate max-w-none prose-h4:text-amber-300 prose-h4:font-bold prose-h4:mb-2 prose-h4:mt-6 prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed prose-strong:text-white prose-strong:font-bold prose-em:text-emerald-300">
                        <h4>{content.promoTitle}</h4>
                        <p dangerouslySetInnerHTML={{ __html: content.promoContent }} />

                        <h4>{content.paymentTitle}</h4>
                        <p dangerouslySetInnerHTML={{ __html: content.paymentContent }} />

                        <h4>{content.legalTitle}</h4>
                        <p dangerouslySetInnerHTML={{ __html: content.legalContent }} />
                      </article>
                      
                      {/* Internal link for dedicated page */}
                      <div className="mt-6 text-center sm:text-left border-t border-slate-800/80 pt-4">
                        <a 
                          href={`/brands/${platform.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${geoContext.country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          onClick={(e) => {
                             e.preventDefault();
                             const targetUrl = `/brands/${platform.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${geoContext.country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                             window.history.pushState({}, '', targetUrl);
                             window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className="inline-flex items-center gap-1 text-emerald-400 font-bold text-sm hover:text-emerald-300 hover:underline"
                        >
                          Read Full 2026 Dedicated Review Page <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>"""

content = re.sub(old_snippet, new_article, content, flags=re.DOTALL)

with open('src/components/ProgrammaticSeoArticles.tsx', 'w') as f:
    f.write(content)
