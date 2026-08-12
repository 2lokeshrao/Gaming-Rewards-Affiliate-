import re

with open('src/data.ts', 'r') as f:
    content = f.read()

new_platforms = """  ,
  {
    id: "rajabets",
    slug: "rajabets",
    name: "Rajabets",
    logoUrl: "https://www.google.com/s2/favicons?domain=rajabets.com&sz=256",
    rating: 9.6,
    starRating: 5,
    badges: ["Instant UPI", "Indian Focus", "Hindi Support", "Cricket Specials"],
    bonusText: "150% Sports Welcome Bonus up to ₹100,000",
    promoCode: "RAJABOOST",
    rawAffiliateUrl: "https://rajabets.com/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 950,
    copiesCount: 420,
    category: "Indian Sportsbook"
  },
  {
    id: "dafabet",
    slug: "dafabet",
    name: "Dafabet India",
    logoUrl: "https://www.google.com/s2/favicons?domain=dafabet.com&sz=256",
    rating: 9.5,
    starRating: 5,
    badges: ["Most Trusted", "Local Bank Transfer", "Exchange Betting"],
    bonusText: "170% First Deposit Bonus up to ₹17,000",
    promoCode: "DAFA170",
    rawAffiliateUrl: "https://www.dafabet.com/in/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 880,
    copiesCount: 390,
    category: "Sportsbook & Exchange"
  },
  {
    id: "10cric",
    slug: "10cric",
    name: "10CRIC",
    logoUrl: "https://www.google.com/s2/favicons?domain=10cric.com&sz=256",
    rating: 9.7,
    starRating: 5,
    badges: ["Made for India", "Fast UPI Withdrawals", "Exclusive Cricket Odds"],
    bonusText: "150% Welcome Bonus up to ₹30,000",
    promoCode: "10CRICVIP",
    rawAffiliateUrl: "https://www.10cric.com/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 760,
    copiesCount: 340,
    category: "Indian Sportsbook"
  },
  {
    id: "22bet",
    slug: "22bet",
    name: "22Bet India",
    logoUrl: "https://www.google.com/s2/favicons?domain=22bet.in&sz=256",
    rating: 9.4,
    starRating: 4,
    badges: ["Huge Markets", "Hindi UI", "Paytm/UPI Accepted"],
    bonusText: "100% Bonus up to ₹10,000",
    promoCode: "22MAX",
    rawAffiliateUrl: "https://22bet.in/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 650,
    copiesCount: 220,
    category: "Sportsbook & Casino"
  },
  {
    id: "melbet",
    slug: "melbet",
    name: "Melbet",
    logoUrl: "https://www.google.com/s2/favicons?domain=melbet.com&sz=256",
    rating: 9.3,
    starRating: 4,
    badges: ["Fast Registration", "UPI/IMPS", "High Casino RTP"],
    bonusText: "100% Sports Bonus up to ₹20,000",
    promoCode: "MELBETINDIA",
    rawAffiliateUrl: "https://melbet.com/en/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 810,
    copiesCount: 400,
    category: "Sportsbook"
  },
  {
    id: "megapari",
    slug: "megapari",
    name: "Megapari",
    logoUrl: "https://www.google.com/s2/favicons?domain=megapari.com&sz=256",
    rating: 9.2,
    starRating: 4,
    badges: ["Low Minimum Deposit", "Crypto & INR", "Live Cricket"],
    bonusText: "100% Bonus up to ₹26,000",
    promoCode: "MEGA26K",
    rawAffiliateUrl: "https://megapari.com/?ref=YOUR_ID",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 520,
    copiesCount: 190,
    category: "Sportsbook"
  }"""

# Using regex to find the end of the initialPlatforms array
pattern = re.compile(r'(category:\s*"Sportsbook"\s*\n\s*\})\s*\n\];')
content = pattern.sub(r'\1' + new_platforms + '\n];', content)

with open('src/data.ts', 'w') as f:
    f.write(content)
