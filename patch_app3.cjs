const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex2 = /  \/\/ Wheel prize redirect\n  const handleWheelClaimPrize = \(p: GamingPlatform, code: string\) => \{\n[\s\S]*?setShowWheelModal\(false\);\n  \};\n/g;
code = code.replace(regex2, '');

fs.writeFileSync('src/App.tsx', code);
