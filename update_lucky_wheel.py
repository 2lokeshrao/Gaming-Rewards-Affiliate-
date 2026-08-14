import re

with open('src/components/LuckyWheelModal.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { formatLocalizedBonus } from '../utils/currency';\n"
if "formatLocalizedBonus" not in content:
    content = content.replace("import { useLanguage } from '../i18n/LanguageContext';", "import { useLanguage } from '../i18n/LanguageContext';\n" + import_stmt)

content = content.replace("{seg.label}", "{formatLocalizedBonus(seg.label, language)}")
content = content.replace("{wonPrize.label}", "{formatLocalizedBonus(wonPrize.label, language)}")
# Add useLanguage hook
if "const { language } = useLanguage();" not in content:
    content = content.replace("const [spinning, setSpinning] = useState(false);", "const { language } = useLanguage();\n  const [spinning, setSpinning] = useState(false);")

with open('src/components/LuckyWheelModal.tsx', 'w') as f:
    f.write(content)
