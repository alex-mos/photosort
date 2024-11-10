export function createReport(alreadyExistedInDestDirFiles, notFoundFiles, duplicateFiles, copiedFiles) {
  let report = ""

  if (alreadyExistedInDestDirFiles.length) {
    report += `🤨 Уже были в целевой папке файлы:\n${alreadyExistedInDestDirFiles.join(", ")}.\n\n`
  }
  if (notFoundFiles.length) {
    report += `🤷‍♂️ Не найдены в исходной папке файлы:\n${notFoundFiles.join(", ")}.\n\n`
  }
  if (duplicateFiles.length) {
    report += `👯‍♀️ В исходной папке найдено несколько файлов с подходящим названием:\n${duplicateFiles.join(", ")}.\n\n`
  }
  if (copiedFiles.length) {
    report += `✅ Успешно скопированы файлы:\n${copiedFiles.join(", ")}.\n\n`
  }

  return report
}
