import re

with open('src/components/BrandArticlePage.tsx', 'r') as f:
    text = f.read()

if "import Markdown from" not in text:
    text = text.replace("import React, { useEffect, useMemo } from 'react';", "import React, { useEffect, useMemo } from 'react';\nimport Markdown from 'react-markdown';")

old_render = """              <article className="prose prose-invert prose-slate max-w-none prose-h4:text-slate-200 prose-h4:font-bold prose-h4:text-lg prose-p:leading-relaxed prose-p:text-slate-400">
                <h4>{content.promoTitle}</h4>
                <p dangerouslySetInnerHTML={{ __html: content.promoContent }} />
                
                <h4>{content.paymentTitle}</h4>
                <p dangerouslySetInnerHTML={{ __html: content.paymentContent }} />
                
                <h4>{content.legalTitle}</h4>
                <p dangerouslySetInnerHTML={{ __html: content.legalContent }} />
              </article>"""

new_render = """              <div className="prose prose-invert prose-slate max-w-none prose-h4:text-slate-200 prose-h4:font-bold prose-h4:text-lg prose-p:leading-relaxed prose-p:text-slate-400 markdown-body">
                {platform.reviewContent ? (
                  <Markdown>{platform.reviewContent}</Markdown>
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

text = text.replace(old_render, new_render)

with open('src/components/BrandArticlePage.tsx', 'w') as f:
    f.write(text)
