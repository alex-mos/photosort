import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "url"
import { copyFiles } from "../copyFiles.js"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const srcDir = path.join(__dirname, "data", "src")
const destDir = path.join(__dirname, "data", "dest")
const _ = {}

describe("main process", () => {
  beforeAll(() => {
    createDir(path.join(srcDir))
    createDir(path.join(destDir))
    touchFile(path.join(srcDir, "IMG_3023.jpg"))
    touchFile(path.join(srcDir, "IMG_3028.jpg"))
    touchFile(path.join(srcDir, "IMG_3072.jpg"))
    touchFile(path.join(srcDir, "IMG_3079.jpg"))
    touchFile(path.join(srcDir, "IMG_3127.jpg"))
    touchFile(path.join(srcDir, "IMG_3156.jpg"))
  })

  afterAll(() => {
    removeDir(path.join(__dirname, "data"))
  })

  it("all files are copied", () => {
    const fileNames = ["3023", "IMG_3028"]
    const report = copyFiles(_, fileNames, srcDir, destDir)

    expect(fs.existsSync(path.join(srcDir, "IMG_3023.jpg"))).toBe(false)
    expect(fs.existsSync(path.join(destDir, "IMG_3023.jpg"))).toBe(true)
    expect(fs.existsSync(path.join(srcDir, "IMG_3028.jpg"))).toBe(false)
    expect(fs.existsSync(path.join(destDir, "IMG_3028.jpg"))).toBe(true)
    expect(report).toBe("✅ Успешно скопированы файлы:\n3023, IMG_3028.\n\n")
  })

  test("none files are found", () => {
    const fileNames = ["not", "found"]
    const report = copyFiles(_, fileNames, srcDir, destDir)

    expect(report).toBe("🤷‍♂️ Не найдены в исходной папке файлы:\nnot, found.\n\n")
  })

  test("file already exists in the destination directory", () => {
    const fileNames = ["IMG_3023"]
    const report = copyFiles(_, fileNames, srcDir, destDir)

    expect(fs.existsSync(path.join(srcDir, "IMG_3023.jpg"))).toBe(false)
    expect(fs.existsSync(path.join(destDir, "IMG_3023.jpg"))).toBe(true)
    expect(report).toBe("🤨 Уже были в целевой папке файлы:\nIMG_3023.\n\n")
  })

  test("found two files with matching name", () => {
    const fileNames = ["IMG_31", "IMG_307"]
    const report = copyFiles(_, fileNames, srcDir, destDir)
    expect(report).toBe("👯‍♀️ В исходной папке найдено несколько файлов с подходящим названием:\nIMG_31, IMG_307.\n\n")
  })
})

function touchFile(name) {
  let file = fs.openSync(name, "a")

  fs.closeSync(file)
}

function createDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function removeFile(name) {
  fs.rmSync(name)
}

function removeDir(dir) {
  fs.rmdirSync(dir, { recursive: true })
}
