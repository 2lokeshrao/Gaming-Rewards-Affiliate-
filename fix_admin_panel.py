import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

helper = """
  // Helper to truncate text
  const truncateSeoText = (text: string | undefined, max: number) => {
    if (!text) return '';
    if (text.length <= max) return text;
    const truncated = text.substring(0, max - 3).trim();
    return `${truncated}...`;
  };
"""

if "truncateSeoText" not in content:
    content = content.replace("  const handleAddNewPlatform = () => {", helper + "\n  const handleAddNewPlatform = () => {")

    replacement = """                            const generatedTitle = truncateSeoText(`${name} Promo Code ${code} | 500% Deposit Bonus 2026`, 60);
                            const generatedDesc = truncateSeoText(`Official verified promo code for ${name}. Use code ${code} during registration to claim 500% welcome bonus + 200 free spins instantly.`, 160);
                            setEditingPlatform({
                              ...editingPlatform,
                              metaTitle: generatedTitle,
                              metaDescription: generatedDesc,
                              metaKeywords: `${name.toLowerCase()} promo code, ${name.toLowerCase()} bonus code, ${name.toLowerCase()} welcome bonus 500%, ${code}`
                            });"""
                            
    content = re.sub(r'setEditingPlatform\(\{\s*\.\.\.editingPlatform,\s*metaTitle: `\$\{name\} Promo Code \$\{code\} \| 500% Deposit Bonus 2026`,\s*metaDescription: `Official verified promo code for \$\{name\}\. Use code \$\{code\} during registration to claim 500% welcome bonus \+ 200 free spins instantly\.`,\s*metaKeywords: `\$\{name\.toLowerCase\(\)\} promo code, \$\{name\.toLowerCase\(\)\} bonus code, \$\{name\.toLowerCase\(\)\} welcome bonus 500%, \$\{code\}`\s*\}\);', replacement, content, count=1)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
