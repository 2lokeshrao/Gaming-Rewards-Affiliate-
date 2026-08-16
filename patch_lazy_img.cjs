const fs = require('fs');
let code = fs.readFileSync('src/components/LazyImage.tsx', 'utf8');

const targetStr = `src={src}`;
const replacement = `src={src.startsWith('http') ? \`/api/image-optimize?w=400&q=75&url=\${encodeURIComponent(src)}\` : src}`;

if (code.includes(targetStr) && !code.includes('image-optimize')) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/components/LazyImage.tsx', code);
}
