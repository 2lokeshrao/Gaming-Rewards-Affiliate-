import re

with open('src/components/TopThreeCarousel.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { formatLocalizedBonus } from '../utils/currency';\n"
if "formatLocalizedBonus" not in content:
    content = content.replace("import { useLanguage } from '../i18n/LanguageContext';", "import { useLanguage } from '../i18n/LanguageContext';\n" + import_stmt)

# Replace {p.bonusText} with {formatLocalizedBonus(p.bonusText, language)}
content = content.replace("{p.bonusText}", "{formatLocalizedBonus(p.bonusText, language)}")

with open('src/components/TopThreeCarousel.tsx', 'w') as f:
    f.write(content)

with open('src/components/OfferGrid.tsx', 'r') as f:
    content = f.read()

if "formatLocalizedBonus" not in content:
    content = content.replace("import { useLanguage } from '../i18n/LanguageContext';", "import { useLanguage } from '../i18n/LanguageContext';\n" + import_stmt)

content = content.replace("{p.bonusText}", "{formatLocalizedBonus(p.bonusText, language)}")

with open('src/components/OfferGrid.tsx', 'w') as f:
    f.write(content)
