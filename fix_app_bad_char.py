import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the bad \x01 character
content = content.replace('\x01', 'const [isNavigating, setIsNavigating] = useState(false);')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
