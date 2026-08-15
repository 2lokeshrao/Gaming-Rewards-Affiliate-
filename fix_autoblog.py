import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_topics = "const defaultTopics = ['Best crypto wallets for gaming withdrawals', 'Top virtual cards for instant cashout', 'Best instant loan apps', 'Gaming platform reviews and promo codes'];"
new_topics = "const defaultTopics = ['Best crypto wallets for gaming withdrawals', '1Win vs Mostbet: Which is better?', 'Best Casino Promo Codes 2026', 'No KYC Crypto Casinos', 'Instant Withdrawal Casinos in India', 'Stake vs BC.Game Comparison', 'Top 5 Casino Welcome Bonuses', 'How to claim 1Win 500% Bonus'];"

content = content.replace(old_topics, new_topics)

old_prompt = """const prompt = `You are an expert SEO copywriter. Write a comprehensive, highly engaging article about: "${topic}".
    Category: ${category}.
    Return ONLY valid JSON in this exact format:"""

new_prompt = """const prompt = `You are an expert iGaming SEO copywriter. Write a comprehensive, highly engaging, and highly converting article (800-1500 words) about: "${topic}".
    Category: ${category}.
    Make sure to include sections for:
    - Introduction and target audience
    - Detailed breakdown (Pros/Cons, Comparisons if applicable)
    - Payment methods and withdrawal speeds
    - Step-by-step guide on how to claim promo codes (mention code MAXBOOST500)
    - Responsible gambling disclaimer at the end
    
    Use rich Markdown formatting (H2, H3, bullet points, bold text).
    Return ONLY valid JSON in this exact format:"""

content = content.replace(old_prompt, new_prompt)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)

