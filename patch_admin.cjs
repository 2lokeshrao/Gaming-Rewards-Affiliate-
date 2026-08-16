const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">\n                    <div>\n                      <span className="font-bold text-white text-xs block">Enable Lucky Wheel Pop-up<\/span>\n                      <span className="text-\[11px\] text-slate-400">Shows gamified spin wheel after 5s or on exit intent\.<\/span>\n                    <\/div>\n                    <input\n                      type="checkbox"\n                      checked=\{localConfig\.enableLuckyWheel\}\n                      onChange=\{e => setLocalConfig\(\{ \.\.\.localConfig, enableLuckyWheel: e\.target\.checked \}\)\}\n                      className="w-5 h-5 rounded accent-purple-600"\n                    \/>\n                  <\/label>\n\n/g;

code = code.replace(regex, '');
fs.writeFileSync('src/components/AdminPanel.tsx', code);
