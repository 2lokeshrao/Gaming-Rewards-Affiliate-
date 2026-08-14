import re

with open('server.ts', 'r') as f:
    text = f.read()

text = text.replace(
    "const category = categories[Math.floor(Math.random() * categories.length)];",
    "const defaultCategories = ['Gaming', 'Crypto', 'Finance', 'Loans', 'Virtual Cards'];\n    const cats = categories && categories.length > 0 ? categories : defaultCategories;\n    const category = cats[Math.floor(Math.random() * cats.length)];"
)

text = text.replace(
    "const topic = topics && topics.length > 0 \n      ? topics[Math.floor(Math.random() * topics.length)]\n      : 'latest online gaming and banking trends';",
    "const defaultTopics = ['Best crypto wallets for gaming withdrawals', 'Top virtual cards for instant cashout', 'Best instant loan apps', 'Gaming platform reviews and promo codes'];\n    const tops = topics && topics.length > 0 ? topics : defaultTopics;\n    const topic = tops[Math.floor(Math.random() * tops.length)];"
)

with open('server.ts', 'w') as f:
    f.write(text)
