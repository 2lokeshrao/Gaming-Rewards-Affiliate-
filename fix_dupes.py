with open('src/components/ClaimWithQrModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("onError={(e) => {\n                  (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100?random=1';\n                }}", "")
with open('src/components/ClaimWithQrModal.tsx', 'w') as f:
    f.write(content)

with open('src/components/PlatformFeedbackModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("onError={(e) => {\n                (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100?random=1';\n              }}", "")
with open('src/components/PlatformFeedbackModal.tsx', 'w') as f:
    f.write(content)

with open('src/components/AdminDashboardTab.tsx', 'r') as f:
    content = f.read()
content = content.replace('width="32"\n                            height="32"\n                            \n                            decoding="async"', '')
with open('src/components/AdminDashboardTab.tsx', 'w') as f:
    f.write(content)
