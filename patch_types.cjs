const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const affiliateLinkType = `
export interface AffiliateLink {
  id: string;
  brandName: string;
  logoUrl?: string;
  title: string;
  description?: string;
  url: string;
  buttonText?: string;
  badgeText?: string;
  rating?: number;
}
`;

if (!code.includes('interface AffiliateLink')) {
  code = code + affiliateLinkType;
}

code = code.replace(/export interface CustomPage \{[\s\S]*?\}/, match => {
  if (match.includes('affiliateLinks')) return match;
  return match.replace(/\}$/, '  affiliateLinks?: AffiliateLink[];\n}');
});

code = code.replace(/export interface AIArticle \{[\s\S]*?\}/, match => {
  if (match.includes('affiliateLinks')) return match;
  return match.replace(/\}$/, '  affiliateLinks?: AffiliateLink[];\n}');
});

fs.writeFileSync('src/types.ts', code);
