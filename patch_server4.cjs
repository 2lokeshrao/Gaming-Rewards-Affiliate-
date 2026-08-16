const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/  \} else if \(eventType === 'wheel_spin'\) \{\n    stateStats\.totalWheelSpins \+= 1;\n  \}\n/g, '  }\n');
code = code.replace(/ \| 'wheel_spin'/g, '');

fs.writeFileSync('server.ts', code);
