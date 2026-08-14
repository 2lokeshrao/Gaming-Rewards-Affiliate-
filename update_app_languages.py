import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_dropdown = """
            <div className="relative group flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
              <Globe className="w-4 h-4 text-slate-400 mr-1" />
              <select 
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer appearance-none pr-4"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
              >
                <option value="en" className="bg-slate-900 text-slate-200">English (EN)</option>
                <option value="hi" className="bg-slate-900 text-slate-200">Hindi (HI)</option>
                <option value="pt" className="bg-slate-900 text-slate-200">Portuguese (PT)</option>
                <option value="es" className="bg-slate-900 text-slate-200">Spanish (ES)</option>
                <option value="ru" className="bg-slate-900 text-slate-200">Russian (RU)</option>
                <option value="zh-CN" className="bg-slate-900 text-slate-200">Chinese (ZH)</option>
                <option value="ja" className="bg-slate-900 text-slate-200">Japanese (JA)</option>
                <option value="ko" className="bg-slate-900 text-slate-200">Korean (KO)</option>
                <option value="tr" className="bg-slate-900 text-slate-200">Turkish (TR)</option>
                <option value="ar" className="bg-slate-900 text-slate-200">Arabic (AR)</option>
                <option value="fr" className="bg-slate-900 text-slate-200">French (FR)</option>
                <option value="de" className="bg-slate-900 text-slate-200">German (DE)</option>
                <option value="it" className="bg-slate-900 text-slate-200">Italian (IT)</option>
                <option value="vi" className="bg-slate-900 text-slate-200">Vietnamese (VI)</option>
                <option value="th" className="bg-slate-900 text-slate-200">Thai (TH)</option>
                <option value="id" className="bg-slate-900 text-slate-200">Indonesian (ID)</option>
                <option value="pl" className="bg-slate-900 text-slate-200">Polish (PL)</option>
              </select>
            </div>
"""

pattern = r'<div className="relative group flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">[\s\S]*?</select>\s*</div>'

content = re.sub(pattern, new_dropdown.strip(), content)

# Remove `as Language` if present
content = content.replace("setLanguage(e.target.value as Language)", "setLanguage(e.target.value)")

with open('src/App.tsx', 'w') as f:
    f.write(content)
