import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add ChevronUp, ChevronDown to imports
content = content.replace('  LayoutDashboard,', '  LayoutDashboard,\n  ChevronUp,\n  ChevronDown,')

# Add handleMovePlatform function
func_to_add = """  // Move Platform (Reorder)
  const handleMovePlatform = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...platforms];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      onSavePlatforms(updated);
    } else if (direction === 'down' && index < platforms.length - 1) {
      const updated = [...platforms];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      onSavePlatforms(updated);
    }
  };

  // Toggle Active/Inactive"""

content = content.replace('  // Toggle Active/Inactive', func_to_add)

# In the table head
content = content.replace('<th className="p-3">Platform</th>', '<th className="p-3">Rank</th>\n                      <th className="p-3">Platform</th>')

# In the table body
body_replace = """                    {platforms.map((p, index) => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          <div className="flex flex-col items-center gap-1 w-6">
                            <button
                              onClick={() => handleMovePlatform(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded hover:bg-slate-700 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-300'}`}
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <span className="font-mono text-xs text-slate-500 font-bold">{index + 1}</span>
                            <button
                              onClick={() => handleMovePlatform(index, 'down')}
                              disabled={index === platforms.length - 1}
                              className={`p-1 rounded hover:bg-slate-700 ${index === platforms.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-300'}`}
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 flex items-center gap-3">"""

content = re.sub(
    r'\{platforms\.map\(\s*p\s*=>\s*\(\n\s*<tr key=\{p\.id\} className="hover:bg-slate-800/30">\n\s*<td className="p-3 flex items-center gap-3">',
    body_replace,
    content
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
