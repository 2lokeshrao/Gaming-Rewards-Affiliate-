import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# The user is seeing the old "Custom CMS Pages" form because I didn't remove it when I added the CustomPageManagerTab.
# Let's find the old block and remove it.

old_block = r'\{activeTab === \'pages\' && \(\s*<div className="space-y-6">\s*<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">.*?</div>\s*\)\}'
text = re.sub(old_block, "", text, flags=re.DOTALL)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
