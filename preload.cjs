// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// Expõe APIs seguras para o seu código React (renderer process)
contextBridge.exposeInMainWorld("electronAPI", {
  // Exemplo: como expor uma função que envia uma notificação
  // Você pode criar várias funções aqui para interagir com o backend
  sendNotification: (title, body) => {
    ipcRenderer.send("notify", { title, body });
  },
});
