import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import path from 'node:path'

type IElectronWindow = {
  searchWindow: BrowserWindow
  settingWindow: BrowserWindow
  NumWindow: BrowserWindow
  NoteWindow: BrowserWindow
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

function createSearchDirWindow() {
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
  loadWindow(win, { ui: 'DirSearch' })

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

function createNumWindow() {
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

  loadWindow(win, { ui: 'Num' })

  return win
}

function createNoteWindow() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })

  loadWindow(win, { ui: 'Note' })

  return win
}

export default function createWindow() {
  electronWindow.searchWindow = createSearchDirWindow()
  electronWindow.settingWindow = createSettingWindow()

  electronWindow.NumWindow = createNumWindow()

  electronWindow.NoteWindow = createNoteWindow()
}
