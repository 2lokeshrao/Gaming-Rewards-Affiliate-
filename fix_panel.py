with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace('<span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Status: Authenticated (Passcode: admin123)</span>', '<span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Status: Authenticated</span>')
content = content.replace('<span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Status: Authenticated (Passcode: @dmin123)</span>', '<span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Status: Authenticated</span>')

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
