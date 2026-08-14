import re

with open('src/components/AdminDashboardTab.tsx', 'r') as f:
    text = f.read()

# Fix table rendering
text = text.replace('{panel.stats.totalRegistrations.toLocaleString()}', '{(panel.stats?.totalRegistrations || 0).toLocaleString()}')
text = text.replace('{panel.stats.ftdCount.toLocaleString()}', '{(panel.stats?.ftdCount || 0).toLocaleString()}')
text = text.replace('{formatAmount(panel.stats.totalDepositsAmount)}', '{formatAmount(panel.stats?.totalDepositsAmount || 0)}')
text = text.replace('{formatAmount(panel.stats.netGamingRevenue)}', '{formatAmount(panel.stats?.netGamingRevenue || 0)}')
text = text.replace('{formatAmount(panel.stats.commissionEarned)}', '{formatAmount(panel.stats?.commissionEarned || 0)}')
text = text.replace('{panel.stats.revSharePercent}%', '{panel.stats?.revSharePercent || 0}%')

# Fix handleSync
text = text.replace('...item.stats,', '...(item.stats || {}),')
text = text.replace('item.stats.totalRegistrations + extraRegs', '(item.stats?.totalRegistrations || 0) + extraRegs')
text = text.replace('item.stats.ftdCount + extraFtds', '(item.stats?.ftdCount || 0) + extraFtds')
text = text.replace('item.stats.totalDepositsAmount + extraDep', '(item.stats?.totalDepositsAmount || 0) + extraDep')
text = text.replace('item.stats.netGamingRevenue + extraNgr', '(item.stats?.netGamingRevenue || 0) + extraNgr')
text = text.replace('item.stats.commissionEarned + extraCommission', '(item.stats?.commissionEarned || 0) + extraCommission')

with open('src/components/AdminDashboardTab.tsx', 'w') as f:
    f.write(text)
