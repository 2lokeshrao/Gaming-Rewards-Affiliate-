import re

with open('src/components/BrandArticlePage.tsx', 'r') as f:
    text = f.read()

new_render = """              <div className="prose prose-invert prose-slate max-w-none prose-h4:text-slate-200 prose-h4:font-bold prose-h4:text-lg prose-p:leading-relaxed prose-p:text-slate-400 markdown-body">
                {platform.reviewContent ? (
                  platform.reviewContent.split('[CTA]').map((part, index, array) => (
                    <React.Fragment key={index}>
                      <Markdown>{part}</Markdown>
                      {index < array.length - 1 && (
                         <div className="my-8 flex justify-center">
                           <button 
                             onClick={() => onClaimClick(platform)}
                             className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-lg uppercase tracking-widest shadow-lg transition-transform transform hover:scale-105 active:scale-95 flex items-center gap-2"
                           >
                             {platform.bonusText || 'Claim Bonus Now'} <ArrowRight className="w-5 h-5" />
                           </button>
                         </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <h4>{content.promoTitle}</h4>
                    <p dangerouslySetInnerHTML={{ __html: content.promoContent }} />
                    
                    <h4>{content.paymentTitle}</h4>
                    <p dangerouslySetInnerHTML={{ __html: content.paymentContent }} />
                    
                    <h4>{content.legalTitle}</h4>
                    <p dangerouslySetInnerHTML={{ __html: content.legalContent }} />
                  </>
                )}
              </div>"""

text = re.sub(r'<div className="prose prose-invert prose-slate.*?</div>', new_render, text, flags=re.DOTALL)

with open('src/components/BrandArticlePage.tsx', 'w') as f:
    f.write(text)
