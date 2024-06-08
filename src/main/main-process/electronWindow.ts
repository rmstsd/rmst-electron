import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import path from 'node:path'

type IElectronWindow = {
  SettingWindow: BrowserWindow
  OpenDir: BrowserWindow
  QuickInput: BrowserWindow
  RmstBrowserWindow: BrowserWindow
}
export const electronWindow = {} as IElectronWindow

const preloadPath = path.join(__dirname, '../preload/index.js')

import icon from '../../../resources/icon.png?asset'

// export const iconPath = path.resolve(app.getAppPath(), 'icon.png')
// export const trayPath = path.resolve(app.getAppPath(), 'icon.png')

const loadWindow = (win: BrowserWindow, query: Record<string, string>) => {
  const queryString = '?' + new URLSearchParams(query).toString()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + queryString)
  } else {
    const url = path.join(__dirname, '../renderer/index.html') + queryString
    win.loadURL(url)
  }
}

function createOpenDirWindow() {
  const win = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    center: true,
    resizable: false,
    // thickFrame: false, // 设置为 false 时将移除窗口的阴影和动画
    // transparent: true,
    useContentSize: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })
  loadWindow(win, { ui: 'OpenDir' })

  win.on('blur', () => {
    !is.dev && win.hide()
  })

  return win
}

function createSettingWindow() {
  const win = new BrowserWindow({
    icon,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })

  loadWindow(win, { ui: 'Setting' })

  return win
}

function createQuickInputWindow() {
  const win = new BrowserWindow({
    frame: false,
    skipTaskbar: false,
    show: false,
    focusable: false,
    resizable: false,
    width: 240,
    height: 320,
    alwaysOnTop: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })

  loadWindow(win, { ui: 'QuickInput' })

  return win
}

function createRmstBrowserWindow() {
  const win = new BrowserWindow({
    frame: false,
    width: 1300,
    height: 750,
    minWidth: 400,
    minHeight: 360,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true,
      webviewTag: true
    }
  })

  win.on('maximize', () => {
    win.webContents.send('browser-size', true)
  })
  win.on('unmaximize', () => {
    win.webContents.send('browser-size', false)
  })

  win.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  win.webContents.on('did-attach-webview', (e, webContent) => {
    webContent.setWindowOpenHandler(details => {
      console.log(details)

      win.webContents.send('create-tab', details.url)

      return { action: 'deny' }
    })
  })

  loadWindow(win, { ui: 'rmstBrowser' })

  return win
}

export default function createWindow() {
  electronWindow.SettingWindow = createSettingWindow()
  electronWindow.OpenDir = createOpenDirWindow()
  electronWindow.QuickInput = createQuickInputWindow()

  if (is.dev) {
    // electronWindow.RmstBrowserWindow = createRmstBrowserWindow()
  }
}
