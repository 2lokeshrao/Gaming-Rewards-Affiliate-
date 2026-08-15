import os
import re

def lazy_load_library(file_path):
    if not os.path.exists(file_path):
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace react-markdown
    if "import Markdown from 'react-markdown';" in content:
        content = content.replace(
            "import Markdown from 'react-markdown';",
            "const Markdown = React.lazy(() => import('react-markdown'));"
        )
        if "import React" not in content and "import * as React" not in content:
             content = "import React, { Suspense } from 'react';\n" + content
        elif "Suspense" not in content:
             content = content.replace("import React", "import React, { Suspense }")
        
        # Wrap <Markdown> in <Suspense>
        content = re.sub(
            r'(<Markdown[^>]*>[\s\S]*?</Markdown>|<Markdown[^>]*?/>)',
            r'<Suspense fallback={<div>Loading content...</div>}>\n\1\n</Suspense>',
            content
        )

    # Replace @uiw/react-md-editor
    if "import MDEditor from '@uiw/react-md-editor';" in content:
        content = content.replace(
            "import MDEditor from '@uiw/react-md-editor';",
            "const MDEditor = React.lazy(() => import('@uiw/react-md-editor'));"
        )
        if "import React" not in content and "import * as React" not in content:
             content = "import React, { Suspense } from 'react';\n" + content
        elif "Suspense" not in content:
             content = content.replace("import React", "import React, { Suspense }")

        content = re.sub(
            r'(<MDEditor[^>]*>[\s\S]*?</MDEditor>|<MDEditor[^>]*?/>)',
            r'<Suspense fallback={<div>Loading editor...</div>}>\n\1\n</Suspense>',
            content
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

files = [
    'src/components/BrandArticlePage.tsx',
    'src/components/AiArticleView.tsx',
    'src/components/AdminPanel.tsx',
    'src/components/CustomPageManagerTab.tsx',
    'src/components/AiArticleManagerTab.tsx',
    'src/components/AdminDashboardTab.tsx'
]

for file in files:
    lazy_load_library(file)

