import re

with open('src/components/WalletArticlePage.tsx', 'r') as f:
    text = f.read()

# Replace <main className="..."> with Grid
text = re.sub(
    r'<main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">', 
    '<main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">', 
    text
)

# Put article body in a grid
text = re.sub(
    r'\{/\* Article Body \*/\}\s*<article className="prose prose-invert prose-slate prose-lg max-w-none">',
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">\n          <div className="lg:col-span-2">\n        {/* Article Body */}\n        <article className="prose prose-invert prose-slate prose-lg max-w-none">',
    text
)

# Close grid and add sidebar
text = re.sub(
    r'<\/article>\s*<\/main>',
    '</article>\n          </div>\n          <aside className="lg:col-span-1 space-y-8">\n            <Sidebar platforms={platforms} customPages={customPages} config={config} geo={geo} />\n          </aside>\n        </div>\n      </main>',
    text
)

with open('src/components/WalletArticlePage.tsx', 'w') as f:
    f.write(text)
