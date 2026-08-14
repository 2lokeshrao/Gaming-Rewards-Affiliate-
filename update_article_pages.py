import re

def update_file(filename):
    with open(filename, 'r') as f:
        text = f.read()
    
    # 1. Update imports
    # check if Sidebar is imported
    if "import { Sidebar } from './Sidebar';" not in text:
        text = text.replace("import React", "import React, { useEffect, useMemo } from 'react';\nimport { Sidebar } from './Sidebar';\nimport { GamingPlatform, CustomPage, GlobalConfig } from '../types';")
    
    # 2. Update props signature
    # Finding something like: export const FinancialHubPage: React.FC<{ path: string; geo: UserGeo }> = ({ path, geo }) => {
    # It might vary slightly so use regex
    pattern_props = r'export const (FinancialHubPage|WalletArticlePage): React\.FC<\{.*?\}> = \(\{\s*path,\s*geo\s*\}\) => \{'
    replacement_props = r'export const \1: React.FC<{ path: string; geo: any; platforms: GamingPlatform[]; customPages: CustomPage[]; config: GlobalConfig }> = ({ path, geo, platforms, customPages, config }) => {'
    text = re.sub(pattern_props, replacement_props, text, flags=re.DOTALL)
    
    # 3. Replace <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full"> with the grid structure
    # Wait, FinancialHubPage uses max-w-6xl. Let's just find the <main> and wrap its CONTENTS minus the breadcrumbs and hero in a grid.
    # Actually, it's easier to find the <footer ...> and remove it
    footer_pattern = r'<!-- Footer -->\s*<footer.*?</footer>'
    text = re.sub(r'\{\/\*\s*Footer\s*\*\/\}.*?<footer.*?<\/footer>', '', text, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(text)

update_file('src/components/FinancialHubPage.tsx')
update_file('src/components/WalletArticlePage.tsx')

