// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Função para criar a janela principal
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Anexa o script de preload à janela
      preload: path.join(__dirname, "preload.cjs"),
      // NOTA: nodeIntegration e contextIsolation são configurados para
      // segurança. Não mude a menos que saiba o que está fazendo.
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Carrega o arquivo index.html da sua build do React
  win.loadFile(path.join(__dirname, "dist", "index.html"));

  // Opcional: Abre as ferramentas de desenvolvedor (DevTools)
  //win.webContents.openDevTools();
}

// Este método é chamado quando o Electron finaliza a inicialização
app.whenReady().then(() => {
  createWindow();

  // Garante que uma janela seja recriada no macOS ao clicar no ícone do dock
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Encerra a aplicação quando todas as janelas são fechadas (exceto no macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
