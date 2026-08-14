import re

with open('src/i18n/translations.ts', 'r') as f:
    content = f.read()

pt_add = """
    "guide.title.IN": "Métodos de Pagamento na Índia",
    "guide.title.BR": "Métodos de Pagamento Populares no Brasil",
    "guide.title.CA": "Métodos de Pagamento no Canadá",
    "guide.title.Global": "Métodos de Pagamento Globais Seguros",
"""

en_add = """
    "guide.title.IN": "Popular Payment Methods in India",
    "guide.title.BR": "Popular Payment Methods in Brazil",
    "guide.title.CA": "Popular Payment Methods in Canada",
    "guide.title.Global": "Global Secure Payment Methods",
"""

if "guide.title.IN" not in content:
    content = content.replace('"en": {', '"en": {\n' + en_add)
    content = content.replace('"pt": {', '"pt": {\n' + pt_add)

with open('src/i18n/translations.ts', 'w') as f:
    f.write(content)
