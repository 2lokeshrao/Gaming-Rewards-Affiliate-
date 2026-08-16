const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const imgApi = `
// API: Image Optimization Proxy
app.get('/api/image-optimize', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('URL required');
  }
  
  const width = parseInt(req.query.w) || 400;
  const quality = parseInt(req.query.q) || 75;

  try {
    const fetchRes = await fetch(url);
    if (!fetchRes.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const optimized = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
      
    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(optimized);
  } catch (error) {
    // If anything fails, fallback to redirecting to the original URL
    res.redirect(url);
  }
});

`;

if (!code.includes('/api/image-optimize')) {
  code = code.replace("// API: Get Public Data", imgApi + "// API: Get Public Data");
  fs.writeFileSync('server.ts', code);
}
