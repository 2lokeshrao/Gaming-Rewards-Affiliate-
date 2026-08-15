import re

with open('vite.config.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove recharts from vendor-ui
content = content.replace("'vendor-ui': ['lucide-react', 'recharts']", "'vendor-ui': ['lucide-react']")
content = content.replace("'vendor-editor': ['@uiw/react-md-editor', 'react-markdown', 'dompurify', 'isomorphic-dompurify']", "'vendor-editor': ['dompurify', 'isomorphic-dompurify']")

with open('vite.config.ts', 'w', encoding='utf-8') as f:
    f.write(content)
