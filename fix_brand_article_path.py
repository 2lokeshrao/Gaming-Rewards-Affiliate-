import re

with open('src/components/BrandArticlePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("`https://bonuspromocode.in/review/${slug}`", "`https://bonuspromocode.in/brands/${slug}`")

with open('src/components/BrandArticlePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
