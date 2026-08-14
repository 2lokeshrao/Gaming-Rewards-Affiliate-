with open('src/components/AdminPanel.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "              }`} >" in line:
        new_lines.append("              }`}\n            >\n")
    elif "}`} >" in line:
        new_lines.append("}`}\n>\n")
    elif "              }`}" in line and "            >" in lines[lines.index(line) + 1]:
        # we have a clean syntax, check for trailing junk
        pass
    new_lines.append(line)
        
with open('src/components/AdminPanel.tsx', 'w') as f:
    f.writelines(lines)
