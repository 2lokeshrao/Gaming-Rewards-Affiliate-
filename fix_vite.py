import re

with open('vite.config.ts', 'r') as f:
    content = f.read()

content = content.replace("'vendor-react': ['react', 'react-dom', 'react-router-dom'],", "'vendor-react': ['react', 'react-dom'],")
content = content.replace("'vendor-ui': ['lucide-react', 'recharts', 'framer-motion']", "'vendor-ui': ['lucide-react', 'recharts']")

with open('vite.config.ts', 'w') as f:
    f.write(content)
