import re

with open('src/components/TopThreeCarousel.tsx', 'r') as f:
    content = f.read()

content = content.replace("import confetti from 'canvas-confetti';\n", "")

pattern1 = r'const handleCopy = \((.*?)\) => \{'
replacement1 = r'const handleCopy = async (\1) => {'
content = re.sub(pattern1, replacement1, content)

pattern2 = r'(confetti\(\{[\s\S]*?\}\);)'
replacement2 = r'const confetti = (await import("canvas-confetti")).default;\n    \1'
content = re.sub(pattern2, replacement2, content)

with open('src/components/TopThreeCarousel.tsx', 'w') as f:
    f.write(content)
