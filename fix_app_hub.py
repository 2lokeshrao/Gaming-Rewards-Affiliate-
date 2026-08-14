import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

footer_injection = """
        <Footer
          platforms={platforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />"""

text = text.replace(
    "<FinancialHubPage path={currentPath} geo={geo} />\n      </>",
    "<FinancialHubPage path={currentPath} geo={geo} platforms={platforms} customPages={customPages} config={config} />" + footer_injection + "\n      </>"
)

text = text.replace(
    "<WalletArticlePage path={currentPath} geo={geo} />\n      </>",
    "<WalletArticlePage path={currentPath} geo={geo} platforms={platforms} customPages={customPages} config={config} />" + footer_injection + "\n      </>"
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
