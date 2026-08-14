import re

with open('server.ts', 'r') as f:
    text = f.read()

text = re.sub(r'(    customPages: stateCustomPages,\n)+', r'    customPages: stateCustomPages,\n', text)

with open('server.ts', 'w') as f:
    f.write(text)
