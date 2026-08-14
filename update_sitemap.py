import re

with open('server.ts', 'r') as f:
    text = f.read()

# Add articles into the sitemap
replacement = """
    const aiArticleUrls = (globalConfig.articles || []).map((art: any) => `
      <url>
        <loc>https://${req.get('host')}/blog/${art.slug}</loc>
        <lastmod>${new Date(art.publishedAt).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticUrls}
        ${platformUrls}
        ${aiArticleUrls}
      </urlset>`;
"""

text = re.sub(r'const sitemap = `<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http://www\.sitemaps\.org/schemas/sitemap/0\.9">\s*\$\{staticUrls\}\s*\$\{platformUrls\}\s*</urlset>`;', replacement, text)

with open('server.ts', 'w') as f:
    f.write(text)
