import re
with open('src/components/TopThreeCarousel.tsx', 'r') as f:
    content = f.read()

# Make sure we have fetchPriority="high"
if 'fetchPriority="high"' not in content:
    content = content.replace('alt={p.name}', 'alt={p.name} width="56" height="56" fetchPriority="high"')
    with open('src/components/TopThreeCarousel.tsx', 'w') as f:
        f.write(content)
