/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 197);
/******/ })
/************************************************************************/
/******/ ({

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fs__);


class FileManager {
  constructor() {
    this.filePath = "";
  }

  // TODO: 同期にする方がわかりやすいという指摘に対応する
  saveFile(filePath, text) {
    return new Promise(resolve => {
      __WEBPACK_IMPORTED_MODULE_0_fs___default.a.writeFileSync(filePath, text);
      this.filePath = filePath;
      resolve();
    });
  }

  readFile(filePath) {
    return new Promise(resolve => {
      const text = __WEBPACK_IMPORTED_MODULE_0_fs___default.a.readFileSync(filePath, "utf8");
      this.filePath = filePath;
      resolve(text);
    });
  }

  overwriteFile(text) {
    // return new Promise((resolve) => {
    return this.saveFile(this.filePath, text);
    // .then(resolve());
    // });
  }

  writePdf(filePath, pdf) {
    return new Promise(resolve => {
      __WEBPACK_IMPORTED_MODULE_0_fs___default.a.writeFileSync(filePath, pdf);
      resolve();
    });
  }
}

function createFileManager() {
  return new FileManager();
}

/* harmony default export */ __webpack_exports__["a"] = createFileManager;

/***/ }),

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);


class MainWindow {
    constructor() {
        this.window = new __WEBPACK_IMPORTED_MODULE_0_electron__["BrowserWindow"]({ width: 800, height: 600 });
        this.window.loadURL(`file://${__dirname}/../../index.html`);
        this.window.on("closed", () => {
            this.window = null;
        });
    }

    requestText() {
        return new Promise(resolve => {
            this.window.webContents.send("REQUEST_TEXT");
            __WEBPACK_IMPORTED_MODULE_0_electron__["ipcMain"].once("REPLY_TEXT", (_e, text) => resolve(text));
        });
    }

    sendText(text) {
        this.window.webContents.send("SEND_TEXT", text);
    }
}

function createMainWindow() {
    return new MainWindow();
}

/* harmony default export */ __webpack_exports__["a"] = createMainWindow;

/***/ }),

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_events__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_events__);




class PDFWindow extends __WEBPACK_IMPORTED_MODULE_1_events___default.a {
  constructor(text) {
    super();
    this.window = new __WEBPACK_IMPORTED_MODULE_0_electron__["BrowserWindow"]({ show: true });
    this.window.loadURL(`file://${__dirname}/../../pdf.html`);
    __WEBPACK_IMPORTED_MODULE_0_electron__["ipcMain"].once("REQUEST_TEXT", e => {
      e.returnValue = text;
    });
    __WEBPACK_IMPORTED_MODULE_0_electron__["ipcMain"].once("RENDERED_CONTENTS", () => {
      this.emit("RENDERED_CONTENTS");
    });
  }

  generatePDF() {
    return new Promise((resolve, reject) => {
      this.window.webContents.printToPDF({}, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  close() {
    this.window.close();
    this.window.on("closed", () => {
      this.window = null;
    });
  }
}

function createPDFWindow(contents, fileManager) {
  return new PDFWindow(contents, fileManager);
}

/* harmony default export */ __webpack_exports__["a"] = createPDFWindow;

/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);


function setAppMenu(options) {
  const template = [{
    label: "File",
    submenu: [{ label: "Open", accelerator: "CmdOrCtrl+O", click: () => options.openFile() }, { label: "Save", accelerator: "CmdOrCtrl+S", click: () => options.saveFile() }, { label: "Save As...", click: () => options.saveAsNewFile() }, { label: "Export PDF", click: () => options.exportPDF() }]
  }, {
    label: "Edit",
    submenu: [{ label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" }, { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" }, { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" }, { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall" }]
  }, {
    label: "View",
    submenu: [{
      label: "Toggle DevTools",
      accelerator: "Alt+Command+I",
      click: () => __WEBPACK_IMPORTED_MODULE_0_electron__["BrowserWindow"].getFocusedWindow().toggleDevTools()
    }]
  }];
  if (process.platform === "darwin") {
    template.unshift({
      label: "MarkdownEditor",
      submenu: [{ label: "Quit", accelerator: "CmdOrCtrl+Q", click: () => __WEBPACK_IMPORTED_MODULE_0_electron__["app"].quit() }]
    });
  }
  __WEBPACK_IMPORTED_MODULE_0_electron__["Menu"].setApplicationMenu(__WEBPACK_IMPORTED_MODULE_0_electron__["Menu"].buildFromTemplate(template));
}
/* harmony default export */ __webpack_exports__["a"] = setAppMenu;

/***/ }),

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);


