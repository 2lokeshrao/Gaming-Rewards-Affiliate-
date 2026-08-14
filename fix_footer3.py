import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

# The error states:
# 141|          </div>
# 142|        </footer>
# 143|    );
# Which means there's an extra </div> at line 141 that doesn't belong. Let's find it.

lines = text.split('\n')
# Just take all lines until the last `</div>` before `</footer>`.
# Let's do it carefully.
new_lines = []
for i, line in enumerate(lines):
    if line.strip() == '</div>' and i > len(lines) - 8:
        # Check if the next non-empty line is </footer>
        j = i + 1
        is_footer_next = False
        while j < len(lines):
            if lines[j].strip() == '</footer>':
                is_footer_next = True
                break
            elif lines[j].strip() != '':
                break
            j += 1
        if is_footer_next:
            continue # skip this extra div
    new_lines.append(line)

with open('src/components/Footer.tsx', 'w') as f:
    f.write('\n'.join(new_lines))
