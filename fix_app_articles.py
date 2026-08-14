import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Make sure config has articles fallback if missing.
old_load = """      const saved = localStorage.getItem('global_config');
      if (saved) return JSON.parse(saved);"""

new_load = """      const saved = localStorage.getItem('global_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.articles) parsed.articles = initialGlobalConfig.articles || [];
        return parsed;
      }"""

text = text.replace(old_load, new_load)

with open('src/App.tsx', 'w') as f:
    f.write(text)
