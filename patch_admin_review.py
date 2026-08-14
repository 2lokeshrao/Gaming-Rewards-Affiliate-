import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

review_ui = """
                    <div className="sm:col-span-2 mt-4" data-color-mode="dark">
                      <label className="block text-amber-400 font-bold mb-2 text-sm border-b border-slate-800 pb-2 flex justify-between items-center">
                        <span>Custom Review Content (Optional)</span>
                        <span className="text-slate-500 text-[10px] font-normal tracking-wide uppercase">Overrides default SEO template</span>
                      </label>
                      <MDEditor
                        value={editingPlatform.reviewContent || ''}
                        onChange={(val) => setEditingPlatform({...editingPlatform, reviewContent: val || ''})}
                        height={400}
                        style={{ backgroundColor: '#020617' }}
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Use Markdown to format. If left empty, the programmatic SEO template will be used for this brand's page.</p>
                    </div>
"""

# Insert it before {/* SEO Metadata Sub-section inside Platform Add/Edit */}
if "Custom Review Content (Optional)" not in text:
    text = text.replace("{/* SEO Metadata Sub-section inside Platform Add/Edit */}", review_ui + "\n                    {/* SEO Metadata Sub-section inside Platform Add/Edit */}")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
