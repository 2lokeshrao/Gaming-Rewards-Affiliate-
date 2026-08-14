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

# Custom Pages
text = text.replace(
    "<CustomPageView page={customPageMatch} />\n      </>",
    "<CustomPageView page={customPageMatch} />" + footer_injection + "\n      </>"
)

# Brand Article
text = text.replace(
    "<BrandArticlePage path={currentPath} geo={geo} platforms={platforms} onClaimClick={handleClaimClick} />\n      </>",
    "<BrandArticlePage path={currentPath} geo={geo} platforms={platforms} onClaimClick={handleClaimClick} />" + footer_injection + "\n      </>"
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
