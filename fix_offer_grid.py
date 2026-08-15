import re

with open('src/components/OfferGrid.tsx', 'r') as f:
    content = f.read()

content = content.replace("import confetti from 'canvas-confetti';\n", "")

# We need to make handleCopyCode async in OfferGrid.tsx
# The original function signature:
# const handleCopyCode = (p: GamingPlatform, e: React.MouseEvent) => {
pattern1 = r'const handleCopyCode = \((.*?)\) => \{'
replacement1 = r'const handleCopyCode = async (\1) => {'

content = re.sub(pattern1, replacement1, content)

# Replace confetti call
pattern2 = r'(confetti\(\{[\s\S]*?\}\);)'
replacement2 = r'const confetti = (await import("canvas-confetti")).default;\n    \1'

content = re.sub(pattern2, replacement2, content)

with open('src/components/OfferGrid.tsx', 'w') as f:
    f.write(content)
