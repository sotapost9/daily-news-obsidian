#!/bin/bash
# LINEメモをデイリーノートの ## LINEメモ セクションに追記するスクリプト
# 対象日付は引数で指定可（省略時は今日）

VAULT="/Users/sota.yamanaka/Documents/Obsidian Vault"
DATE="${1:-$(date +%Y-%m-%d)}"

FLEETING_FILE="${VAULT}/01_Fleeting Note/日記/${DATE}.md"
DAILY_FILE="${VAULT}/日記/${DATE}.md"
TMP_CONTENT="/tmp/line-content-${DATE}.txt"
TMP_DAILY="/tmp/line-daily-${DATE}.tmp"

# ソースファイルが存在しなければ終了
if [ ! -f "$FLEETING_FILE" ]; then
  echo "[$(date)] No LINE memo file for ${DATE}, skipping." >> /tmp/line-sync.log
  exit 0
fi

# デイリーノートが存在しなければ終了
if [ ! -f "$DAILY_FILE" ]; then
  echo "[$(date)] Daily note not found: ${DAILY_FILE}" >> /tmp/line-sync.log
  exit 1
fi

# frontmatterを除いたコンテンツをtempfileに書き出す
awk '
  BEGIN { in_front=0; past_front=0 }
  /^---$/ && !past_front { in_front=!in_front; if(!in_front) past_front=1; next }
  past_front { print }
' "$FLEETING_FILE" > "$TMP_CONTENT"

# コンテンツが空なら終了
if [ ! -s "$TMP_CONTENT" ] || ! grep -q '[^[:space:]]' "$TMP_CONTENT"; then
  echo "[$(date)] No content to sync for ${DATE}." >> /tmp/line-sync.log
  rm -f "$TMP_CONTENT"
  exit 0
fi

# 既に同期済みかチェック（空行を除いた最初の行で比較）
FIRST_LINE=$(grep -v '^[[:space:]]*$' "$TMP_CONTENT" | head -1)
if grep -qF "$FIRST_LINE" "$DAILY_FILE"; then
  echo "[$(date)] Already synced for ${DATE}, skipping." >> /tmp/line-sync.log
  rm -f "$TMP_CONTENT"
  exit 0
fi

# ## LINEメモ セクションの後にコンテンツを挿入
if grep -q "^## LINEメモ" "$DAILY_FILE"; then
  # ## LINEメモ 行の直後にコンテンツを差し込む
  awk -v content_file="$TMP_CONTENT" '
    /^## LINEメモ/ {
      print
      while ((getline line < content_file) > 0) print line
      close(content_file)
      next
    }
    { print }
  ' "$DAILY_FILE" > "$TMP_DAILY" && mv "$TMP_DAILY" "$DAILY_FILE"
else
  printf "\n## LINEメモ\n" >> "$DAILY_FILE"
  cat "$TMP_CONTENT" >> "$DAILY_FILE"
fi

echo "[$(date)] Synced LINE memo for ${DATE} to daily note." >> /tmp/line-sync.log
rm -f "$TMP_CONTENT"
