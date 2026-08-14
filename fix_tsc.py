import re

with open('src/types.ts', 'r') as f:
    text = f.read()

# Fix revSharePercent (make it optional if needed)
text = text.replace("revSharePercent: number; // e.g. 50%", "revSharePercent?: number; // e.g. 50%")

with open('src/types.ts', 'w') as f:
    f.write(text)

with open('src/components/CustomPageView.tsx', 'r') as f:
    text = f.read()
text = text.replace("payment: false", "")
with open('src/components/CustomPageView.tsx', 'w') as f:
    f.write(text)

with open('src/components/SeoManagerTab.tsx', 'r') as f:
    text = f.read()
text = text.replace("icon: p.icon,", "")
text = text.replace("bannerImage: p.bannerImage,", "")
with open('src/components/SeoManagerTab.tsx', 'w') as f:
    f.write(text)

