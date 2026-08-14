with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# find everything after {/* TAB 11: A/B TESTING DASHBOARD */} and fix it manually
parts = text.split('{/* TAB 11: A/B TESTING DASHBOARD */}')
prefix = parts[0]
suffix = parts[1]

# Now, we want to only include A/B testing, AI articles, and footer manager ONCE.
fixed_suffix = """{/* TAB 11: A/B TESTING DASHBOARD */}
          {activeTab === 'abtest' && (
            <AbTestDashboardTab
              config={config}
              onSaveConfig={onSaveConfig}
            />
          )}

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
        </div>
      </div>
    </div>
  );
};
"""

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(prefix + fixed_suffix)
