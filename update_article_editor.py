import re

with open('src/components/AiArticleManagerTab.tsx', 'r') as f:
    text = f.read()

if "import MDEditor from" not in text:
    text = text.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport MDEditor from '@uiw/react-md-editor';")

old_textarea = """<textarea 
                  rows={15}
                  value={editingArticle.content}
                  onChange={e => setEditingArticle({...editingArticle, content: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-xs" 
                />"""

new_editor = """<div data-color-mode="dark">
                  <MDEditor
                    value={editingArticle.content}
                    onChange={(val) => setEditingArticle({...editingArticle, content: val || ''})}
                    height={400}
                    style={{ backgroundColor: '#020617' }}
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Use Markdown to format. To add a custom affiliate button, you can just type [CTA] and it will be replaced automatically in the frontend.</p>
                </div>"""

text = text.replace(old_textarea, new_editor)

with open('src/components/AiArticleManagerTab.tsx', 'w') as f:
    f.write(text)
