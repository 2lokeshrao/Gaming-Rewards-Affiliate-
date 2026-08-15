import re

with open('src/components/ExitIntentModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("import confetti from 'canvas-confetti';\n", "")

pattern = r'const triggerModal = \(\) => \{'
replacement = r'const triggerModal = async () => {'
content = re.sub(pattern, replacement, content)

pattern2 = r'(confetti\(\{[\s\S]*?\}\);)'
replacement2 = r'const confetti = (await import("canvas-confetti")).default;\n          \1'
content = re.sub(pattern2, replacement2, content)

with open('src/components/ExitIntentModal.tsx', 'w') as f:
    f.write(content)
