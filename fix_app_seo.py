import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { ProgrammaticSeoArticles } from './components/ProgrammaticSeoArticles';\n"

if "ProgrammaticSeoArticles" not in content:
    content = content.replace("import { SeoContentSection } from './components/SeoContentSection';", "import { SeoContentSection } from './components/SeoContentSection';\nimport { ProgrammaticSeoArticles } from './components/ProgrammaticSeoArticles';")
    
    # Check for lazy loading variant just in case
    content = content.replace("const SeoContentSection = lazy(() => import('./components/SeoContentSection').then(m => ({ default: m.SeoContentSection })));", "const SeoContentSection = lazy(() => import('./components/SeoContentSection').then(m => ({ default: m.SeoContentSection })));\nconst ProgrammaticSeoArticles = lazy(() => import('./components/ProgrammaticSeoArticles').then(m => ({ default: m.ProgrammaticSeoArticles })));")

if "<ProgrammaticSeoArticles" not in content:
    content = content.replace("<SeoContentSection", "<ProgrammaticSeoArticles\n            platforms={platforms}\n            geo={geo}\n            onClaimClick={handleClaimClick}\n          />\n\n          {/* Original Table */}\n          <SeoContentSection")

with open('src/App.tsx', 'w') as f:
    f.write(content)
