import re

with open('src/components/AdminDashboardTab.tsx', 'r') as f:
    content = f.read()

# Fix defaultPanelConfigs mock generation
pattern1 = r"const mockRegs = Math\.floor.*?const mockCommission = Math\.floor\(mockNgr \* 0\.45\);"
replacement1 = """const mockRegs = 0;
    const mockFtds = 0;
    const mockDep = 0;
    const mockNgr = 0;
    const mockCommission = 0;"""
content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)

# Fix handleSyncNow fake increment
pattern2 = r"const extraRegs = Math\.floor.*?const extraCommission = Math\.floor\(extraNgr \* 0\.45\);"
replacement2 = """// Only syncs timestamp. Real data should come from actual S2S postback DB aggregation.
        const extraRegs = 0;
        const extraFtds = 0;
        const extraDep = 0;
        const extraNgr = 0;
        const extraCommission = 0;"""
content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

with open('src/components/AdminDashboardTab.tsx', 'w') as f:
    f.write(content)
