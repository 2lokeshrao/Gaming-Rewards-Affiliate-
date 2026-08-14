import re

with open('src/components/CustomCouponsSection.tsx', 'r') as f:
    content = f.read()

content = content.replace("{coupon.title}", "{formatLocalizedBonus(coupon.title, language)}")
content = content.replace("{coupon.description}", "{formatLocalizedBonus(coupon.description, language)}")

with open('src/components/CustomCouponsSection.tsx', 'w') as f:
    f.write(content)
