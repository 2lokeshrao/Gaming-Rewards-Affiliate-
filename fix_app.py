import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace <Navbar platforms={platforms} customPages={customPages} geo={geo} />
text = text.replace("<Navbar platforms={platforms} customPages={customPages} geo={geo} />", "<Navbar platforms={platforms} customPages={customPages} geo={geo} onOpenAppModal={() => setShowPwaModal(true)} />")

# Remove the redundant header block from App.tsx main return
header_to_remove = r'<div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">.*?<ShieldCheck className="w-6 h-6 text-amber-400" />.*?<span className="font-black tracking-tight text-white text-lg">\{t\(\'nav.brand\'\)\}</span>.*?</div>.*?<div className="flex items-center gap-3">.*?<div className="relative group flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">.*?<Globe className="w-4 h-4 text-slate-400 mr-1" />.*?<select.*?</select>.*?</div>.*?<button.*?<Sparkles className="w-4 h-4" />.*?<span className="hidden sm:inline">\{t\(\'nav.getApp\'\)\}</span>.*?<span className="sm:hidden">App</span>.*?</button>.*?</div>.*?</div>'

text = re.sub(header_to_remove, "", text, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(text)
