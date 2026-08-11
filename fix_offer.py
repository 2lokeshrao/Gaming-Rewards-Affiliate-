with open('src/components/OfferGrid.tsx', 'r') as f:
    content = f.read()

content = content.replace('alt={p.name}\n                className="w-12 h-12 object-contain"', 'alt={p.name}\n                loading="lazy"\n                width="48"\n                height="48"\n                className="w-12 h-12 object-contain"')

with open('src/components/OfferGrid.tsx', 'w') as f:
    f.write(content)
