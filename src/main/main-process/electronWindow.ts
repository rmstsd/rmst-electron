import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import path from 'node:path'

type IElectronWindow = { searchWindow: BrowserWindow; settingWindow: BrowserWindow; NumWindow: BrowserWindow }
export const electronWindow: IElectronWindow = {} as IElectronWindow

const preloadPath = path.join(__dirname, '../preload/index.js')

export const iconPath = path.resolve(app.getAppPath(), 'icon.png')
export const trayPath = path.resolve(app.getAppPath(), 'icon.png')

const loadWindow = (win: BrowserWindow, query: Record<string, string>) => {
  const queryString = '?' + new URLSearchParams(query).toString()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + queryString)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html', queryString))
  }
}

export const createSearchWindow = () => {
  const preloadPath = path.join(__dirname, '../preload/index.js')

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
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })
  loadWindow(win, { ui: 'DirSearch' })

  electronWindow.searchWindow = win

  win.on('blur', () => {
    !is.dev && win.hide()
  })
}

export const createSettingWindow = () => {
  const win = new BrowserWindow({
    icon: iconPath,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })
  win.on('close', evt => {
    evt.preventDefault()
    win.hide()
  })
  loadWindow(win, { ui: 'Setting' })

  electronWindow.settingWindow = win
}

export function createNumWindow() {
  const win = new BrowserWindow({
    // icon: iconPath,
    // frame: false,
    // skipTaskbar: false,
    // show: false,
    // focusable: false,
    resizable: false,
    width: 240,
    height: 320,
    alwaysOnTop: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })
  win.on('close', evt => {
    evt.preventDefault()
    win.hide()
  })
  loadWindow(win, { ui: 'Num' })

  electronWindow.NumWindow = win
}
