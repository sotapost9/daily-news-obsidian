<%*
// 1. 日付・週番号の計算
let year, week;
const fileName = tp.file.title;
const regex = /^(\d{4})-W(\d{1,2})$/;

if (regex.test(fileName)) {
    const match = fileName.match(regex);
    year = parseInt(match[1]);
    week = parseInt(match[2]);
} else {
    const today = moment();
    year = today.year();
    week = today.isoWeek();
}

const startDate = moment().year(year).isoWeek(week).startOf('isoWeek');
const dailyNoteFolder = "01_Fleeting Note/日記/";

tR += `# Weekly Note: ${year}-W${week.toString().padStart(2, '0')}\n`;
tR += `期間: ${startDate.format("YYYY-MM-DD")} 〜 ${startDate.clone().add(6, 'days').format("YYYY-MM-DD")}\n\n`;

// 2. セクションごとのデータ格納用オブジェクト
// { "📝学んだこと・反省": ["2026-01-12: ...", "2026-01-13: ..."], "LINEメモ": [...] }
const accumulatedSections = {};
const allHeadersOrder = []; // ヘッダーの出現順を保持

// 3. 1週間分のデイリーノートを巡回
for (let i = 0; i < 7; i++) {
    const currentDate = startDate.clone().add(i, 'days');
    const dateStr = currentDate.format("YYYY-MM-DD");
    const dayOfWeek = currentDate.format("ddd");
    const filePath = `${dailyNoteFolder}${dateStr}.md`;
    const file = app.vault.getAbstractFileByPath(filePath);

    if (file instanceof tp.obsidian.TFile) {
        // ノートの中身を読み込む
        const content = await app.vault.read(file);
        
        // YAMLフロントマターを削除
        const contentBody = content.replace(/^---[\s\S]*?---\s*/, "");

        // 見出し(## )で分割
        // splitの結果、要素0は最初の見出しより前のテキスト（通常は空）
        const parts = contentBody.split(/^##\s+/m);

        parts.forEach((part, index) => {
            if (!part.trim()) return; // 空ならスキップ

            // 最初の行が見出し名、それ以降が本文
            const lines = part.split("\n");
            const headerName = lines[0].trim();
            const body = lines.slice(1).join("\n").trim();

            if (!body) return; // 本文がなければスキップ

            // 初登場のヘッダーなら順序リストに追加
            if (!accumulatedSections[headerName]) {
                accumulatedSections[headerName] = [];
                allHeadersOrder.push(headerName);
            }

            // 日付付きで内容を追加
            // 箇条書きの階層などはそのまま維持される
            accumulatedSections[headerName].push(
                `> [!quote] [[${dateStr}]] (${dayOfWeek})\n` + 
                body.split("\n").map(l => `> ${l}`).join("\n") // 引用形式にして区別しやすくする
            );
        });
    }
}

// 4. 集計結果を書き出し
// 見つかったヘッダーの順番通りに出力（または固定順にしたい場合はここで指定も可能）
if (allHeadersOrder.length === 0) {
    tR += "今週のデイリーノートが見つかりませんでした、または内容が空です。\n";
} else {
    allHeadersOrder.forEach(header => {
        tR += `## ${header}\n\n`;
        tR += accumulatedSections[header].join("\n\n");
        tR += `\n\n`; // セクション間のスペース
    });
}
%>
