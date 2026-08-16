const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/    enableLuckyWheel: stateConfig\.enableLuckyWheel,\n/g, '');
code = code.replace(/    featuredPrizePlatformId: stateConfig\.featuredPrizePlatformId,\n/g, '');
code = code.replace(/    featuredPromoCode: stateConfig\.featuredPromoCode,\n/g, '');
code = code.replace(/    wheelBonusText: stateConfig\.wheelBonusText,\n/g, '');
code = code.replace(/  totalWheelSpins: 0,\n/g, '');
code = code.replace(/        totalWheelSpins: stateStats\.totalWheelSpins,\n/g, '');
code = code.replace(/    \} else if \(eventType === 'wheel_spin'\) \{\n      stateStats\.totalWheelSpins\+\+;\n/g, '');

fs.writeFileSync('server.ts', code);
