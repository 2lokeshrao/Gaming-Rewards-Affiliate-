const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">\n                <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400"\/> Wheel Spins<\/span>\n                <span className="text-2xl font-black text-purple-400 mt-1 block">\{stats\?\.totalWheelSpins \|\| 0\}<\/span>\n              <\/div>\n/g;

code = code.replace(regex, '');
fs.writeFileSync('src/components/AdminPanel.tsx', code);
