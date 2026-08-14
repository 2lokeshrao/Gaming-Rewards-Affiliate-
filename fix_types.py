import re

with open('src/types.ts', 'r') as f:
    text = f.read()

# Add AI Article type
article_type = """
export interface AIArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  platformId?: string;
  platformName?: string;
  metaTitle: string;
  metaDescription: string;
  coverImage?: string;
  publishedAt: string;
  author: string;
  tags: string[];
  views: number;
}
"""

if "AIArticle" not in text:
    text += article_type

# Add FooterLink and FooterColumn types
footer_types = """
export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}
"""
if "FooterColumn" not in text:
    text += footer_types

# Add them to GlobalConfig
config_replacement = """  secretKeyTrigger?: string; // e.g. "Ctrl+Shift+A" or secret keyword
  // Dynamic Footer
  footerColumns?: FooterColumn[];
  // AI Articles
  articles?: AIArticle[];"""
text = text.replace('  secretKeyTrigger?: string; // e.g. "Ctrl+Shift+A" or secret keyword', config_replacement)

with open('src/types.ts', 'w') as f:
    f.write(text)
