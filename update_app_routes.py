import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Add import
if "import { AiArticleView }" not in text:
    text = text.replace(
        "import { Footer } from './components/Footer';",
        "import { Footer } from './components/Footer';\nimport { AiArticleView } from './components/AiArticleView';"
    )

# Add route match logic
route_logic = """
  const customPageMatch = customPages.find(p => currentPath === `/${p.slug}`);
  const articleMatch = config?.articles?.find(a => currentPath === `/blog/${a.slug}`);

  if (articleMatch) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400">Loading Article...</div>}>
        <AiArticleView article={articleMatch} platforms={platforms} customPages={customPages} config={config!} geo={geo} onClaimClick={handleClaimClick} />
      </Suspense>
    );
  }
"""

text = re.sub(r'  const customPageMatch = customPages\.find\(p => currentPath === `/\$\{p\.slug\}`\);', route_logic, text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
