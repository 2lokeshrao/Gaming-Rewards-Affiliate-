import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Let's find where config is set
# probably: setConfig(JSON.parse(savedConfig))

match = re.search(r'const savedConfig = localStorage\.getItem\('+"'global_config'"+r'\);.*?setConfig\((.*?)\);', text, re.DOTALL)
if match:
    # replace it
    new_code = """const savedConfig = localStorage.getItem('global_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (!parsed.articles) parsed.articles = initialGlobalConfig.articles || [];
        setConfig(parsed);
      } else {
        setConfig(initialGlobalConfig);
      }"""
    text = re.sub(r'const savedConfig = localStorage\.getItem\('+"'global_config'"+r'\);.*?(?:setConfig\(.*?\);|\})', new_code, text, flags=re.DOTALL, count=1)

with open('src/App.tsx', 'w') as f:
    f.write(text)
