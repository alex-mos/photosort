const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("versions", {
  selectSrcDir: () => ipcRenderer.invoke("selectSrcDir"),
  selectDestDir: () => ipcRenderer.invoke("selectDestDir"),
  copyFiles: (filenames) => ipcRenderer.invoke("copyFiles", filenames),
})
