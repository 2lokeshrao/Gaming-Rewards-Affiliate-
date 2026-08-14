import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

replacement = """
            <span dangerouslySetInnerHTML={{ __html: config.copyrightText || `BonusPromoCode.in Affiliate Portal &copy; ${new Date().getFullYear()}` }} />
"""

text = re.sub(r'\s*<span>BonusPromoCode\.in Affiliate Portal &copy; \{new Date\(\)\.getFullYear\(\)\}</span>\s*', replacement, text)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)
