'use strict'
const path = require('path')
const os = require('os')
const { ENVIROMENT, DEVTOOL } = require('../../common/config/env')

require('../../common/logs')

import authentication from '../../backend/services/authentication.service'
import cache from '../../backend/helpers/cache.js'
import {
  app,
  protocol,
  BrowserWindow,
  Notification,
  globalShortcut,
  session,
  Menu,
  dialog,
  ipcMain,
} from 'electron'
// Object.defineProperty(app, 'isPackaged', {
//   get() {
//     return true
//   },
// })
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const { autoUpdater } = require('electron-updater')
autoUpdater.logger = require('electron-log')
autoUpdater.autoDownload = false
autoUpdater.logger.transports.file.level = 'debug'
autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'NTAP_UI_NODEJS',
  owner: 'H3O-Labs-LLC',
  private: true,
  token: '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',
})
// token: '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'
let mainWindow, landingWindow
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

var notifier = require('../../common/Notifier')
cache.init()
global.Cache = cache
global.Auth = authentication
global.AppPath = app.getAppPath()
global.IsDevMode = require('electron-is-dev');

async function createWindow () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(require('./menu')))

  app.requestSingleInstanceLock()
  app.on('second-instance', (event, argv, cwd) => {
    notifier.emit('kill-app', {})
    app.quit()
    return
  })

  // Create the browser window.
  landingWindow = new BrowserWindow({
    width: 700,
    height: 425,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    skipTaskbar: true,
    autoHideMenuBar: true,
    focusable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: false,
    },
  })

  const packageJson = require('../../package.json')
  landingWindow.loadURL(
    `data:text/html;charset=utf-8,<style> .initial__loading { position: fixed; width: 60px; height: 50px; top: 30%; left: 50%; margin: -30px 0 0 -20px } .initial__loading svg { width: 50px; height: 50px; } .initial__loading svg path { stroke: rgb(214, 26, 26); fill: rgb(214, 26, 26); stroke-width: 1px; animation: logoAnimate 3.6s ease-in-out infinite; } .initial__loading svg path:nth-child(2) { animation-delay: .2s; } .initial__loading svg path:nth-child(3) { animation-delay: .4s; } @keyframes logoAnimate { 0% { stroke: rgb(248, 63, 63); fill: rgb(214, 26, 26); } 50% { stroke: rgb(218, 31, 31); fill: rgb(196, 21, 21); } 100% { stroke:rgb(143, 5, 5); fill: rgb(197, 22, 22); } } </style> <div style="box-shadow: 0 14px 118px 0 rgba(0, 0, 0, 0.24), 0 6px 20px 0 rgba(0, 0, 0, 0.19);padding: 10px;border: 10px solid rgba(192,192,192, 0.09);background: rgb(242, 244, 248);border-radius: 5px;height: 90%;"> <div class="initial__loading" > <svg version="1.0" width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" stroke="none"> <path d="M107 405 c-32 -7 -60 -15 -63 -17 -3 -3 -4 -40 -2 -81 l3 -76 45 31 c25 17 94 54 153 83 l109 52 -58 11 c-70 15 -111 14 -187 -3z"/> <path d="M344 352 c-44 -26 -108 -69 -142 -95 -64 -50 -188 -164 -138 -128 l28 21 53 -45 c29 -25 58 -45 65 -45 6 0 48 30 91 66 l79 66 0 83 c0 79 1 84 28 104 45 34 22 24 -64 -27z"/> </g> </svg> <span style="font-family: Arial, Helvetica, sans-serif;font-size: 25;">TAP</span> <h5 style="width: 200px !important;margin: 160px 0 0 -50px !important;"></h5> <span style="position: relative; left: -30px; font-family: Arial, Helvetica, sans-serif; white-space: nowrap;"> Release ${packageJson.version} </span> </div> </div>`,
  )
  landingWindow.show()
  if (landingWindow) {
    landingWindow.on('closed', () => {
      landingWindow = null
    })
  }

  setTimeout(async () => {
    landingWindow.close()

    landingWindow = null
    require('../../backend/app') // backend apis

    mainWindow = new BrowserWindow({
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    })
    mainWindow.maximize()
    mainWindow.show()
    // mainWindow.resizable = true

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      if (ENVIROMENT.isdev) mainWindow.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      mainWindow.loadURL(`file://${__dirname}/index.html`)
    }

    mainWindow.webContents.send('response', {
      success: true,
    })

    // allow dev tool to be accessed in production
    // app.whenReady().then(() => {
    //   globalShortcut.register('CommandOrControl+I', () => {
    //     mainWindow.webContents.openDevTools()
    //   })
    // })

    mainWindow.on('closed', () => {
      mainWindow = null
    })
    notifier.on('event', message => {
      try {
        const userInfo = global.Cache.getItem('user-info')
        if (userInfo && userInfo.settings) {
          if (userInfo.settings.notifications) {
            if (userInfo.id != message.receiver_id && userInfo.id != message.by_id) {
              message.windowFocused = mainWindow.isFocused()
              mainWindow.webContents.send('response', message)
              if (!message.windowFocused) {
                new Notification({ title: 'Notification', body: message.text }).show()
              }
            }
          }
        }
      } catch (error) { }
    })
  }, 6000)
}

