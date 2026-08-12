import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# We will just write a function to append meta fields if they don't exist
def append_seo(match):
    name = match.group(1)
    promo = match.group(2)
    metaTitle = f"{name} Promo Code {promo} | Best Bonus 2026"
    metaDesc = f"Use verified promo code {promo} for {name} to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards."
    metaKeywords = f"{name.lower()} promo code, {name.lower()} bonus, {promo}, best {name.lower()} promo"
    
    return f'name: "{name}",\n    logoUrl: {match.group(3)},\n    rating: {match.group(4)},\n    starRating: {match.group(5)},\n    badges: {match.group(6)},\n    bonusText: {match.group(7)},\n    promoCode: "{promo}",\n    rawAffiliateUrl: {match.group(8)},\n    masterPartnerUrl: {match.group(9)},\n    isFeatured: {match.group(10)},\n    featuredRank: {match.group(11)},\n    isActive: {match.group(12)},\n    clicksCount: {match.group(13)},\n    copiesCount: {match.group(14)},\n    category: {match.group(15)},\n    reviewContent: {match.group(16)},\n    metaTitle: "{metaTitle}",\n    metaDescription: "{metaDesc}",\n    metaKeywords: "{metaKeywords}"'

# Wait, let's just use Python's eval or parsing it easily. Actually simpler:
platforms_to_fix = ['1Win Casino & Sports', 'Mostbet Official', 'Pin-Up Casino', 'Stake Crypto Casino', 'BC.Game VIP']

for plat in platforms_to_fix:
    # find the promo code
    p_promo = re.search(f'name:\s*"{plat}".*?promoCode:\s*"([^"]+)"', content, flags=re.DOTALL)
    if p_promo:
        promo = p_promo.group(1)
        metaTitle = f"{plat} Promo Code {promo} | Best Bonus 2026"
        metaDesc = f"Use verified promo code {promo} for {plat} to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards."
        metaKeywords = f"{plat.lower()} promo code, {plat.lower()} bonus, {promo}, best {plat.lower()} promo"
        
        # Insert them before the first occurrence of reviewContent for this platform
        p_review = re.search(f'name:\s*"{plat}".*?(reviewContent:\s*`.*?`)', content, flags=re.DOTALL)
        if p_review:
            replacement = f'metaTitle: "{metaTitle}",\n    metaDescription: "{metaDesc}",\n    metaKeywords: "{metaKeywords}",\n    {p_review.group(1)}'
            content = content.replace(p_review.group(1), replacement)

with open('src/data.ts', 'w') as f:
    f.write(content)
