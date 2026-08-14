import re

with open('src/components/ProgrammaticSeoArticles.tsx', 'r') as f:
    content = f.read()

# Replace the heavy text article with a preview block and a link
old_article = """                      {/* SEO Article Text */}
                      <article className="prose prose-invert prose-slate max-w-none prose-h4:text-amber-300 prose-h4:font-bold prose-h4:mb-2 prose-h4:mt-6 prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed prose-strong:text-white prose-strong:font-bold prose-em:text-emerald-300">
                        <h4>{content.promoTitle}</h4>
                        <p dangerouslySetInnerHTML={{ __html: content.promoContent }} />

                        <h4>{content.paymentTitle}</h4>
                        <p dangerouslySetInnerHTML={{ __html: content.paymentContent }} />

                        <h4>{content.legalTitle}</h4>
                        <p dangerouslySetInnerHTML={{ __html: content.legalContent }} />
                      </article>"""

new_article = """                      {/* SEO Snippet & Internal Link */}
                      <div className="mb-6">
                        <h4 className="text-amber-300 font-bold text-lg mb-2">{content.promoTitle}</h4>
                        <p className="text-slate-400 text-sm line-clamp-3 mb-3">
                          {content.promoContent.replace(/<[^>]+>/g, '')}
                        </p>
                        
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
                          Read Full {new Date().getFullYear()} SEO Guide <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>"""

content = content.replace(old_article, new_article)

with open('src/components/ProgrammaticSeoArticles.tsx', 'w') as f:
    f.write(content)