autoUpdater.on('update-available', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'There is an update available. Would you like to update the application now?',
      buttons: ['Yes', 'No'],
    })
    .then(buttonIndex => {
      console.log('Button index is ', buttonIndex)
      if (buttonIndex.response === 0) {
        console.log('Button index is ', buttonIndex)
        console.log('User selected sure so downloading update')
        // mainWindow.webContents.send('response', {
        //   message: 'Application Update:',
        //   description: 'Downloading the update in background. You will be notified once the download is compelte.',
        // })
        autoUpdater.downloadUpdate()
      } else {
        console.log('user selected No so skipping download')
      }
    })
})

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      title: 'Install Updates',
      message: 'The application will close and restart after the update is complete.',
    })
    .then(() => {
      setImmediate(() => autoUpdater.quitAndInstall())
    })
})

autoUpdater.on('checking-for-update', () => {
  console.log('CHecking for update::')
})

autoUpdater.on('update-not-available', info => {
  console.log('Update not available:::')
  mainWindow.webContents.send('response', {
    message: 'Application Update',
    description: 'You currently have the latest update. ',
  })
})

autoUpdater.on('error', err => {
  console.log('Error while checking for update')
  mainWindow.webContents.send('response', 'An error occurred while checking for updates ' + err)
})

autoUpdater.on('download-progress', progressObj => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  console.log(log_message)
})

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.removeAllListeners('close')
    mainWindow.close()
  }

  if (landingWindow) {
    landingWindow.removeAllListeners('close')
    landingWindow.close()
  }

  console.log('before-quit: Global Shortcut Status: ')
  globalShortcut.unregisterAll()
  try {
    notifier.emit('kill-app', {})
  } catch (error) { }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // globalShortcut.unregisterAll();

  // if (process.platform !== 'darwin') {
  //   notifier.emit('kill-app', {});
  // app.quit()
  // }
})
// set to null

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (ENVIROMENT.isdev && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // vue install here.
      const vueDevTools = path.join(os.homedir(), DEVTOOL.path + DEVTOOL.extension)
      await session.defaultSession.loadExtension(vueDevTools)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createWindow()

  ipcMain.on('request', async (event, title) => {
    console.log('title is ', title)
    console.log('Request from UI for checking update')
    autoUpdater.checkForUpdates()
  })
})

// Exit cleanly on request from parent process in development mode.
if (ENVIROMENT.isdev) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        notifier.emit('kill-app', {})
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      notifier.emit('kill-app', {})
      app.quit()
    })
  }
}
