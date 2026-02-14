module.exports = async (tp) => {
  const files = tp.app.vault.getMarkdownFiles();
  return files.length;
};
