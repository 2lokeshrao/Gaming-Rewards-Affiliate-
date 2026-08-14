import re

with open('src/data.ts', 'r') as f:
    text = f.read()

articles_seed = """  articles: [
    {
      id: "art_crypto_wallet",
      slug: "best-crypto-wallets-gaming",
      title: "Best Crypto Wallets for Online Gaming in 2024",
      content: "## The Rise of Crypto in Gaming\\n\\nUsing cryptocurrencies for online gaming has become the gold standard. Not only do you get instant deposits and withdrawals, but you also avoid heavy banking fees.\\n\\n### 1. Binance\\nBinance is the world's largest exchange and offers the lowest fees. It's perfect for buying USDT or TRX to use on gaming platforms.\\n\\n### 2. Bybit\\nBybit offers incredible P2P rates and a very user-friendly interface. It's a great alternative if you want quick transactions without hassle.\\n\\n### 3. Trust Wallet\\nFor those who prefer a decentralized approach, Trust Wallet gives you full control of your private keys.\\n\\nChoose the wallet that fits your style and enjoy seamless gaming!",
      category: "Crypto Wallet",
      metaTitle: "Top Crypto Wallets for Gaming & Fast Withdrawals",
      metaDescription: "Learn about the best crypto wallets like Binance and Bybit to use for seamless and instant online gaming deposits.",
      publishedAt: new Date().toISOString(),
      author: "Admin",
      tags: ["Crypto", "Wallet", "USDT"],
      views: 1205
    },
    {
      id: "art_card_apply",
      slug: "virtual-credit-cards-gaming",
      title: "How to Apply for Virtual Cards for Gaming",
      content: "## Why Use a Virtual Card?\\n\\nVirtual cards offer an extra layer of security. If you are depositing on an online platform, a virtual card ensures your main bank account remains untouched.\\n\\n### Top Providers\\n- **Revolut:** Offers single-use virtual cards that destroy themselves after one transaction.\\n- **AstroPay:** A highly popular gaming wallet with built-in virtual cards.\\n- **Skrill:** Comes with a virtual Mastercard specifically designed for gaming and betting.\\n\\nAlways ensure you use trusted payment providers when managing your bankroll.",
      category: "Cards & Payments",
      metaTitle: "Best Virtual Credit Cards for Online Gaming",
      metaDescription: "Discover how to apply for and use virtual credit cards to securely deposit funds into your favorite gaming platforms.",
      publishedAt: new Date().toISOString(),
      author: "Admin",
      tags: ["Virtual Cards", "Payments", "Security"],
      views: 840
    },
    {
      id: "art_loan_apply",
      slug: "instant-gaming-bankroll-loans",
      title: "Getting an Instant Loan for Your Bankroll",
      content: "## Managing Your Bankroll\\n\\nSometimes you need a quick boost to your bankroll to take advantage of a massive deposit bonus. Instant loans can help, but they must be managed responsibly.\\n\\n### What to Look For\\n- **Low Interest:** Always check the APR.\\n- **Fast Approval:** Platforms that use AI to approve your loan within minutes.\\n- **Flexible Repayment:** Ensure you can pay back the loan on your own terms.\\n\\n*Disclaimer: Please gamble responsibly. Never borrow more than you can afford to lose.*",
      category: "Loans",
      metaTitle: "Instant Loans for Bankrolls - Play Responsibly",
      metaDescription: "A guide to responsibly acquiring instant loans to boost your gaming bankroll for high-value deposit matches.",
      publishedAt: new Date().toISOString(),
      author: "Admin",
      tags: ["Loans", "Bankroll", "Finance"],
      views: 432
    }
  ],
"""

if "articles: [" not in text:
    text = text.replace("export const initialGlobalConfig: GlobalConfig = {", "export const initialGlobalConfig: GlobalConfig = {\n" + articles_seed)

with open('src/data.ts', 'w') as f:
    f.write(text)
