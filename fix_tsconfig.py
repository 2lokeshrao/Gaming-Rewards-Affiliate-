import json

with open('tsconfig.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

if "exclude" not in config:
    config["exclude"] = []

if "dist" not in config["exclude"]:
    config["exclude"].append("dist")
    config["exclude"].append("node_modules")

with open('tsconfig.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)
