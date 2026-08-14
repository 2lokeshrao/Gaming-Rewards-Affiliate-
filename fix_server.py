import re

with open('server.ts', 'r') as f:
    text = f.read()

text = text.replace("    subPartners: stateSubPartners,", "    subPartners: stateSubPartners,\n    customPages: stateCustomPages,")

with open('server.ts', 'w') as f:
    f.write(text)
