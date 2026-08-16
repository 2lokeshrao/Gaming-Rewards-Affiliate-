const fs = require('fs');
let code = fs.readFileSync('src/components/CustomPageManagerTab.tsx', 'utf8');

if (!code.includes('AffiliateLinksEditor')) {
  code = code.replace(/import \{ Plus, Trash2, Edit3, Save, Globe \} from 'lucide-react';/, "import { Plus, Trash2, Edit3, Save, Globe } from 'lucide-react';\nimport { AffiliateLinksEditor } from './AffiliateLinksEditor';");
  
  const target = `<div className="mb-4" data-color-mode="dark">`;
  const replacement = `
          <div className="mb-6">
            <AffiliateLinksEditor 
              links={editingPage.affiliateLinks} 
              onChange={(links) => setEditingPage({...editingPage, affiliateLinks: links})} 
            />
          </div>
          
          <div className="mb-4" data-color-mode="dark">`;
  
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/CustomPageManagerTab.tsx', code);
}
