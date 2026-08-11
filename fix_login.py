with open('src/components/AdminLoginModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('placeholder="Enter Admin Passcode (Default: admin123)"', 'placeholder="Enter Admin Passcode"')
content = content.replace('placeholder="Enter Admin Passcode (Default: @dmin123)"', 'placeholder="Enter Admin Passcode"')
content = content.replace("""            <span className="text-[11px] text-slate-500 block text-left mt-1">
              Default demo password: <code className="text-amber-400 font-mono">admin123</code>
            </span>""", "")
content = content.replace("""            <span className="text-[11px] text-slate-500 block text-left mt-1">
              Default demo password: <code className="text-amber-400 font-mono">@dmin123</code>
            </span>""", "")

with open('src/components/AdminLoginModal.tsx', 'w') as f:
    f.write(content)
