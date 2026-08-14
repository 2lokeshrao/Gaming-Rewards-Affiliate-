import re

with open('src/components/SeoManagerTab.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    "const selectedPlatform = localPlatforms.find(p => p.id === selectedPlatformId) || localPlatforms[0];",
    "const selectedPlatform = localPlatforms.find(p => p.id === selectedPlatformId) || localPlatforms[0];\n  if (!selectedPlatform) return <div className=\"p-8 text-slate-400\">No platforms available. Please add a platform first.</div>;"
)

with open('src/components/SeoManagerTab.tsx', 'w') as f:
    f.write(text)
