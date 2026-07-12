import os
import re
from datetime import datetime

vault_path = '/Users/sota.yamanaka/Documents/Obsidian Vault'
folder = '日記/'
format_pattern = '%Y-%m-%d'

daily_notes = []
for root, dirs, files in os.walk(os.path.join(vault_path, folder)):
    for file in files:
        if file.endswith('.md'):
            basename = file[:-3]
            try:
                dt = datetime.strptime(basename, format_pattern)
                if dt <= datetime.today():
                    daily_notes.append((dt, file))
            except ValueError:
                pass

daily_notes.sort(key=lambda x: x[0], reverse=True)
print("Sorted Daily Notes:")
for dt, file in daily_notes[:5]:
    print(dt.strftime(format_pattern), file)

if len(daily_notes) >= 2:
    print("getLastDailyNote would return:", daily_notes[1][1])
else:
    print("getLastDailyNote would return None")
