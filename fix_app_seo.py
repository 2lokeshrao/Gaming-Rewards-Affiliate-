import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure injectSeoTags is imported
if "injectSeoTags" not in content:
    content = content.replace("import { injectFaqSchemaInHead, injectGoogleSiteVerification } from './utils/seo';", "import { injectFaqSchemaInHead, injectGoogleSiteVerification, injectSeoTags } from './utils/seo';")

# Inside the main App render, add a useEffect to inject SEO for home and static pages.
pattern = r"(const \[isNavigating, setIsNavigating\] = useState\(false\);)"

new_effect = """\1

  useEffect(() => {
    let title = "Bonus Promo Code | 500% Welcome Bonus & Casino Promo Codes 2026";
    let desc = "Get official 500% Welcome Bonus promo codes for top gaming platforms including 1Win, Mostbet, Stake, BC.Game, Pin-Up Casino, Parimatch, and Melbet. Use promo code MAXBOOST500 to claim instant cashback & 200 free spins!";
    let canonical = `https://bonuspromocode.in${currentPath === '/' ? '' : currentPath}`;
    
    if (currentPath === '/privacy-policy') {
      title = "Privacy Policy | BonusPromoCode";
      desc = "Privacy policy and data handling guidelines for BonusPromoCode.";
    } else if (currentPath === '/terms') {
      title = "Terms & Conditions | BonusPromoCode";
      desc = "Terms of service and conditions for using our gaming promo codes and affiliate portal.";
    }
    
    // Only inject for these top level routes, dynamic routes handle their own
    if (['/', '/privacy-policy', '/terms'].includes(currentPath)) {
      injectSeoTags(title, desc, canonical, 'https://bonuspromocode.in/logos/1win.png');
    }
  }, [currentPath]);
"""

content = re.sub(pattern, new_effect, content, count=1)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
