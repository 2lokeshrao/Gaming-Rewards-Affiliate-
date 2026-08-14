import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

if "import MDEditor from" not in text:
    text = text.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport MDEditor from '@uiw/react-md-editor';")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
