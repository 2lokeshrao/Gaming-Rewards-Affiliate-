import re

with open('src/components/FinancialHubPage.tsx', 'r') as f:
    text = f.read()

# Replace Sidebar container
text = re.sub(r'\{/\*\s*Sidebar \/ Loan Offers\s*\*/\}\s*<div className="space-y-6">', '{/* Sidebar / Loan Offers */}\n          <aside className="lg:col-span-1 space-y-8">', text)

# Replace end container
text = re.sub(r'<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>', '</div>\n            </div>\n            <Sidebar platforms={platforms} customPages={customPages} config={config} geo={geo} />\n          </aside>\n        </div>\n      </main>', text)

with open('src/components/FinancialHubPage.tsx', 'w') as f:
    f.write(text)
