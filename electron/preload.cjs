const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  lockScreen: () => ipcRenderer.send('lock-screen'),
  unlockScreen: () => ipcRenderer.send('unlock-screen'),
  checkSystem: () => ipcRenderer.invoke('check-system'),
  onUsbViolation: (callback) => ipcRenderer.on('usb-violation', callback),
  onDisplayViolation: (callback) => ipcRenderer.on('display-violation', callback),
  removeListeners: () => {
    ipcRenderer.removeAllListeners('usb-violation');
    ipcRenderer.removeAllListeners('display-violation');
  }
});
