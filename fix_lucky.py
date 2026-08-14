import re

with open('src/components/LuckyWheelModal.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { useLanguage } from '../i18n/LanguageContext';\nimport { formatLocalizedBonus } from '../utils/currency';\n"
if "formatLocalizedBonus" not in content:
    content = content.replace("import confetti from 'canvas-confetti';", "import confetti from 'canvas-confetti';\n" + import_stmt)

with open('src/components/LuckyWheelModal.tsx', 'w') as f:
    f.write(content)
