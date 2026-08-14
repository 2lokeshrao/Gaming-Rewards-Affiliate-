import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# We need to find the <footer className="bg-slate-900 border-t border-slate-800/80 py-10 px-4 text-center text-slate-400 text-xs">
# and remove everything up to </footer>
pattern = r'<footer className="bg-slate-900 border-t border-slate-800/80 py-10 px-4 text-center text-slate-400 text-xs">.*?</footer>'
new_footer_call = """<Footer
        platforms={platforms}
        customPages={customPages}
        geo={geo}
        config={config}
        setShowSubPartnerModal={setShowSubPartnerModal}
        setShowReferModal={setShowReferModal}
        setShowAdminLogin={setShowAdminLogin}
        adminToken={adminToken}
        setViewingAdmin={setViewingAdmin}
      />"""

text = re.sub(pattern, new_footer_call, text, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(text)
