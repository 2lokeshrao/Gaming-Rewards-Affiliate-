with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    "import { Target, Globe, MessageSquare, QrCode, Bell, Sliders } from 'lucide-react';",
    "import { Target, Globe, MessageSquare, QrCode, Bell, Sliders, FileText } from 'lucide-react';"
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
