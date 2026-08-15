import re

with open('src/components/LuckyWheelModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("import confetti from 'canvas-confetti';\n", "")

pattern = r'setTimeout\(\(\) => \{([\s\S]*?)confetti\(\{([\s\S]*?)\}\);\n    \}, 4500\);'
replacement = r'''setTimeout(async () => {
\1const confetti = (await import("canvas-confetti")).default;
      confetti({
\2});
    }, 4500);'''
content = re.sub(pattern, replacement, content)

with open('src/components/LuckyWheelModal.tsx', 'w') as f:
    f.write(content)
