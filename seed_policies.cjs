const fs = require('fs');

const markdownPrivacy = `# Privacy Policy

Last Updated: \${new Date().toLocaleDateString()}

## 1. Introduction
Welcome to BonusPromoCode.in. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

## 2. Information We Collect
We may collect information about you in a variety of ways, including:
- **Personal Data:** We may collect your email address if you voluntarily submit it to us through forms or email checkers on our site.
- **Derivative Data:** Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, and access times.

## 3. Use of Your Information
Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use information collected about you via the Site to:
- Deliver targeted advertising, coupons, newsletters, and other information regarding promotions.
- Monitor and analyze usage and trends to improve your experience with the Site.
- Compile anonymous statistical data and analysis for use internally or with third parties.

## 4. Third-Party Websites
The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy.

## 5. Cookies and Tracking Technologies
We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
`;

const markdownTerms = `# Terms & Conditions

Last Updated: \${new Date().toLocaleDateString()}

## 1. Agreement to Terms
These Terms of Use constitute a legally binding agreement made between you and BonusPromoCode.in concerning your access to and use of the website.

## 2. Nature of the Website
BonusPromoCode.in is an independent affiliate promotional portal. We provide reviews, bonus codes, and informational content regarding third-party gaming and sports platforms. We are not an operator of gaming or gambling services.

**Important:** Users must be 18 years of age or older to use any services linked from this website. Please gamble responsibly.

## 3. Third-Party Links & Offers
The Site contains links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, video, information, and applications originating from third parties. Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us.

We are not responsible for any promotions, deposits, withdrawals, or issues you may face on third-party platforms. Any disputes must be handled directly with the respective platform operator.

## 4. Disclaimer
The information provided on the site is for general informational purposes only. We make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
`;

console.log("Extracted markdown policies.");
