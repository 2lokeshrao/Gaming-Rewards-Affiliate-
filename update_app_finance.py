import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { FinancialHubPage } from './components/FinancialHubPage';\n"
if "FinancialHubPage" not in content:
    content = content.replace("import { WalletArticlePage } from './components/WalletArticlePage';", "import { WalletArticlePage } from './components/WalletArticlePage';\n" + import_stmt)

# Add routing logic
routing_logic = """
  // Financial Hub Routing
  if (currentPath.startsWith('/banking') || currentPath.startsWith('/loans') || currentPath.startsWith('/payments/credit-card')) {
    return (
      <>
        <TopLoadingBar isLoading={isNavigating} />
        <FinancialHubPage path={currentPath} geo={geo} />
      </>
    );
  }
"""
if "FinancialHubPage path" not in content:
    content = content.replace("  // Basic Client-Side Routing for static pages", "  // Basic Client-Side Routing for static pages\n" + routing_logic)

# Add footer link
footer_link = """ | <a href="/banking/best-virtual-cards-for-gaming" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/banking/best-virtual-cards-for-gaming'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="underline hover:text-amber-400 ml-2">Financial Hub</a>"""
if "Financial Hub" not in content:
    content = content.replace("className=\"underline hover:text-amber-400 ml-2\">{t('footer.terms')}</a>", "className=\"underline hover:text-amber-400 ml-2\">{t('footer.terms')}</a>" + footer_link)

with open('src/App.tsx', 'w') as f:
    f.write(content)
