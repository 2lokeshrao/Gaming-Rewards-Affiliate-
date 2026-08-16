const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

// Undo the wrong isActive replacements
code = code.replace(/isActive: boolean;\n  affiliateLinks\?: AffiliateLink\[\];/g, 'isActive: boolean;');
code = code.replace(/status\?: "draft" \| "published";\n  affiliateLinks\?: AffiliateLink\[\];/g, 'status?: "draft" | "published";');

fs.writeFileSync('src/types.ts', code);
