import re

files_to_check = [
    'src/components/ClaimWithQrModal.tsx',
    'src/components/PlatformFeedbackModal.tsx',
    'src/components/AdminDashboardTab.tsx'
]

for file_path in files_to_check:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # In ClaimWithQrModal.tsx:
    # <img loading="lazy" width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
    # Remove it entirely and replace the empty onError={(e) => {\n              }} with the proper logic if needed, or just remove the first one.
    
    # Let's simplify: replace the giant img tag chunk with a cleaner one.
    # ClaimWithQrModal
    if 'ClaimWithQrModal' in file_path:
        content = re.sub(
            r'<img loading="lazy" width="40" height="40" decoding="async" onError=\{\(e\) => \{.*?\}\}\n\s*src=\{platform\.logoUrl\}\n\s*alt=\{platform\.name\}\n\s*className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 shadow-md"\n\s*onError=\{(e) => \{\n\s*\}\}\n\s*/>',
            '''<img 
              loading="lazy" 
              decoding="async" 
              src={platform.logoUrl}
              alt={platform.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 shadow-md"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
            />''',
            content,
            flags=re.DOTALL
        )

    # PlatformFeedbackModal
    if 'PlatformFeedbackModal' in file_path:
        content = re.sub(
            r'<img loading="lazy" width="40" height="40" decoding="async" onError=\{\(e\) => \{.*?\}\}\n\s*src=\{platform\.logoUrl\}\n\s*alt=\{platform\.name\}\n\s*className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950"\n\s*onError=\{(e) => \{\n\s*\}\}\n\s*/>',
            '''<img 
              loading="lazy" 
              decoding="async" 
              src={platform.logoUrl}
              alt={platform.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
            />''',
            content,
            flags=re.DOTALL
        )

    # AdminDashboardTab
    if 'AdminDashboardTab' in file_path:
        content = re.sub(
            r'<img loading="lazy" width="40" height="40" decoding="async" onError=\{\(e\) => \{.*?\}\}\n\s*src=\{platformObj\?\.logoUrl \|\|.*?\}\n\s*alt=\{panel\.platformName\}\n\s*width="32"\n\s*height="32"\n\s*\n\s*decoding="async"\n\s*className="w-8 h-8 rounded-lg object-cover border border-slate-700 bg-slate-950"\n\s*/>',
            '''<img 
              loading="lazy" 
              decoding="async" 
              width="32"
              height="32"
              src={platformObj?.logoUrl || 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=80'}
              alt={panel.platformName}
              className="w-8 h-8 rounded-lg object-cover border border-slate-700 bg-slate-950"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
            />''',
            content,
            flags=re.DOTALL
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

