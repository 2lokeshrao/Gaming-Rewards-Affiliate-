import re

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

    # Re-wrap Markdown to fallback empty if missing
    if "import React, { Suspense, useState, useEffect } from 'react';" in content:
        pass
    else:
        # Just ensure React exists
        if "import React" not in content and "import * as React" not in content:
             content = "import React, { Suspense } from 'react';\n" + content
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
