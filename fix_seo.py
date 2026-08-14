import re

with open('src/components/SeoContentSection.tsx', 'r') as f:
    content = f.read()

content = content.replace("interface SeoContentSectionProps {", "import { UserGeo } from '../types';\n\ninterface SeoContentSectionProps {\n  geo: UserGeo;")
content = content.replace("customCoupons = [],", "customCoupons = [],\n  geo,")

# Replace static H2 with dynamic
if "2026's Most Trusted" in content:
    content = re.sub(r'<h2 className="text-2xl.*?2026\'s Most Trusted.*?</h2>', '<h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">\n            {geo.country || "Global"} 2026\'s Most Trusted Crypto Casinos & Betting Apps\n          </h2>', content, flags=re.DOTALL)

with open('src/components/SeoContentSection.tsx', 'w') as f:
    f.write(content)
