import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# Just replace the metaTitle and metaDescription for bcgame specifically
bc_target = r'(id:\s*"bcgame".*?metaTitle:\s*")[^"]*(")'
content = re.sub(bc_target, r'\g<1>BC.Game VIP Promo Code 982zzt4b7s | Best Bonus 2026\2', content, flags=re.DOTALL)

bc_desc_target = r'(id:\s*"bcgame".*?metaDescription:\s*")[^"]*(")'
content = re.sub(bc_desc_target, r'\g<1>Use verified promo code 982zzt4b7s for BC.Game VIP to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.\2', content, flags=re.DOTALL)

bc_keywords_target = r'(id:\s*"bcgame".*?metaKeywords:\s*")[^"]*(")'
content = re.sub(bc_keywords_target, r'\g<1>bc.game vip promo code, bc.game vip bonus, 982zzt4b7s, best bc.game vip promo\2', content, flags=re.DOTALL)

with open('src/data.ts', 'w') as f:
    f.write(content)
