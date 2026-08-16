const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const regex = /\/\/ 1\. SECURE MYSQL INITIALIZATION[\s\S]*?const pool = mysql\.createPool\(\{[\s\S]*?\}\);/g;

const replacement = `// 1. JSON FILE DB IMPLEMENTATION (REPLACING MYSQL)
const DATA_FILE = path.join(process.cwd(), 'app_data.json');

const pool = {
  async query(sql, params = []) {
    let db = [];
    try {
      if (fs.existsSync(DATA_FILE)) {
        db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      }
    } catch (e) {}

    if (sql.includes('CREATE TABLE')) return [];

    if (sql.startsWith('SELECT data FROM app_data WHERE collection = ? AND doc_id = ?')) {
       const row = db.find(r => r.collection === params[0] && r.doc_id === params[1]);
       return [row ? [row] : []];
    }
    
    if (sql.startsWith('SELECT data FROM app_data WHERE collection = ?')) {
       const rows = db.filter(r => r.collection === params[0]);
       return [rows];
    }

    if (sql.startsWith('SELECT doc_id FROM app_data WHERE collection = ?')) {
       const rows = db.filter(r => r.collection === params[0]);
       return [rows];
    }
    
    if (sql.startsWith('INSERT INTO app_data')) {
       const idx = db.findIndex(r => r.collection === params[0] && r.doc_id === params[1]);
       if (idx >= 0) db[idx].data = params[2];
       else db.push({ collection: params[0], doc_id: params[1], data: params[2] });
       fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
       return [];
    }

    if (sql.startsWith('DELETE FROM app_data')) {
       db = db.filter(r => !(r.collection === params[0] && r.doc_id === params[1]));
       fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
       return [];
    }
    return [[]];
  }
};`;

if (server.match(regex)) {
  server = server.replace(regex, replacement);
  fs.writeFileSync('server.ts', server);
  console.log("Patched server.ts successfully!");
} else {
  console.log("Could not find the target string in server.ts");
}
