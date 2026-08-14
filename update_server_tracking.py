import re

with open('server.ts', 'r') as f:
    content = f.read()

tracking_logic = """
// CLOAKED LINK REDIRECTION ROUTE (/go/:slug)
app.get('/go/:slug', (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_USER_AGENTS.test(userAgent);
  
  // Extract tracking parameters from query string
  const clickId = req.query.click_id || req.query.utm_source || '';
  const sub1 = req.query.sub1 || '';
  const sub2 = req.query.sub2 || '';

  const platform = statePlatforms.find(p => p.slug === slug || p.id === slug);

  if (!platform) {
    return res.redirect('/');
  }

  // Build the dynamic Affiliate URL with tracking parameters
  let targetUrl = platform.rawAffiliateUrl;
  if (clickId || sub1 || sub2) {
    const urlObj = new URL(targetUrl);
    if (clickId) urlObj.searchParams.set('click_id', clickId as string);
    if (sub1) urlObj.searchParams.set('sub1', sub1 as string);
    if (sub2) urlObj.searchParams.set('sub2', sub2 as string);
    targetUrl = urlObj.toString();
  }

  // Record click count
"""

content = content.replace("""
// CLOAKED LINK REDIRECTION ROUTE (/go/:slug)
app.get('/go/:slug', (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_USER_AGENTS.test(userAgent);

  const platform = statePlatforms.find(p => p.slug === slug || p.id === slug);

  if (!platform) {
    return res.redirect('/');
  }

  // Record click count
""", tracking_logic)

redirect_logic = """
          // Auto-redirect script
          setTimeout(() => {
            document.getElementById('cardBox').classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
              window.location.href = "${targetUrl}";
            }, 300);
          }, 3500);
"""

content = content.replace("""
          // Auto-redirect script
          setTimeout(() => {
            document.getElementById('cardBox').classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
              window.location.href = "${platform.rawAffiliateUrl}";
            }, 300);
          }, 3500);
""", redirect_logic)

with open('server.ts', 'w') as f:
    f.write(content)
