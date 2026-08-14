import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Fix the broken string interpolation syntax `} to }`}
bad = r"                \}`\n              >"
good = r"                }`}\n              >"
text = re.sub(bad, good, text)

# Just fix all of them indiscriminately
text = text.replace("              `\n            >", "              }`}\n            >")
text = text.replace("                `\n              >", "                }`}\n              >")


with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
