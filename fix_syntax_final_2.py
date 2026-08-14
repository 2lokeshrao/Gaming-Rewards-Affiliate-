with open('src/components/AdminPanel.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "onClick={() => { setActiveTab('subpartners'); setIsMobileMenuOpen(false); }}" in line and "className={`w-full text-left" in lines[i+1] and "<button" in lines[i+1]:
        # this is the corrupted block
        skip = True
    if skip:
        if "<span>Custom Pages</span>" in line:
            skip = False
            continue
        continue
    new_lines.append(line)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.writelines(new_lines)
