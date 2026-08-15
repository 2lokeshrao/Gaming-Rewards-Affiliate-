import re

with open('src/components/TopThreeCarousel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(<LazyImage\s+)(src=\{platform\.logoUrl\})"
replacement = r"\1priority={index === 0} \2"

content = re.sub(pattern, replacement, content)

with open('src/components/TopThreeCarousel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
