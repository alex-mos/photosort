import { copyFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

import { createReport } from "./createReport.js"

export function copyFiles(event, filenames, srcDir, destDir) {
  if (!srcDir) return "Выберите исходную папку"
  if (!destDir) return "Выберите целевую папку"
  if (!filenames.length) return "Введите названия файлов"

  const srcDirfileList = readdirSync(srcDir)
  const destDirfileList = readdirSync(destDir)

  const alreadyExistedInDestDirFiles = []
  const notFoundFiles = []
  const duplicateFiles = []
  const copiedFiles = []

  for (let searchedName of filenames) {
    const foundInDestDir = destDirfileList.find((filename) => filename.includes(searchedName))
    if (foundInDestDir) {
      alreadyExistedInDestDirFiles.push(searchedName)
      continue
    }

    const foundInSrcDir = srcDirfileList.filter((filename) => filename.includes(searchedName))
    if (foundInSrcDir.length === 0) {
      notFoundFiles.push(searchedName)
      continue
    }

    if (foundInSrcDir.length > 1) {
      duplicateFiles.push(searchedName)
      continue
    }

    if (foundInSrcDir.length === 1) {
      try {
        copyFile(foundInSrcDir[0], srcDir, destDir)
        copiedFiles.push(foundInSrcDir[0])
      } catch (err) {
        return `Не удалось скопировать файл:\n${err.message}`
      }
    }
  }

  return createReport(alreadyExistedInDestDirFiles, notFoundFiles, duplicateFiles, copiedFiles)
}

function copyFile(filename, srcDir, destDir) {
  copyFileSync(join(srcDir, filename), join(destDir, filename))
}
