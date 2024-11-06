import { app, BrowserWindow, dialog, ipcMain } from "electron"
import { dirname, join } from "node:path"
import { renameSync, readdirSync } from "node:fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename) // get the name of the directory

let srcDir = null
let destDir = null
let mainWindow = null

app.on("ready", () => {
  ipcMain.handle("selectSrcDir", selectSrcDir)
  ipcMain.handle("selectDestDir", selectDestDir)
  ipcMain.handle("copyFiles", copyFiles)

  mainWindow = new BrowserWindow({
    // width: 440,
    width: 1040,
    height: 860,
    // height: 760,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  })

  mainWindow.loadFile(join("src", "index.html"))

  // todo: remove
  mainWindow.webContents.openDevTools()
})

async function selectSrcDir() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  })
  if (result.filePaths.length) {
    srcDir = result.filePaths[0]
  }
  return srcDir
}

async function selectDestDir() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  })
  if (result.filePaths.length) {
    destDir = result.filePaths[0]
  }
  return destDir
}

export function copyFiles(event, filenames) {
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
        copyFile(foundInSrcDir[0])
        copiedFiles.push(searchedName)
      } catch (err) {
        return `Не удалось скопировать файл:\n${err.message}`
      }
    }
  }

  return createReport(alreadyExistedInDestDirFiles, notFoundFiles, duplicateFiles, copiedFiles)
}

function copyFile(filename) {
  renameSync(join(srcDir, filename), join(destDir, filename))
}

function createReport(alreadyExistedInDestDirFiles, notFoundFiles, duplicateFiles, copiedFiles) {
  let report = ""

  if (alreadyExistedInDestDirFiles.length) {
    report += `🤨 Уже были в целевой папке файлы:\n${alreadyExistedInDestDirFiles.join(", ")}.\n\n`
  }
  if (notFoundFiles.length) {
    report += `🤷‍♂️ Не найдены в исходной папке файлы:\n${notFoundFiles.join(", ")}.\n\n`
  }
  if (duplicateFiles.length) {
    report += `👯‍♀️ В исходной папке найдено несколько файлов с подходящим названием:\n${alreadyExistedInDestDirFiles.join(", ")}.\n\n`
  }
  if (copiedFiles.length) {
    report += `✅ Успешно скопированы файлы:\n${copiedFiles.join(", ")}.\n\n`
  }

  return report
}
