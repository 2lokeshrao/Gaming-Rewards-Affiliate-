import re
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

bad = """            <button
              onClick={() => { setActiveTab('subpartners'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between cursor-pointer ${                            <button 
              onClick={() => setActiveTab('pages')}"""

good = """                          <button 
              onClick={() => { setActiveTab('pages'); setIsMobileMenuOpen(false); }}"""

content = content.replace(bad, good)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
