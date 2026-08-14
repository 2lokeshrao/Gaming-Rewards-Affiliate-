import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

text = text.replace("              `}\n            >", "              }`}\n            >")
text = text.replace("                `}\n              >", "                }`}\n              >")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
