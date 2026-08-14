import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Fix 1: The bad '}' and '>' inside the classname
bad1 = r"              \}`\}\n            >"
good1 = "              `}\n            >"
text = re.sub(bad1, good1, text)

# Fix 2: 1468
bad2 = r"            \{activeTab === 'subpartners' && \("
good2 = r"          {activeTab === 'subpartners' && ("
text = re.sub(bad2, good2, text)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
