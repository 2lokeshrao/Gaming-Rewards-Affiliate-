import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# Replace clicksCount and copiesCount with 0
content = re.sub(r'clicksCount:\s*\d+,', 'clicksCount: 0,', content)
content = re.sub(r'copiesCount:\s*\d+', 'copiesCount: 0', content)

# Replace all abTestConfig stats with 0
content = re.sub(r'variantAViews:\s*\d+,', 'variantAViews: 0,', content)
content = re.sub(r'variantBViews:\s*\d+,', 'variantBViews: 0,', content)
content = re.sub(r'variantAClicks:\s*\d+,', 'variantAClicks: 0,', content)
content = re.sub(r'variantBClicks:\s*\d+', 'variantBClicks: 0', content)

# Replace all stats in partnerPanelConfigs with 0
stats_block = r'''stats:\s*\{\s*totalRegistrations:\s*\d+,\s*ftdCount:\s*\d+,\s*totalDepositsAmount:\s*\d+,\s*netGamingRevenue:\s*\d+,\s*commissionEarned:\s*\d+,\s*revSharePercent:\s*\d+\s*\}'''
new_stats_block = '''stats: {
        totalRegistrations: 0,
        ftdCount: 0,
        totalDepositsAmount: 0,
        netGamingRevenue: 0,
        commissionEarned: 0,
        revSharePercent: 45
      }'''

content = re.sub(stats_block, new_stats_block, content, flags=re.MULTILINE)

with open('src/data.ts', 'w') as f:
    f.write(content)
