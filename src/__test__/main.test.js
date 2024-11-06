import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "url"
// import { copyFiles } from "../main.js"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const srcDir = path.join(__dirname, "data", "src")
const destDir = path.join(__dirname, "data", "dest")

describe("main process", () => {
  beforeEach(() => {
    touchFile(path.join(srcDir, "IMG_3023.jpg"))
    touchFile(path.join(srcDir, "IMG_3028.jpg"))
    touchFile(path.join(srcDir, "IMG_3050.jpg"))
    touchFile(path.join(srcDir, "IMG_3072.jpg"))
    touchFile(path.join(srcDir, "IMG_3079.jpg"))
    touchFile(path.join(srcDir, "IMG_3127.jpg"))
    touchFile(path.join(srcDir, "IMG_3156.jpg"))
  });

  afterEach(() => {
    clearDir(srcDir)
    clearDir(destDir)
  });

  test("all files are copied", () => {
    
  })

  test("none files are found", () => {
    
  })

  test("file already exists in the destination directory", () => {
    
  })

  test("found two files with matching name", () => {
    
  })

  test("found two files with matching name", () => {
    
  })
})

function touchFile(name) {
  let file = fs.openSync(name, 'a');
  fs.closeSync(file);
}

function clearDir(name) {
  const dirFileList = fs.readdirSync(name)
  for (const file of dirFileList) {
    removeFile(file)
  }
}

function removeFile(name) {
  fs.rmSync(name, {
      force: true,
  });
}
