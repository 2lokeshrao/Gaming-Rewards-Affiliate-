with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    "  onUpdateSubPartnerStatus\n}) => {",
    "  onUpdateSubPartnerStatus,\n  customPages,\n  onSaveCustomPages\n}) => {"
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
