---
tags: [weekly-review]
week: 2025-W38
date-range: 2025-09-15 ~ 2025-09-21
---
---
# 🗓 Weekly Review 


```dataviewjs
//----------------------------------------------------
// 設定：今週の開始日と終了日
//----------------------------------------------------
const weekStart = "2025-09-15";
const weekEnd = "2025-09-21";

// 週のDailyノートを取得
const pages = dv.pages('"02_Daily"')
  .where(p => p.file.name >= weekStart && p.file.name <= weekEnd);

//----------------------------------------------------
// ✅ よかったこと
//----------------------------------------------------
dv.header(2, "✅ よかったこと（集約）");
pages.forEach(p => {
  const matches = p.file.content.match(/## ✅ よかったこと([\s\S]*?)(?=##|$)/);
  if (matches) {
    dv.header(3, p.file.name);
    dv.paragraph(matches[1]);
  }
});

//----------------------------------------------------
// 🤔 反省点
//----------------------------------------------------
dv.header(2, "🤔 反省点（集約）");
pages.forEach(p => {
  const matches = p.file.content.match(/## 🤔 反省点([\s\S]*?)(?=##|$)/);
  if (matches) {
    dv.header(3, p.file.name);
    dv.paragraph(matches[1]);
  }
});

//----------------------------------------------------
// 📚 インプット
//----------------------------------------------------
dv.header(2, "📚 インプット（合計）");
const inputs = ["本：","動画：","記事：","ポッドキャスト："];
inputs.forEach(key => {
  const results = pages.flatMap(p => p.file.content.match(new RegExp(`- ${key}.*`, "g")) ?? []);
  if (results.length) {
    dv.header(3, key.replace("：",""));
    dv.list(results);
  }
});

//----------------------------------------------------
// 🧠 Empathy10レビュー
//----------------------------------------------------
dv.header(2, "🧠 Empathy10レビュー");
const empathyChecks = [
  "今ココに集中する","好奇心の残量を枯らさない","開いて広げる","閉じて整える",
  "自愛を惜しまない","遊びに身を委ねる","自他の境界を柔らかくする","同期を愉しむ","ジャッジしない"
];
const results = empathyChecks.map(e => {
  const count = pages
    .map(p => (p.file.content.match(new RegExp(`- \\[x\\] ${e}`, "g")) || []).length)
    .reduce((a,b) => a+b, 0);
  return [e, count];
});
dv.table(["Empathy10項目", "実施回数"], results);

//----------------------------------------------------
// 🏋️ 習慣サマリ
//----------------------------------------------------
dv.header(2, "🏋️ 習慣サマリ");
const trainingCount = pages.filter(p => p.file.content.includes("- [x] 筋トレ")).length;
const meditationCount = pages.filter(p => p.file.content.includes("- [x] 瞑想")).length;
dv.table(["習慣", "回数"], [
  ["筋トレ", trainingCount + " / 7"],
  ["瞑想", meditationCount + " / 7"]
]);

//----------------------------------------------------
// 📊 知的生産サマリ
//----------------------------------------------------
dv.header(2, "📊 知的生産サマリ");

// 今週作成されたノート数
const allNotes = dv.pages()
  .where(p => p.file.cday >= dv.date(weekStart) && p.file.cday <= dv.date(weekEnd));
const fleetingNotes = allNotes.where(p => p.file.path.includes("01_Fleeting"));
const literatureNotes = allNotes.where(p => p.file.path.includes("02_Literature"));
const permanentNotes = allNotes.where(p => p.file.path.includes("03_Permanent"));

dv.table(["カテゴリ", "今週の作成数"], [
  ["Fleeting Note", fleetingNotes.length],
  ["Literature Note", literatureNotes.length],
  ["Permanent Note", permanentNotes.length],
  ["合計", allNotes.length]
]);

// 今週作成したPermanent Note一覧
if (permanentNotes.length > 0) {
  dv.header(3, "✨ 今週のPermanent Note");
  dv.list(permanentNotes.map(p => p.file.link));
}