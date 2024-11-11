import { app, BrowserWindow, dialog, ipcMain } from "electron"
import { dirname, join } from "node:path"
import { fileURLToPath } from "url"
import { copyFiles } from "./copyFiles.js"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename) // get the name of the directory

let srcDir = null
let destDir = null
let mainWindow = null

app.on("ready", () => {
  ipcMain.handle("selectSrcDir", selectSrcDir)
  ipcMain.handle("selectDestDir", selectDestDir)
  ipcMain.handle("copyFiles", (event, fileNames) => {
    return ((srcDir, destDir) => {
      return copyFiles(event, fileNames, srcDir, destDir)
    })(srcDir, destDir)
  })

  mainWindow = new BrowserWindow({
    width: 440,
    height: 790,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  })

  mainWindow.loadFile(join("src", "index.html"))
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
