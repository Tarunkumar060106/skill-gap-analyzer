const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');
let usbDetect = null; // Disabled due to native binary crash on Windows

let mainWindow;
let isProctoring = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // Vite builds into dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function enforceProctoring() {
  if (!mainWindow) return;
  isProctoring = true;

  // 1. Lock Screen (Kiosk mode forces topmost and fullscreen native overrides)
  mainWindow.setKiosk(true);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setFullScreen(true);

  // 2. Check for Multiple Monitors
  const displays = screen.getAllDisplays();
  if (displays.length > 1) {
    mainWindow.webContents.send('display-violation', 'Multiple monitors detected. Please disconnect secondary displays.');
  }

  // 3. Block Exiting Shortcuts
  globalShortcut.register('CommandOrControl+Tab', () => {});
  globalShortcut.register('Alt+Tab', () => {});
  globalShortcut.register('CommandOrControl+Shift+Esc', () => {});
  globalShortcut.register('Alt+F4', () => {});
  globalShortcut.register('CommandOrControl+W', () => {});
  globalShortcut.register('CommandOrControl+Q', () => {});
  globalShortcut.register('F11', () => {});

  // 4. USB Detection
  if (usbDetect) {
    usbDetect.startMonitoring();
    usbDetect.on('insert', (device) => {
      if (isProctoring) {
        mainWindow.webContents.send('usb-violation', `Unauthorized USB insertion detected: ${device.deviceName || 'Unknown Storage'}`);
      }
    });
  }
}

function stopProctoring() {
  if (!mainWindow) return;
  isProctoring = false;

  mainWindow.setKiosk(false);
  mainWindow.setAlwaysOnTop(false);
  mainWindow.setFullScreen(false);

  globalShortcut.unregisterAll();
  
  if (usbDetect) {
    usbDetect.stopMonitoring();
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('lock-screen', () => enforceProctoring());
  ipcMain.on('unlock-screen', () => stopProctoring());

  ipcMain.handle('check-system', async () => {
    const displays = screen.getAllDisplays();
    const isKioskInfo = mainWindow ? mainWindow.isKiosk() : false;
    return {
      displays: displays.length,
      os: process.platform,
      kioskEnabled: isKioskInfo
    };
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (usbDetect) usbDetect.stopMonitoring();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
