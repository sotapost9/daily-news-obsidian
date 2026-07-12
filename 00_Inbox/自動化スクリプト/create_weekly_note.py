#!/usr/bin/env python3
"""
ウィークリーノート自動生成スクリプト
毎週土曜日に実行し、その週（月〜日）のデイリーノートを集約したウィークリーノートを作成

使い方:
  python3 create_weekly_note.py
  python3 create_weekly_note.py 2026-W03  # 特定の週を指定
"""

import os
import sys
import re
from datetime import datetime, timedelta

# ===== 設定 =====
VAULT_PATH = '/Users/sota.yamanaka/Documents/Obsidian Vault'
DAILY_NOTE_FOLDER = '01_Fleeting Note/日記'
WEEKLY_NOTE_FOLDER = '01_Fleeting Note/日記/週次'


def get_iso_week(date):
    """ISO週番号を取得"""
    return date.isocalendar()[1]


def get_iso_year(date):
    """ISO年を取得（週年）"""
    return date.isocalendar()[0]


def get_week_start(year, week):
    """ISO週の開始日（月曜日）を取得"""
    # ISO週1の月曜日を基準に計算
    jan_4 = datetime(year, 1, 4)
    # jan_4が含まれる週の月曜日
    week_1_monday = jan_4 - timedelta(days=jan_4.weekday())
    # 指定週の月曜日
    return week_1_monday + timedelta(weeks=week - 1)


def get_day_of_week(date):
    """日本語曜日を取得"""
    days = ['月', '火', '水', '木', '金', '土', '日']
    return days[date.weekday()]


def parse_daily_note(content):
    """デイリーノートの内容をパース"""
    # YAMLフロントマターを除去
    body_content = re.sub(r'^---[\s\S]*?---\s*', '', content)
    
    sections = {}
    section_order = []
    
    # ##見出しで分割
    parts = re.split(r'^##\s+', body_content, flags=re.MULTILINE)
    
    for part in parts:
        part = part.strip()
        if not part:
            continue
        
        lines = part.split('\n')
        header_name = lines[0].strip()
        body = '\n'.join(lines[1:]).strip()
        
        if not body:
            continue
        
        # 内容が空白行のみ、または "- " だけの行のみの場合はスキップ
        cleaned_body = re.sub(r'^\s*-\s*$', '', body, flags=re.MULTILINE).strip()
        if not cleaned_body:
            continue
        
        if header_name not in sections:
            sections[header_name] = body
            section_order.append(header_name)
    
    return sections, section_order


def generate_weekly_note(year, week):
    """ウィークリーノートを生成"""
    week_start = get_week_start(year, week)
    week_end = week_start + timedelta(days=6)
    
    daily_note_path = os.path.join(VAULT_PATH, DAILY_NOTE_FOLDER)
    
    # セクションごとの集約データ
    accumulated_sections = {}
    all_headers_order = []
    found_notes = 0
    
    # 7日間のデイリーノートを処理
    for i in range(7):
        current_date = week_start + timedelta(days=i)
        date_str = current_date.strftime('%Y-%m-%d')
        day_of_week = get_day_of_week(current_date)
        file_path = os.path.join(daily_note_path, f'{date_str}.md')
        
        if os.path.exists(file_path):
            found_notes += 1
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            sections, section_order = parse_daily_note(content)
            
            for header_name in section_order:
                if header_name not in accumulated_sections:
                    accumulated_sections[header_name] = []
                    all_headers_order.append(header_name)
                
                body = sections[header_name]
                # 引用形式で日付付きで追加
                quoted_body = '\n'.join(f'> {line}' for line in body.split('\n'))
                accumulated_sections[header_name].append(
                    f'> [!quote] [[{date_str}]] ({day_of_week})\n{quoted_body}'
                )
    
    # ノートの生成
    output = f"""---
tags: [weekly-review]
week: {year}-W{week:02d}
date-range: {week_start.strftime('%Y-%m-%d')} ~ {week_end.strftime('%Y-%m-%d')}
created: {datetime.now().strftime('%Y-%m-%d')}
---

# 📆 Weekly Note: {year}-W{week:02d}
**期間:** {week_start.strftime('%Y-%m-%d')} 〜 {week_end.strftime('%Y-%m-%d')}
**デイリーノート数:** {found_notes}/7

---

"""
    
    if not all_headers_order:
        output += '> [!warning] 今週のデイリーノートが見つかりませんでした、または内容が空です。\n'
    else:
        for header in all_headers_order:
            output += f'## {header}\n\n'
            output += '\n\n'.join(accumulated_sections[header])
            output += '\n\n'
    
    # 週の振り返りセクション
    output += """---

## 📊 週の振り返り

### 今週のハイライト
- 

### 来週に向けて
- 

"""
    
    return {
        'content': output,
        'file_name': f'{year}-W{week:02d}.md',
        'found_notes': found_notes
    }


def main():
    """メイン処理"""
    # コマンドライン引数から週を取得、または現在の週を使用
    year = None
    week = None
    
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        match = re.match(r'^(\d{4})-W(\d{1,2})$', arg)
        if match:
            year = int(match.group(1))
            week = int(match.group(2))
    
    if year is None or week is None:
        today = datetime.now()
        year = get_iso_year(today)
        week = get_iso_week(today)
    
    print(f'📆 ウィークリーノートを生成中: {year}-W{week:02d}')
    
    # 出力フォルダを作成
    output_folder = os.path.join(VAULT_PATH, WEEKLY_NOTE_FOLDER)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder, exist_ok=True)
        print(f'📁 フォルダを作成: {output_folder}')
    
    # ウィークリーノートを生成
    result = generate_weekly_note(year, week)
    output_path = os.path.join(output_folder, result['file_name'])
    
    # 既存ファイルのチェック
    if os.path.exists(output_path):
        print(f"⚠️  既存のウィークリーノートが存在します: {result['file_name']}")
        print('   上書きを避けるため、スキップします。')
        return
    
    # ファイルを書き込み
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(result['content'])
    
    print(f'✅ ウィークリーノートを作成しました: {output_path}')
    print(f"   デイリーノート: {result['found_notes']}件を集約")


if __name__ == '__main__':
    main()
