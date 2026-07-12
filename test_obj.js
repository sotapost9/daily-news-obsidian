const fs = require('fs');

const content = fs.readFileSync('/Users/sota.yamanaka/Documents/Obsidian Vault/日記/2026-03-28.md', 'utf8');
const lines = content.split(/\r?\n|\r|\n/g);

let todos = [];
for (let l = 0; l < lines.length; l++) {
  const line = lines[l];
  const match = line.match(/\s*[*+-] \[(.+?)\]/);
  if (match) {
    const checkboxContent = match[1];
    if (checkboxContent === ' ' && !['x', 'X', '-'].includes(checkboxContent[0])) {
      todos.push(line);
      // Let's pretend rolloverChildren is false
      // No children added
    }
  }
}

console.log("Found Unfinished Todos:");
for (let todo of todos) {
    console.log(todo);
}
