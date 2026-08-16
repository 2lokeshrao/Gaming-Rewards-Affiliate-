const fs = require('fs');
let code = fs.readFileSync('src/components/AiArticleView.tsx', 'utf8');

if (!code.includes('AffiliateLinkCard')) {
  code = code.replace(/import \{ Sidebar \} from '\.\/Sidebar';/, "import { Sidebar } from './Sidebar';\nimport { AffiliateLinkCard } from './AffiliateLinkCard';");
  
  const target = "</article>";
  const replacement = `
                {article.affiliateLinks && article.affiliateLinks.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-800">
                    <h3 className="text-xl font-black text-white mb-6">Recommended Offers</h3>
                    <div className="space-y-4">
                      {article.affiliateLinks.map((link) => (
                        <AffiliateLinkCard key={link.id} link={link} />
                      ))}
                    </div>
                  </div>
                )}
              </article>`;
  
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/AiArticleView.tsx', code);
}
