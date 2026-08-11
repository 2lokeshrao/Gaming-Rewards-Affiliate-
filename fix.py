import re

with open('src/components/SeoContentSection.tsx', 'r') as f:
    content = f.read()

# Remove the first occurrence
content = content.replace('  const breadcrumbSchemaData = {\n    "@context": "https://schema.org",\n    "@type": "BreadcrumbList",\n    "itemListElement": [\n      {\n        "@type": "ListItem",\n        "position": 1,\n        "name": "Home",\n        "item": "https://bonuspromocode.in/"\n      },\n      {\n        "@type": "ListItem",\n        "position": 2,\n        "name": "Promo Codes 2026",\n        "item": "https://bonuspromocode.in/#seo-content-section"\n      }\n    ]\n  };\n', '', 1)

with open('src/components/SeoContentSection.tsx', 'w') as f:
    f.write(content)
