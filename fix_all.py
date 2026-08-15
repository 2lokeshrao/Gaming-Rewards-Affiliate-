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
# We will use regex to remove the block that adds /go/ to the sitemap
sitemap_go_pattern = r"      // Redirect Route.*?      xml \+= `  </url>\\n`;"
content = re.sub(sitemap_go_pattern, "", content, flags=re.DOTALL)

# 5. Add Cache-Control headers for static assets
content = content.replace("app.use(express.static(distPath));", "app.use(express.static(distPath, { maxAge: '1y' }));")
content = content.replace("app.get('*', (req, res) => {", "app.get('*', (req, res) => {\n      res.set('Cache-Control', 'no-cache');")

with open('server.ts', 'w') as f:
    f.write(content)

