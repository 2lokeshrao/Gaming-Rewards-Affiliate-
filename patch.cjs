const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const utility = `
async function generateWithRetry(ai, params, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (e) {
      if ((e.status === 503 || e.status === 429) && i < retries - 1) {
        console.warn(\`AI API \${e.status} error, retrying in \${2 * (i + 1)}s...\`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      } else {
        throw e;
      }
    }
  }
}
`;

if (!code.includes('generateWithRetry')) {
    code = code.replace("const app = express();", utility + "\nconst app = express();");
    
    // Replace ai.models.generateContent( with generateWithRetry(ai, 
    code = code.replace(/await ai\.models\.generateContent\(/g, "await generateWithRetry(ai, ");
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts successfully");
} else {
    console.log("Already patched");
}
