import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# 1. Update import
text = text.replace("import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication } from '../types';", "import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication, CustomPage } from '../types';")

# 2. Update AdminPanelProps
props_replacement = """  onSavePlatforms: (updated: GamingPlatform[]) => void;
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
  onUpdateSubPartnerStatus?: (id: string, status: 'approved' | 'contacted' | 'pending') => void;
  customPages?: CustomPage[];
  onSaveCustomPages?: (pages: CustomPage[]) => void;
}"""
text = re.sub(r'  onSavePlatforms: \(updated: GamingPlatform\[\]\) => void;\s*onSaveConfig: \(updatedConfig: GlobalConfig\) => void;\s*onUpdateSubPartnerStatus\?: \(id: string, status: \'approved\' \| \'contacted\' \| \'pending\'\) => void;\s*\}', props_replacement, text)

# 3. Update destructured props
text = re.sub(r'  onUpdateSubPartnerStatus\n\)', "  onUpdateSubPartnerStatus,\n  customPages,\n  onSaveCustomPages\n)", text)

# 4. Insert state and handlers for CustomPages
state_insertion = """  const [activeTab, setActiveTab] = useState<'dashboard' | 'partnerapi' | 'platforms' | 'config' | 'coupons' | 'analytics' | 'subpartners' | 'seo' | 'feedback' | 'pixels' | 'sitemap' | 'push' | 'abtest' | 'pages'>('dashboard');

  // CMS state
  const [pagesList, setPagesList] = useState<CustomPage[]>(customPages || []);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const handleAddOrUpdatePage = () => {
    if (!pageTitle || !pageSlug || !pageContent) return;
    
    let updated;
    if (editingPageId) {
      updated = pagesList.map(p => p.id === editingPageId ? { ...p, title: pageTitle, slug: pageSlug, content: pageContent } : p);
    } else {
      updated = [...pagesList, { id: 'page_' + Date.now(), slug: pageSlug, title: pageTitle, content: pageContent, isActive: true }];
    }
    setPagesList(updated);
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setEditingPageId(null);
  };

  const handleEditPage = (page: CustomPage) => {
    setEditingPageId(page.id);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageContent(page.content);
  };

  const handleDeletePage = (id: string) => {
    if(confirm('Are you sure you want to delete this page?')) {
      setPagesList(pagesList.filter(p => p.id !== id));
    }
  };

  const handleSavePages = () => {
    if (onSaveCustomPages) onSaveCustomPages(pagesList);
    alert('Pages saved successfully!');
  };"""

text = re.sub(r'  const \[activeTab, setActiveTab\] = useState<\'dashboard\' \| \'partnerapi\' \| \'platforms\' \| \'config\' \| \'coupons\' \| \'analytics\' \| \'subpartners\' \| \'seo\' \| \'feedback\' \| \'pixels\' \| \'sitemap\' \| \'push\' \| \'abtest\'>\(\'dashboard\'\);', state_insertion, text)

# Replace <Settings> component in the UI which is not imported
text = text.replace("<Settings className=\"w-4 h-4\" />", "<Edit3 className=\"w-4 h-4\" />")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)

with open('src/App.tsx', 'r') as f:
    app_text = f.read()

app_replacement = """        onUpdateSubPartnerStatus={handleUpdateSubPartnerStatus}
        customPages={customPages}
        onSaveCustomPages={setCustomPages}"""

app_text = re.sub(r'        onUpdateSubPartnerStatus=\{handleUpdateSubPartnerStatus\}\s*/>', app_replacement + '\n      />', app_text)

with open('src/App.tsx', 'w') as f:
    f.write(app_text)
