const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /          \{config\.enableLuckyWheel && \([\s\S]*?<\/button>\n          \)\}\n/g;
code = code.replace(regex1, '');

fs.writeFileSync('src/App.tsx', code);
