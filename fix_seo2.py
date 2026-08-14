import re

with open('src/components/SeoContentSection.tsx', 'r') as f:
    content = f.read()

# Replace static H2 with dynamic
if "Official Promo Codes for 1Win, Mostbet" in content:
    content = re.sub(r'<h2 className="text-2xl.*?Official Promo Codes for 1Win, Mostbet.*?</h2>', '<h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">\n          {geo.country || "Global"} Official Promo Codes for 1Win, Mostbet, Stake & Custom Events\n        </h2>', content, flags=re.DOTALL)

with open('src/components/SeoContentSection.tsx', 'w') as f:
    f.write(content)
