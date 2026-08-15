import re

with open('src/components/BrandArticlePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import for injectSeoTags
if "injectSeoTags" not in content:
    content = content.replace("import { getGeoContext, getSeoTemplates } from '../utils/seoTemplates';", "import { getGeoContext, getSeoTemplates } from '../utils/seoTemplates';\nimport { injectSeoTags } from '../utils/seo';")

# Update useEffect for SEO tags
old_use_effect = r'''  useEffect\(\(\) => \{
    if \(!platform\) return;
    document.title = .*?;
    let metaDesc = document.querySelector\('meta\[name="description"\]'\);
    if \(!metaDesc\) \{
      metaDesc = document.createElement\('meta'\);
      metaDesc.setAttribute\('name', 'description'\);
      document.head.appendChild\(metaDesc\);
    \}
    metaDesc.setAttribute\('content', content.promoContent.replace\(/<\[\^>\]\+>/g, ''\).substring\(0, 150\) \+ '\.\.\.'\);
  \}, \[platform, geoContext.country, content\]\);'''

new_use_effect = '''  useEffect(() => {
    if (!platform) return;
    const title = `${platform.name} Promo Code 2026 - ${platform.bonusText || '500% Bonus'} | BonusPromoCode`;
    const desc = `Claim the best ${platform.name} promo code for ${geoContext.country}. Get ${localizedBonus} instantly. Read our complete review, payment methods, and withdrawal speed.`;
    const canonical = `https://bonuspromocode.in/review/${slug}`;
    const ogImage = typeof platform.logoUrl === 'string' && platform.logoUrl.startsWith('data:') ? '' : `https://bonuspromocode.in${platform.logoUrl}`;
    
    injectSeoTags(title, desc, canonical, ogImage);
  }, [platform, geoContext.country, localizedBonus, slug]);'''

content = re.sub(old_use_effect, new_use_effect, content, count=1, flags=re.DOTALL)

with open('src/components/BrandArticlePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

