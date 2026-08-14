import re

with open('server.ts', 'r') as f:
    text = f.read()

if "let stateCustomPages" not in text:
    text = text.replace("let stateSubPartners: any[] = [];", "let stateSubPartners: any[] = [];\nlet stateCustomPages: any[] = [];")

with open('server.ts', 'w') as f:
    f.write(text)
