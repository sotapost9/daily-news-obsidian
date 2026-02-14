// vault_note_count.js
module.exports = async (tp) => {
  const dv = app.plugins?.plugins?.dataview?.api;
  if (dv) return dv.pages().length;
  return app.vault.getMarkdownFiles().length;
};
