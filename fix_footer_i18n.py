import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    "import { useTranslation } from 'react-i18next';",
    "import { useLanguage } from '../i18n/LanguageContext';"
)
text = text.replace(
    "const { t } = useTranslation();",
    "const { t } = useLanguage();"
)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)
