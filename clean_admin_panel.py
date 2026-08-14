import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Define the exact chunk to remove
chunk_to_remove = """          {/* TAB: AI ARTICLES */}
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
          )}"""

# Replace all occurrences with empty string
text = text.replace(chunk_to_remove, "")
text = text.replace(chunk_to_remove.strip(), "") # Just in case

# Now append it ONE time before the final closing tags
final_append = chunk_to_remove + """
        </div>
      </div>
    </div>
  );
};
"""

text = text.replace("""        </div>
      </div>
    </div>
  );
};""", final_append)

# Note: sometimes there's whitespace issues. Let's use regex to wipe it thoroughly.
text = re.sub(r'\s*\{\/\* TAB: AI ARTICLES \*\/\}.*?onSaveConfig={onSaveConfig}\s*\/>\s*\)\}\s*\{\/\* TAB: FOOTER MANAGER \*\/\}.*?onSaveConfig={onSaveConfig}\s*\/>\s*\)\}', '', text, flags=re.DOTALL)

text = text.replace("""        </div>
      </div>
    </div>
  );
};""", final_append)


with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
