import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# I will replace any \' with just ' in the text
text = text.replace(r"\'", "'")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
