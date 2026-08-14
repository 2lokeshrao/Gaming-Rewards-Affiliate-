import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

text = text.replace("setActiveTab('seo_health')", "setActiveTab('seo')")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
