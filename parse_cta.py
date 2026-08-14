import re

with open('src/components/AiArticleView.tsx', 'r') as f:
    text = f.read()

# Replace [CTA] with actual CTA component if they type it in markdown
# The markdown renderer just renders text. So we should intercept it.
# Wait, react-markdown has components prop. But it's easier to just do a regex replace on the content string before passing to Markdown!
# Actually, if we do a regex replace, it might break markdown if we inject raw HTML string unless rehypeRaw is used.
# Let's replace [CTA] with a special HTML string and use rehypeRaw? No, react-markdown without rehypeRaw strips HTML.
# A simpler way: since we use react-markdown, we can just let the existing CTA banner at the bottom do the job, OR we can replace [CTA] with `<button class="...">Claim Bonus</button>` and use rehype-raw.
# BUT wait! We ALREADY put the CTA at the bottom dynamically!
# "custom affiliate button placeholders that can be configured per article."
# Ok, let's just use simple text replacement: we split the article content by `[CTA]` and map it.

split_logic = """
                  <div className="markdown-body">
                    {article.content.split('[CTA]').map((part, index, array) => (
                      <React.Fragment key={index}>
                        <Markdown>{part}</Markdown>
                        {index < array.length - 1 && targetPlatform && (
                           <div className="my-8 flex justify-center">
                             <button 
                               onClick={() => onClaimClick(targetPlatform)}
                               className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-lg uppercase tracking-widest shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                             >
                               {targetPlatform.bonusText || 'Claim Bonus Now'}
                             </button>
                           </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
"""

old_logic = """                  <div className="markdown-body">
                    <Markdown>{article.content}</Markdown>
                  </div>"""

text = text.replace(old_logic, split_logic)

# Make sure targetPlatform is computed earlier, so we can use it in the Markdown body!
target_platform_logic = """  const targetPlatform = article.platformId 
    ? platforms.find(p => p.id === article.platformId) 
    : (platforms.length > 0 ? platforms[0] : null);

  useEffect(() => {"""
text = text.replace("  useEffect(() => {", target_platform_logic, 1)

# And remove it from the bottom CTA since it's already computed
text = text.replace("""                  const targetPlatform = article.platformId 
                    ? platforms.find(p => p.id === article.platformId) 
                    : (platforms.length > 0 ? platforms[0] : null);
                  
                  if (!targetPlatform) return null;""", "if (!targetPlatform) return null;")

with open('src/components/AiArticleView.tsx', 'w') as f:
    f.write(text)
