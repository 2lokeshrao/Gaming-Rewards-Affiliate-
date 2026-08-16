const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/        enableLuckyWheel: true,\n/g, '');
code = code.replace(/        featuredPrizePlatformId: "1win",\n/g, '');
code = code.replace(/        featuredPromoCode: "VIPBONUS500",\n/g, '');
code = code.replace(/        wheelBonusText: "500% WELCOME BONUS \+ 200 FREE SPINS",\n/g, '');

fs.writeFileSync('server.ts', code);
