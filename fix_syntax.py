files = [
    'src/components/BrandArticlePage.tsx',
    'src/components/AiArticleView.tsx',
    'src/components/AdminPanel.tsx',
    'src/components/CustomPageManagerTab.tsx',
    'src/components/AiArticleManagerTab.tsx',
    'src/components/AdminDashboardTab.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("import React, { Suspense }, { useState", "import React, { Suspense, useState")
    content = content.replace("import React, { Suspense }, { useEffect", "import React, { Suspense, useEffect")
    content = content.replace("import React, { Suspense }, { useMemo", "import React, { Suspense, useMemo")
    content = content.replace("import React, { Suspense }, { useRef", "import React, { Suspense, useRef")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
