import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# Update all masterPartnerUrl to "https://1win-partner.com/?p=mpsw"
content = re.sub(r'masterPartnerUrl:\s*"[^"]*"', 'masterPartnerUrl: "https://1win-partner.com/?p=mpsw"', content)
# Add masterPartnerUrl if it doesn't exist (some newly added platforms might not have it)
# Actually, let's just make sure it's there. If not, add it.
def ensure_master_partner_url(match):
    block = match.group(0)
    if 'masterPartnerUrl:' not in block:
        # insert after rawAffiliateUrl
        block = re.sub(r'(rawAffiliateUrl:\s*"[^"]*",)', r'\1\n    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",', block)
    return block

content = re.sub(r'\{\s*id:\s*"[^"]+".*?category:\s*"[^"]*".*?\}', ensure_master_partner_url, content, flags=re.DOTALL)

# Let's verify and just manually regex replace the specific parts for the 3 platforms

# 1win
# promoCode -> 500TOPUP
content = re.sub(r'(id:\s*"1win",.*?promoCode:\s*")[^"]*(")', r'\g<1>500TOPUP\2', content, flags=re.DOTALL)
# rawAffiliateUrl
content = re.sub(r'(id:\s*"1win",.*?rawAffiliateUrl:\s*")[^"]*(")', r'\g<1>https://one-vv8838.com/casino/list?open=register&p=lkq7\2', content, flags=re.DOTALL)
# Meta titles and descriptions contain old promo codes too. Let's update them for 1win.
content = re.sub(r'(id:\s*"1win".*?metaTitle:\s*"[^"]*?)MAXBOOST500([^"]*")', r'\g<1>500TOPUP\2', content, flags=re.DOTALL)
content = re.sub(r'(id:\s*"1win".*?metaDescription:\s*"[^"]*?)MAXBOOST500([^"]*")', r'\g<1>500TOPUP\2', content, flags=re.DOTALL)

# 1xbet
content = re.sub(r'(id:\s*"1xbet",.*?promoCode:\s*")[^"]*(")', r'\g<1>1x_5482230\2', content, flags=re.DOTALL)
content = re.sub(r'(id:\s*"1xbet",.*?rawAffiliateUrl:\s*")[^"]*(")', r'\g<1>https://reffpa.com/L?tag=d_5793442m_1236c_&site=5793442&ad=1236\2', content, flags=re.DOTALL)
# Meta
content = re.sub(r'(id:\s*"1xbet".*?metaTitle:\s*"[^"]*?)1XBETMAX([^"]*")', r'\g<1>1x_5482230\2', content, flags=re.DOTALL)
content = re.sub(r'(id:\s*"1xbet".*?metaDescription:\s*"[^"]*?)1XBETMAX([^"]*")', r'\g<1>1x_5482230\2', content, flags=re.DOTALL)

# bcgame
content = re.sub(r'(id:\s*"bcgame",.*?promoCode:\s*")[^"]*(")', r'\g<1>982zzt4b7s\2', content, flags=re.DOTALL)
content = re.sub(r'(id:\s*"bcgame",.*?rawAffiliateUrl:\s*")[^"]*(")', r'\g<1>https://bc.game/i-982zzt4b7s-n/\2', content, flags=re.DOTALL)
# Meta
content = re.sub(r'(id:\s*"bcgame".*?metaTitle:\s*"[^"]*?)BCVIPMAX([^"]*")', r'\g<1>982zzt4b7s\2', content, flags=re.DOTALL)
content = re.sub(r'(id:\s*"bcgame".*?metaDescription:\s*"[^"]*?)BCVIPMAX([^"]*")', r'\g<1>982zzt4b7s\2', content, flags=re.DOTALL)


with open('src/data.ts', 'w') as f:
    f.write(content)

print("Updates completed")
