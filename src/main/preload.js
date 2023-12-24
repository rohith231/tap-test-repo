const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myapi', {
  request: (data) => ipcRenderer.send("request", {
    data,
  }),
  onResponse: (fn) => {
    // Deliberately strip event as it includes `sender` 
    ipcRenderer.on('response', (event, ...args) => fn(...args));
  }
})