import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

replacement = """          {activeTab === 'seo' && (
            <SeoManagerTab
              platforms={platforms}
              onSavePlatforms={onSavePlatforms}
            />
          )}

          {activeTab === 'seo_health' && (
            <SeoHealthTab
              platforms={platforms}
              onSavePlatforms={onSavePlatforms}
            />
          )}"""

content = content.replace("""          {activeTab === 'seo' && (
            <SeoManagerTab
              platforms={platforms}
              onSavePlatforms={onSavePlatforms}
            />
          )}""", replacement)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
