const sourceDirectoryElement = document.querySelector(".js-src-dir")
const destinationDirectoryElement = document.querySelector(".js-dest-dir")
const filenamesElement = document.querySelector(".js-filenames")

document.querySelector(".js-src-dir-picker").addEventListener("click", () => {
  chooseSourceDirectory()
})

document.querySelector(".js-dest-dir-picker").addEventListener("click", () => {
  chooseDestinationDirectory()
})

document.querySelector(".js-copy-button").addEventListener("click", () => {
  copyFiles()
})

async function chooseSourceDirectory() {
  const path = await window.versions.selectSrcDir()
  if (!path) return
  sourceDirectoryElement.innerText = path
}

async function chooseDestinationDirectory() {
  const path = await window.versions.selectDestDir()
  if (!path) return
  destinationDirectoryElement.innerText = path
}

async function copyFiles() {
  const filenames = filenamesElement.value.split("\n").filter((item) => item)
  const uniqueFilenames = [...new Set(filenames)]
  const report = await window.versions.copyFiles(uniqueFilenames)

  alert(report)
}
