import re
with open('server.ts', 'r') as f:
    content = f.read()

if "let stateCustomPages: any[] = [];" not in content:
    content = content.replace("let stateSubPartners: any[] = [];", "let stateSubPartners: any[] = [];\nlet stateCustomPages: any[] = [];")

if "customPages: stateCustomPages" not in content:
    content = content.replace("subPartners: stateSubPartners", "subPartners: stateSubPartners,\n    customPages: stateCustomPages")

route = """
app.post('/api/admin/custom-pages', express.json(), (req, res) => {
  const { pages } = req.body;
  if (Array.isArray(pages)) {
    stateCustomPages = pages;
  }
  res.json({ success: true });
});
"""
if "/api/admin/custom-pages" not in content:
    content = content.replace("app.post('/api/admin/config'", route + "\napp.post('/api/admin/config'")

with open('server.ts', 'w') as f:
    f.write(content)
