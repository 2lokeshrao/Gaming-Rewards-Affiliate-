import re

with open('src/components/Navbar.tsx', 'r') as f:
    text = f.read()

# Add useLanguage import
if "import { useLanguage }" not in text:
    text = text.replace("import { GamingPlatform", "import { useLanguage } from '../i18n/LanguageContext';\nimport { GamingPlatform")

# Add Sparkles import
if "Sparkles" not in text:
    text = text.replace("CreditCard }", "CreditCard, Sparkles, Globe as GlobeIcon }")

# Update props
if "onOpenAppModal?: () => void" not in text:
    text = text.replace("geo: UserGeo }>", "geo: UserGeo; onOpenAppModal?: () => void }>")
    text = text.replace(" geo }) => {", " geo, onOpenAppModal }) => {")

# Add useLanguage hook
if "const { language, setLanguage, t } = useLanguage();" not in text:
    text = text.replace("const [isOpen, setIsOpen] = useState(false);", "const [isOpen, setIsOpen] = useState(false);\n  const { language, setLanguage, t } = useLanguage();")

# Add the right side controls
right_controls = """
          <div className="flex items-center gap-3">
            <div className="relative group hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
              <GlobeIcon className="w-4 h-4 text-slate-400 mr-1" />
              <select 
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer appearance-none pr-4"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en" className="bg-slate-900">EN</option>
                <option value="hi" className="bg-slate-900">HI</option>
                <option value="pt" className="bg-slate-900">PT</option>
                <option value="es" className="bg-slate-900">ES</option>
                <option value="ru" className="bg-slate-900">RU</option>
              </select>
            </div>
            {onOpenAppModal && (
              <button 
                onClick={onOpenAppModal}
                className="bg-amber-400 text-slate-900 px-3 py-1.5 text-sm font-black rounded-xl hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" /> 
                <span className="hidden sm:inline">Get App</span>
                <span className="sm:hidden">App</span>
              </button>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-1">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white focus:outline-none p-1">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
"""

# Replace the old Mobile menu button with right_controls
text = re.sub(r'\{/\* Mobile menu button \*/\}.*?</button>\s*</div>', right_controls, text, flags=re.DOTALL)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(text)
