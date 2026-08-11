import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add Activity to lucide-react imports
content = content.replace('import {\n  LayoutDashboard,', 'import {\n  LayoutDashboard,\n  Activity,')

# Add truncateSeoText function before the return statement inside AdminPanel component
# Let's just find where we use it and define it. Wait, the easiest is to define it at the top of the component or outside.
helper = """
// Helper to truncate text
const truncateSeoText = (text: string | undefined, max: number) => {
  if (!text) return '';
  if (text.length <= max) return text;
  const truncated = text.substring(0, max - 3).trim();
  return `${truncated}...`;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({"""

content = content.replace("export const AdminPanel: React.FC<AdminPanelProps> = ({", helper)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
