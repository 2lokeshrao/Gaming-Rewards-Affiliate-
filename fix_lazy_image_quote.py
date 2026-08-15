import re

with open('src/components/LazyImage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('loading={priority ? \\"eager\\" : \\"lazy\\"}', 'loading={priority ? "eager" : "lazy"}')

with open('src/components/LazyImage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
