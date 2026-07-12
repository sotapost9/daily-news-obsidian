# Obsidian統計ダッシュボード 📊

## 📈 ノート数の推移

```tracker
searchType: text
searchTarget: Obsidianノート数：\s*(\d+)
folder: 01_Fleeting Note/日記
datasetName: ノート数
line:
    title: "Obsidianノート数の推移"
    xAxisLabel: "日付"
    yAxisLabel: "ノート数"
    lineColor: "#4CAF50"
    fillGap: true
```

---

## 現在のノート数

```dataview
TABLE WITHOUT ID
    length(filter(file.lists, (l) => l.text)) as "総リスト数"
FROM ""
```

**総ノート数：** `$= dv.pages().length` 件

---

## 📅 直近30日のノート数（テーブル）

```dataviewjs
const pages = dv.pages('"01_Fleeting Note/日記"')
    .sort(p => p.file.name, 'desc')
    .limit(30);

const rows = [];
for (const page of pages) {
    const content = await dv.io.load(page.file.path);
    const match = content.match(/Obsidianノート数：\s*(\d+)/);
    if (match) {
        rows.push([page.file.link, match[1]]);
    }
}

dv.table(["日付", "ノート数"], rows);
```

---

## 🔗 関連
- [[SD]] - サービスデザインの知識体系
- 日記フォルダ: `01_Fleeting Note/日記`
