const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const LuckyWheelModal = lazy\(\(\) => import\('\.\/components\/LuckyWheelModal'\)\.then\(m => \(\{ default: m\.LuckyWheelModal \}\)\)\);\n/g, '');
code = code.replace(/  const \[showWheelModal, setShowWheelModal\] = useState\(false\);\n/g, '');

const triggerRegex = /  \/\/ Trigger Lucky Wheel after 5 seconds automatically if enabled\n  useEffect\(\(\) => \{\n    if \(\!config \|\| \!config\.enableLuckyWheel\) return;\n\n    const hasSeenWheel = sessionStorage\.getItem\('has_seen_wheel'\);\n    if \(\!hasSeenWheel\) \{\n      const timer = setTimeout\(\(\) => \{\n        setShowWheelModal\(true\);\n        sessionStorage\.setItem\('has_seen_wheel', 'true'\);\n      \}, 5000\);\n      return \(\) => clearTimeout\(timer\);\n    \}\n  \}, \[config\]\);\n/g;
code = code.replace(triggerRegex, '');

const handlerRegex = /  \/\/ Wheel prize redirect\n  const handleWheelClaimPrize = \(p: GamingPlatform, code: string\) => \{\n    trackEvent\('wheel_spin', p\.id\);\n    const endTime = Date\.now\(\) \+ 10 \* 60 \* 1000;\n    const timerData = \{\n      platformName: p\.name,\n      promoCode: code \|\| p\.promoCode \|\| 'MAXBOOST500',\n      slug: p\.slug,\n      endTime\n    \};\n    setActiveUrgencyTimer\(timerData\);\n    try \{\n      sessionStorage\.setItem\('active_urgency_timer', JSON\.stringify\(timerData\)\);\n    \} catch \{\}\n    const clickId = sessionStorage\.getItem\('tracker_click_id'\) \|\| '';\n    const sub1 = sessionStorage\.getItem\('tracker_sub1'\) \|\| geo\.countryCode \|\| '';\n    const sub2 = sessionStorage\.getItem\('tracker_sub2'\) \|\| 'bonuspromocode_web_wheel';\n    \n    let target = `\/go\/\$\{p\.slug\}\?sub1=\$\{sub1\}\&sub2=\$\{sub2\}`;\n    if \(clickId\) target \+= `\&click_id=\$\{clickId\}`;\n    window\.open\(target, '_blank'\);\n    setShowWheelModal\(false\);\n  \};\n/g;
code = code.replace(handlerRegex, '');

const buttonRegex = /          \{config\.enableLuckyWheel && \(\n            <button\n              onClick=\{\(\) => setShowWheelModal\(true\)\}\n              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 font-black text-xs sm:text-sm text-white shadow-xl shadow-purple-600\/30 flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform"\n            >\n              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" \/>\n              \{t\('spinToWin', 'Spin to Win Bonus!'\)\}\n            <\/button>\n          \)\}\n/g;
code = code.replace(buttonRegex, '');

const modalRenderRegex = /        \{showWheelModal && \(\n          <LuckyWheelModal\n            platforms=\{platforms\}\n            config=\{config\}\n            onClaimPrize=\{handleWheelClaimPrize\}\n            onClose=\{\(\) => setShowWheelModal\(false\)\}\n          \/>\n        \)\}\n/g;
code = code.replace(modalRenderRegex, '');

fs.writeFileSync('src/App.tsx', code);
