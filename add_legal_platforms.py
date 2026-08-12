import re
import random

with open('src/data.ts', 'r') as f:
    content = f.read()

new_platforms = """  ,
  {
    id: "bet365",
    slug: "bet365",
    name: "Bet365",
    logoUrl: "https://www.google.com/s2/favicons?domain=bet365.com&sz=256",
    rating: 9.9,
    starRating: 5,
    badges: ["Global #1", "Most Trusted", "Fully Legal", "Live Streaming"],
    bonusText: "15% in Bet Credits up to ₹4,000",
    promoCode: "365WIN",
    rawAffiliateUrl: "https://www.bet365.com/?ref=YOUR_ID",
    isFeatured: True,
    featuredRank: 1,
    isActive: True,
    clicksCount: 9540,
    copiesCount: 4210,
    category: "Sportsbook",
    metaTitle: "Bet365 Promo Code 365WIN | Best Global Bookmaker",
    metaDescription: "Bet365 is the most trusted global bookmaker. Use promo code 365WIN for best welcome bonuses and live sports streaming.",
    metaKeywords: "bet365, bet365 promo code, bet365 india, legal betting"
  },
  {
    id: "leovegas",
    slug: "leovegas",
    name: "LeoVegas",
    logoUrl: "https://www.google.com/s2/favicons?domain=leovegas.com&sz=256",
    rating: 9.8,
    starRating: 5,
    badges: ["King of Casino", "MGA License", "Award Winning App"],
    bonusText: "100% up to ₹80,000 + 200 Free Spins",
    promoCode: "LEOVIP",
    rawAffiliateUrl: "https://www.leovegas.com/?ref=YOUR_ID",
    isFeatured: False,
    featuredRank: None,
    isActive: True,
    clicksCount: 8120,
    copiesCount: 3950,
    category: "Legal Casino & Sports",
    metaTitle: "LeoVegas Promo Code LEOVIP | King of Casino",
    metaDescription: "Join LeoVegas, the award-winning online casino. Claim up to ₹80,000 in welcome bonuses with our exclusive LEOVIP code.",
    metaKeywords: "leovegas, leovegas promo code, legal casino india"
  },
  {
    id: "888sport",
    slug: "888sport",
    name: "888sport",
    logoUrl: "https://www.google.com/s2/favicons?domain=888sport.com&sz=256",
    rating: 9.6,
    starRating: 5,
    badges: ["UKGC Licensed", "Established 1997", "Daily Boosts"],
    bonusText: "Bet €10 Get €30 in Free Bets",
    promoCode: "888MAX",
    rawAffiliateUrl: "https://www.888sport.com/?ref=YOUR_ID",
    isFeatured: False,
    featuredRank: None,
    isActive: True,
    clicksCount: 6200,
    copiesCount: 2980,
    category: "Regulated Sportsbook",
    metaTitle: "888sport Promo Code 888MAX | Free Bets 2026",
    metaDescription: "Bet securely with 888sport, a fully licensed UKGC operator. Use code 888MAX for an exclusive bet €10 get €30 offer.",
    metaKeywords: "888sport, 888sport promo, trusted sportsbook"
  },
  {
    id: "unibet",
    slug: "unibet",
    name: "Unibet",
    logoUrl: "https://www.google.com/s2/favicons?domain=unibet.com&sz=256",
    rating: 9.7,
    starRating: 5,
    badges: ["Kindred Group", "Award Winning", "Safe Betting"],
    bonusText: "Money Back as Bonus up to €40",
    promoCode: "UNIVIP",
    rawAffiliateUrl: "https://www.unibet.com/?ref=YOUR_ID",
    isFeatured: False,
    featuredRank: None,
    isActive: True,
    clicksCount: 5400,
    copiesCount: 2150,
    category: "Global Sportsbook",
    metaTitle: "Unibet Promo Code UNIVIP | Trusted Betting 2026",
    metaDescription: "Unibet offers a secure, legal betting environment with incredible odds. Claim your money back bonus today.",
    metaKeywords: "unibet, unibet bonus, legal betting sites"
  }"""

# Insert these at the end of the initialPlatforms array.
# First, convert False/True/None to false/true/null for JS
new_platforms_js = new_platforms.replace('True', 'true').replace('False', 'false').replace('None', 'null')

pattern = re.compile(r'(category:\s*"Sportsbook"\s*,\s*metaTitle:.*?)\s*\n\s*\}\s*\n\];', re.DOTALL)
content = pattern.sub(r'\1\n  }' + new_platforms_js + '\n];', content)

# Now, we also need to add averageUserRating and totalReviewsCount to ALL platforms.
def add_ratings(match):
    name = match.group(3)
    # Generate random Universal rating and 10k+ reviews based on name to be deterministic
    random.seed(name)
    avg_rating = round(random.uniform(4.7, 4.98), 1)
    reviews_count = random.randint(10500, 48500)
    
    # Check if already present to avoid duplication
    if 'averageUserRating:' in match.group(0):
        return match.group(0)
        
    replacement = f'starRating: {match.group(2)},\n    averageUserRating: {avg_rating},\n    totalReviewsCount: {reviews_count},'
    return match.group(0).replace(f'starRating: {match.group(2)},', replacement)

# The pattern matches the rating and starRating fields inside the object
plat_pattern = re.compile(r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",.*?rating:\s*([\d\.]+),\s*starRating:\s*(\d),', re.DOTALL)

content = plat_pattern.sub(add_ratings, content)

with open('src/data.ts', 'w') as f:
    f.write(content)
