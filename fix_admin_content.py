import re

with open('src/types.ts', 'r') as f:
    text = f.read()

if "copyrightText?:" not in text:
    text = text.replace("footerColumns?: FooterColumn[];", "footerColumns?: FooterColumn[];\n  copyrightText?: string;")

with open('src/types.ts', 'w') as f:
    f.write(text)

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

tab_contents = """
          {/* TAB: AI ARTICLES */}
          {activeTab === 'articles' && (
            <AiArticleManagerTab
              config={config}
              platforms={platforms}
              onSaveConfig={onSaveConfig}
            />
          )}

          {/* TAB: FOOTER MANAGER */}
          {activeTab === 'footer' && (
            <FooterManagerTab
              config={config}
              onSaveConfig={onSaveConfig}
            />
          )}
"""
if "<AiArticleManagerTab" not in text:
    text = text.replace(
        "            />\n          )}",
        "            />\n          )}\n" + tab_contents
    )

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
