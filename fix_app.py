import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace AdminPanel rendering with Suspense
old_code = """  if (viewingAdmin && adminToken && stats) {
    return (
      <AdminPanel"""

new_code = """  if (viewingAdmin && adminToken && stats) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4"><div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div><p className="text-purple-400 font-bold animate-pulse">Loading Admin Control Center...</p></div>}>
        <AdminPanel"""

content = content.replace(old_code, new_code)
content = content.replace('      />\n    );\n  }', '      />\n      </Suspense>\n    );\n  }')

with open('src/App.tsx', 'w') as f:
    f.write(content)
