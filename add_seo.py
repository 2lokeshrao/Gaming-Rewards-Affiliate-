import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# We want to find each platform block and add metaTitle, metaDescription, metaKeywords if they don't exist
# We will use regex to find each platform definition

pattern = re.compile(r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?promoCode:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)"\n\s*\}')

def repl(match):
    full_match = match.group(0)
    platform_id = match.group(1)
    name = match.group(3)
    promoCode = match.group(4)
    
    # Generate SEO
    metaTitle = f"{name} Promo Code {promoCode} | Best Bonus 2026"
    metaDesc = f"Use verified promo code {promoCode} for {name} to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards."
    metaKeywords = f"{name.lower()} promo code, {name.lower()} bonus, {promoCode}, best {name.lower()} promo"
    
    # Insert before the last closing brace
    # Wait, the match ends with 'category: "something"\n  }' or similar.
    # We should just append these fields before the closing bracket.
    
    # Find the position of the last '}'
    last_brace_index = full_match.rfind('}')
    if last_brace_index != -1:
        seo_fields = f',\n    metaTitle: "{metaTitle}",\n    metaDescription: "{metaDesc}",\n    metaKeywords: "{metaKeywords}"\n  }}'
        new_match = full_match[:last_brace_index] + seo_fields
        return new_match
    return full_match

new_content = pattern.sub(repl, content)

with open('src/data.ts', 'w') as f:
    f.write(new_content)
