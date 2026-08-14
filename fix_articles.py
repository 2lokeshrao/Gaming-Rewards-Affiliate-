import re

with open('src/components/ProgrammaticSeoArticles.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { WalletReferrals } from './WalletReferrals';\n"
if "WalletReferrals" not in content:
    content = content.replace("import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle, ArrowRight } from 'lucide-react';", "import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle, ArrowRight } from 'lucide-react';\n" + import_stmt)

if "<WalletReferrals" not in content:
    content = content.replace("</button>\n                    </div>\n\n                  </div>", "</button>\n                    </div>\n\n                    {/* Dynamic Wallet Links Placeholder */}\n                    <WalletReferrals geo={geo} />\n\n                  </div>")

with open('src/components/ProgrammaticSeoArticles.tsx', 'w') as f:
    f.write(content)
