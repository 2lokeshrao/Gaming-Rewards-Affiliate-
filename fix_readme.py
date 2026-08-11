with open('README.md', 'r') as f:
    content = f.read()

content = content.replace('(Default: `@dmin123`)', '')
content = content.replace('(Default passcode: `@dmin123`)', '')

with open('README.md', 'w') as f:
    f.write(content)
