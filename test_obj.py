import re

with open('/Users/sota.yamanaka/Documents/Obsidian Vault/日記/2026-03-28.md', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

todos = []
# simulate TodoParser.#isTodo
for line in lines:
    match = re.search(r'\s*[*+-] \[(.+?)\]', line)
    if match:
        content = match.group(1)
        if content == ' ' and not any(m in content for m in ['x', 'X', '-']):
            todos.append(line)

print("Found Unfinished Todos:")
for t in todos:
    print(t)
