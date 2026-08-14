import re

with open('src/components/FinancialHubPage.tsx', 'r') as f:
    text = f.read()

pattern = r"""          \{/\* Sidebar / Loan Offers \*/\}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 sticky top-24">"""

replacement = """          {/* Sidebar / Loan Offers */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 sticky top-24">"""

text = text.replace(pattern, replacement)

pattern_end = r"""              </div>
            </div>
          </div>
        </div>"""

replacement_end = """              </div>
            </div>
            
            <Sidebar platforms={platforms} customPages={customPages} config={config} geo={geo} />
          </aside>
        </div>"""

text = text.replace(pattern_end, replacement_end)

with open('src/components/FinancialHubPage.tsx', 'w') as f:
    f.write(text)

