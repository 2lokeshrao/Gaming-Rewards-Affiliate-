import re

with open('src/types.ts', 'r') as f:
    text = f.read()

text = text.replace("masterPartnerUrl?: string; // Sub-partner registration link for master panel", "masterPartnerUrl?: string; // Sub-partner registration link for master panel\n  reviewContent?: string; // Custom HTML/Markdown for the brand review page")

with open('src/types.ts', 'w') as f:
    f.write(text)
