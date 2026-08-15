import re

with open('server.ts', 'r') as f:
    content = f.read()

# 1. Remove lokeshrao050@gmail.com
content = content.replace('    "lokeshrao050@gmail.com",\n', '')

# 2. Add robots.txt route
robots_txt = """
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /go/
Disallow: /api/admin/

Sitemap: https://bonuspromocode.in/sitemap.xml
`);
});

// SEO Helper function
"""
content = content.replace('// SEO Helper function', robots_txt)

# 3. Update sitemap host
content = content.replace("const host = `${req.protocol}://${req.get('host')}`;", "const host = `https://${req.get('host')}`;")

# 4. Remove /go/ URLs from sitemap
sitemap_go_pattern = r"      // Redirect Route\n      xml \+= `  <url>\\n`;\n      xml \+= `    <loc>\$\{host\}/go/\$\{p\.slug\}</loc>\\n`;\n      xml \+= `    <lastmod>\$\{now\}</lastmod>\\n`;\n      xml \+= `    <changefreq>weekly</changefreq>\\n`;\n      xml \+= `    <priority>0\.8</priority>\\n`;\n      xml \+= `  </url>\\n`;\n\n"
content = re.sub(sitemap_go_pattern, "", content)

# I should probably just write a robust regex or replacement for the sitemap platform loop.
with open('fix_server.py', 'w') as f:
    f.write(content) # I'll do this better below
