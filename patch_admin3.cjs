const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">\n                  <span className="text-xs text-slate-400 font-bold block">Lucky Wheel Spins<\/span>\n                  <span className="text-2xl font-black text-purple-400 mt-1 block">\{stats\?\.totalWheelSpins \|\| 0\}<\/span>\n                <\/div>\n/g;

code = code.replace(regex, '');
fs.writeFileSync('src/components/AdminPanel.tsx', code);
