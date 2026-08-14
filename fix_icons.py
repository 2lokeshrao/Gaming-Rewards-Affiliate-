import re

with open('src/components/AiArticleManagerTab.tsx', 'r') as f:
    text = f.read()
text = text.replace('import { Sparkles, Save, Edit3, Trash2, Globe, TrendingUp, CheckCircle2, FileText, Image as ImageIcon } from \'lucide-react\';', 'import { Sparkles, Save, Edit3, Trash2, Globe, TrendingUp, CheckCircle2, FileText, Image as ImageIcon, RefreshCw } from \'lucide-react\';')
with open('src/components/AiArticleManagerTab.tsx', 'w') as f:
    f.write(text)

with open('src/components/FooterManagerTab.tsx', 'r') as f:
    text = f.read()
text = text.replace('import { Menu, Plus, Trash2, Save, Link as LinkIcon, Edit3 } from \'lucide-react\';', 'import { Menu, Plus, Trash2, Save, Link as LinkIcon, Edit3, CheckCircle2 } from \'lucide-react\';')
with open('src/components/FooterManagerTab.tsx', 'w') as f:
    f.write(text)

with open('src/components/CustomPageView.tsx', 'r') as f:
    text = f.read()
text = text.replace('payment: false', '')
with open('src/components/CustomPageView.tsx', 'w') as f:
    f.write(text)

