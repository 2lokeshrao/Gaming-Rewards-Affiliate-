import re

with open('src/data.ts', 'r') as f:
    content = f.read()

new_platforms = """  ,
  {
    id: "ggbet",
    slug: "ggbet",
    name: "GG.BET",
    logoUrl: "https://www.google.com/s2/favicons?domain=gg.bet&sz=256",
    rating: 9.6,
    starRating: 5,
    badges: ["Esports Focus", "Live Streams", "Fast Crypto Payouts", "High Odds"],
    bonusText: "200% Deposit Bonus + Free Bet",
    promoCode: "GGBONUS200",
    rawAffiliateUrl: "https://gg.bet/en/betting?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 840,
    copiesCount: 310,
    category: "Esports Betting"
  },
  {
    id: "betway",
    slug: "betway",
    name: "Betway Esports",
    logoUrl: "https://www.google.com/s2/favicons?domain=betway.com&sz=256",
    rating: 9.5,
    starRating: 5,
    badges: ["Global Brand", "CS:GO Sponsor", "Safe & Legal", "Daily Boosts"],
    bonusText: "100% Match up to ₹2500 / $30",
    promoCode: "BETWAYVIP",
    rawAffiliateUrl: "https://betway.com/en/sports/cat/esports?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 750,
    copiesCount: 200,
    category: "Esports Betting"
  },
  {
    id: "rivalry",
    slug: "rivalry",
    name: "Rivalry",
    logoUrl: "https://www.google.com/s2/favicons?domain=rivalry.com&sz=256",
    rating: 9.4,
    starRating: 5,
    badges: ["Made for Gamers", "Instant Withdrawals", "Unique Markets", "Meme Friendly"],
    bonusText: "100% Welcome Bonus up to $100",
    promoCode: "RIVALRY100",
    rawAffiliateUrl: "https://www.rivalry.com/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 420,
    copiesCount: 150,
    category: "Esports Betting"
  },
  {
    id: "thunderpick",
    slug: "thunderpick",
    name: "Thunderpick",
    logoUrl: "https://www.google.com/s2/favicons?domain=thunderpick.io&sz=256",
    rating: 9.2,
    starRating: 4,
    badges: ["Crypto Exclusive", "VIP Rewards", "Esports Live Betting"],
    bonusText: "100% First Deposit Bonus up to €500",
    promoCode: "THUNDER500",
    rawAffiliateUrl: "https://thunderpick.io/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 310,
    copiesCount: 90,
    category: "Crypto Esports"
  },
  {
    id: "pinnacle",
    slug: "pinnacle",
    name: "Pinnacle Esports",
    logoUrl: "https://www.google.com/s2/favicons?domain=pinnacle.com&sz=256",
    rating: 9.7,
    starRating: 5,
    badges: ["Highest Odds", "No Limit Betting", "Sharp Bettors Welcome"],
    bonusText: "Best Esports Odds Guaranteed",
    promoCode: "PINNACLEVIP",
    rawAffiliateUrl: "https://www.pinnacle.com/en/esports/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 680,
    copiesCount: 110,
    category: "Esports Betting"
  },
  {
    id: "1xbet",
    slug: "1xbet",
    name: "1xBet",
    logoUrl: "https://www.google.com/s2/favicons?domain=1xbet.com&sz=256",
    rating: 9.3,
    starRating: 4,
    badges: ["Massive Markets", "High Odds", "Fast Local Payments", "Navi Sponsor"],
    bonusText: "130% First Deposit Bonus up to ₹33000",
    promoCode: "1XBETMAX",
    rawAffiliateUrl: "https://1xbet.com/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 920,
    copiesCount: 450,
    category: "Sportsbook"
  }"""

# Find the end of initialPlatforms array
# It ends with 'category: "Sportsbook"\n  }\n];'

content = content.replace('category: "Sportsbook"\n  }\n];', f'category: "Sportsbook"\n  }}{new_platforms}\n];')

with open('src/data.ts', 'w') as f:
    f.write(content)
