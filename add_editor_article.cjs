const fs = require('fs');
let code = fs.readFileSync('src/components/AiArticleManagerTab.tsx', 'utf8');

if (!code.includes('AffiliateLinksEditor')) {
  code = code.replace(/import \{ Plus, Trash2, Edit3, Save, Search, RefreshCw \} from 'lucide-react';/, "import { Plus, Trash2, Edit3, Save, Search, RefreshCw } from 'lucide-react';\nimport { AffiliateLinksEditor } from './AffiliateLinksEditor';");
  
  const target = `<div className="mb-4" data-color-mode="dark">`;
  const replacement = `
          <div className="mb-6">
            <AffiliateLinksEditor 
              links={editingArticle.affiliateLinks} 
              onChange={(links) => setEditingArticle({...editingArticle, affiliateLinks: links})} 
            />
          </div>
          
          <div className="mb-4" data-color-mode="dark">`;
  
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/AiArticleManagerTab.tsx', code);
}
