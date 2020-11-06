// Electronのモジュール
import { app } from "electron";
import createMainWindow from "./createMainWindow";
import setAppMenu from "./setAppMenu";
import showSaveAsNewFileDialog from "./showSaveAsNewFileDialog";
import createFileManager from "./createFileManager";
import showOpenFileDialog from "./showOpenFileDialog";
import createPDFWindow from "./createPDFWindow";
import showExportPDFDialog from "./showExportPDFDialog";

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;
let fileManager = null;

function openFile() {
  showOpenFileDialog()
    .then((filePath) => fileManager.readFile(filePath))
    .then((text) => mainWindow.sendText(text))
    .catch((error) => {
      console.log(error);
    });
}

function saveFile() {
  if (!fileManager.filePath) {
    saveAsNewFile();
    return;
  }
  mainWindow.requestText()
    .then((text) => fileManager.overwriteFile(text))
    .catch((error) => {
      console.log(error);
    });
}

function saveAsNewFile() {
  Promise.all([ showSaveAsNewFileDialog(), mainWindow.requestText() ])
  .then(([filePath, text]) => fileManager.saveFile(filePath, text))
  .catch((error) => {
    console.log(error);
  });
}

function exportPDF() {
  Promise.all([ showExportPDFDialog(), mainWindow.requestText() ])
    .then(([filePath, text]) => {
      const pdfWindow = createPDFWindow(text);
      pdfWindow.on("RENDERED_CONTENTS", () => {
        pdfWindow.generatePDF()
          .then((pdf) => fileManager.writePdf(filePath, pdf))
          .then(() => pdfWindow.close())
          .catch((error) => {
            console.log(error);
            pdfWindow.close();
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// Electronの初期化完了後に実行
app.on('ready', () => {
    // メイン画面の表示
    mainWindow = createMainWindow();
    fileManager = createFileManager();
    const options = { openFile, saveFile, saveAsNewFile, exportPDF };
    setAppMenu(options);
  });

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on("activate", (_e, hasVisibleWindows) => {
    if (!hasVisibleWindows) {
        mainWindow = createMainWindow();
    }
});