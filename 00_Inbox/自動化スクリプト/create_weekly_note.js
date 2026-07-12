#!/usr/bin/env node
/**
 * ウィークリーノート自動生成スクリプト
 * 毎週土曜日に実行し、その週（月〜日）のデイリーノートを集約したウィークリーノートを作成
 * 
 * 使い方:
 *   node create_weekly_note.js
 *   node create_weekly_note.js 2026-W03  # 特定の週を指定
 */

const fs = require('fs');
const path = require('path');

// ===== 設定 =====
const VAULT_PATH = '/Users/sota.yamanaka/Documents/Obsidian Vault';
const DAILY_NOTE_FOLDER = '01_Fleeting Note/日記';
const WEEKLY_NOTE_FOLDER = '01_Fleeting Note/日記/週次';

// ===== ユーティリティ関数 =====

/**
 * ISO週番号を取得
 */
function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * ISO週の開始日（月曜日）を取得
 */
function getWeekStart(year, week) {
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() || 7;
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
    return weekStart;
}

/**
 * 日付をYYYY-MM-DD形式でフォーマット
 */
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * 曜日を取得
 */
function getDayOfWeek(date) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
}

/**
 * デイリーノートの内容をパース
 */
function parseDailyNote(content) {
    // YAMLフロントマターを除去
    const bodyContent = content.replace(/^---[\s\S]*?---\s*/, '');
    
    // ##見出しで分割
    const sections = {};
    const sectionOrder = [];
    const parts = bodyContent.split(/^##\s+/m);
    
    parts.forEach(part => {
        if (!part.trim()) return;
        
        const lines = part.split('\n');
        const headerName = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();
        
        if (!body) return;
        
        // 内容が空白行のみの場合はスキップ
        if (body.replace(/^\s*-\s*$/gm, '').trim() === '') return;
        
        if (!sections[headerName]) {
            sections[headerName] = body;
            sectionOrder.push(headerName);
        }
    });
    
    return { sections, sectionOrder };
}

/**
 * ウィークリーノートを生成
 */
function generateWeeklyNote(year, week) {
    const weekStart = getWeekStart(year, week);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const dailyNotePath = path.join(VAULT_PATH, DAILY_NOTE_FOLDER);
    
    // セクションごとの集約データ
    const accumulatedSections = {};
    const allHeadersOrder = [];
    let foundNotes = 0;
    
    // 7日間のデイリーノートを処理
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + i);
        const dateStr = formatDate(currentDate);
        const dayOfWeek = getDayOfWeek(currentDate);
        const filePath = path.join(dailyNotePath, `${dateStr}.md`);
        
        if (fs.existsSync(filePath)) {
            foundNotes++;
            const content = fs.readFileSync(filePath, 'utf8');
            const { sections, sectionOrder } = parseDailyNote(content);
            
            sectionOrder.forEach(headerName => {
                if (!accumulatedSections[headerName]) {
                    accumulatedSections[headerName] = [];
                    allHeadersOrder.push(headerName);
                }
                
                const body = sections[headerName];
                // 引用形式で日付付きで追加
                const quotedBody = body.split('\n').map(l => `> ${l}`).join('\n');
                accumulatedSections[headerName].push(
                    `> [!quote] [[${dateStr}]] (${dayOfWeek})\n${quotedBody}`
                );
            });
        }
    }
    
    // ノートの生成
    let output = `---
tags: [weekly-review]
week: ${year}-W${String(week).padStart(2, '0')}
date-range: ${formatDate(weekStart)} ~ ${formatDate(weekEnd)}
created: ${formatDate(new Date())}
---

# 📆 Weekly Note: ${year}-W${String(week).padStart(2, '0')}
**期間:** ${formatDate(weekStart)} 〜 ${formatDate(weekEnd)}
**デイリーノート数:** ${foundNotes}/7

---

`;
    
    if (allHeadersOrder.length === 0) {
        output += '> [!warning] 今週のデイリーノートが見つかりませんでした、または内容が空です。\n';
    } else {
        allHeadersOrder.forEach(header => {
            output += `## ${header}\n\n`;
            output += accumulatedSections[header].join('\n\n');
            output += '\n\n';
        });
    }
    
    // 週の振り返りセクション
    output += `---

## 📊 週の振り返り

### 今週のハイライト
- 

### 来週に向けて
- 

`;
    
    return {
        content: output,
        fileName: `${year}-W${String(week).padStart(2, '0')}.md`,
        foundNotes
    };
}

// ===== メイン処理 =====
function main() {
    // コマンドライン引数から週を取得、または現在の週を使用
    let year, week;
    
    const arg = process.argv[2];
    if (arg && /^\d{4}-W\d{1,2}$/.test(arg)) {
        const match = arg.match(/^(\d{4})-W(\d{1,2})$/);
        year = parseInt(match[1]);
        week = parseInt(match[2]);
    } else {
        const today = new Date();
        year = today.getFullYear();
        week = getISOWeek(today);
    }
    
    console.log(`📆 ウィークリーノートを生成中: ${year}-W${String(week).padStart(2, '0')}`);
    
    // 出力フォルダを作成
    const outputFolder = path.join(VAULT_PATH, WEEKLY_NOTE_FOLDER);
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
        console.log(`📁 フォルダを作成: ${outputFolder}`);
    }
    
    // ウィークリーノートを生成
    const { content, fileName, foundNotes } = generateWeeklyNote(year, week);
    const outputPath = path.join(outputFolder, fileName);
    
    // 既存ファイルのチェック
    if (fs.existsSync(outputPath)) {
        console.log(`⚠️  既存のウィークリーノートが存在します: ${fileName}`);
        console.log(`   上書きを避けるため、スキップします。`);
        return;
    }
    
    // ファイルを書き込み
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ ウィークリーノートを作成しました: ${outputPath}`);
    console.log(`   デイリーノート: ${foundNotes}件を集約`);
}

main();