function showOpenFileDialog() {
  return new Promise((resolve, reject) => {
    const files = __WEBPACK_IMPORTED_MODULE_0_electron__["dialog"].showOpenDialog({
      title: "open",
      properties: ["openFile"],
      filters: [{ name: "markdown file", extensions: ["md"] }]
    });

    if (files && files.length > 0) {
      resolve(files[0]);
    } else {
      reject();
    }
  });
}

/* harmony default export */ __webpack_exports__["a"] = showOpenFileDialog;

/***/ }),

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);


function showSaveAsNewFileDialog() {
  return new Promise((resolve, reject) => {
    const file = __WEBPACK_IMPORTED_MODULE_0_electron__["dialog"].showSaveDialog({
      title: "save",
      filters: [{ name: "markdown file", extensions: ["md"] }]
    });
    if (file) {
      resolve(file);
    } else {
      reject();
    }
  });
}

/* harmony default export */ __webpack_exports__["a"] = showSaveAsNewFileDialog;

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ 196:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__createMainWindow__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__setAppMenu__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__showSaveAsNewFileDialog__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__createFileManager__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__showOpenFileDialog__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__createPDFWindow__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__showExportPDFDialog__ = __webpack_require__(201);
// Electronのモジュール









// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;
let fileManager = null;

function openFile() {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__showOpenFileDialog__["a" /* default */])().then(filePath => fileManager.readFile(filePath)).then(text => mainWindow.sendText(text)).catch(error => {
    console.log(error);
  });
}

function saveFile() {
  if (!fileManager.filePath) {
    saveAsNewFile();
    return;
  }
  mainWindow.requestText().then(text => fileManager.overwriteFile(text)).catch(error => {
    console.log(error);
  });
}

function saveAsNewFile() {
  Promise.all([__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__showSaveAsNewFileDialog__["a" /* default */])(), mainWindow.requestText()]).then(([filePath, text]) => fileManager.saveFile(filePath, text)).catch(error => {
    console.log(error);
  });
}

function exportPDF() {
  Promise.all([__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__showExportPDFDialog__["a" /* default */])(), mainWindow.requestText()]).then(([filePath, text]) => {
    const pdfWindow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__createPDFWindow__["a" /* default */])(text);
    pdfWindow.on("RENDERED_CONTENTS", () => {
      pdfWindow.generatePDF().then(pdf => fileManager.writePdf(filePath, pdf)).then(() => pdfWindow.close()).catch(error => {
        console.log(error);
        pdfWindow.close();
      });
    });
  }).catch(error => {
    console.log(error);
  });
}

// Electronの初期化完了後に実行
__WEBPACK_IMPORTED_MODULE_0_electron__["app"].on('ready', () => {
  // メイン画面の表示
  mainWindow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__createMainWindow__["a" /* default */])();
  fileManager = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__createFileManager__["a" /* default */])();
  const options = { openFile, saveFile, saveAsNewFile, exportPDF };
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__setAppMenu__["a" /* default */])(options);
});

// 全てのウィンドウが閉じたら終了
__WEBPACK_IMPORTED_MODULE_0_electron__["app"].on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    __WEBPACK_IMPORTED_MODULE_0_electron__["app"].quit();
  }
});

__WEBPACK_IMPORTED_MODULE_0_electron__["app"].on("activate", (_e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    mainWindow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__createMainWindow__["a" /* default */])();
  }
});

/***/ }),

/***/ 200:
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);


function showExportPDFDialog() {
  return new Promise((resolve, reject) => {
    const file = __WEBPACK_IMPORTED_MODULE_0_electron__["dialog"].showSaveDialog({
      title: "export as PDF",
      filters: [{
        name: "pdf file",
        extensions: ["pdf"]
      }]
    });
    if (file) {
      resolve(file);
    } else {
      reject();
    }
  });
}

/* harmony default export */ __webpack_exports__["a"] = showExportPDFDialog;

/***/ })

/******/ });
//# sourceMappingURL=index.js.map