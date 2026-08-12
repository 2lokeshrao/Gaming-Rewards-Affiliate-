import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = """                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingPlatform.isActive !== false}
                        onChange={e => setEditingPlatform({ ...editingPlatform, isActive: e.target.checked })}
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <span>Active on Landing Page</span>
                    </label>
                  </div>"""

replacement = """                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingPlatform.isActive !== false}
                        onChange={e => setEditingPlatform({ ...editingPlatform, isActive: e.target.checked })}
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <span>Active on Landing Page</span>
                    </label>
                  </div>
                  {editingPlatform.isFeatured && (
                    <div className="pt-2">
                      <label className="block text-slate-400 font-bold text-[11px] mb-1">Featured Rank (Gold, Silver, Bronze)</label>
                      <select
                        value={editingPlatform.featuredRank || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingPlatform({ ...editingPlatform, featuredRank: val ? parseInt(val, 10) : null });
                        }}
                        className="w-full sm:w-1/2 bg-slate-900 border border-slate-800 rounded p-2 text-white text-xs font-medium focus:border-amber-500 outline-none"
                      >
                        <option value="">No Special Rank</option>
                        <option value="1">🥇 Rank 1: Gold</option>
                        <option value="2">🥈 Rank 2: Silver</option>
                        <option value="3">🥉 Rank 3: Bronze</option>
                      </select>
                    </div>
                  )}"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/AdminPanel.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find target")
