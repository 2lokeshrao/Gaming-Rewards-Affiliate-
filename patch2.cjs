const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /async function generateWithRetry\(ai, params, retries = 3\) \{[\s\S]*?\}\n/g;
code = code.replace(regex, `async function generateWithRetry(ai: GoogleGenAI, params: any, retries: number = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (e: any) {
      if ((e.status === 503 || e.status === 429) && i < retries - 1) {
        logger.warn(\`AI API \${e.status} error, retrying in \${2 * (i + 1)}s...\`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      } else {
        throw e;
      }
    }
  }
}
`);
fs.writeFileSync('server.ts', code);
console.log("Patched types");
