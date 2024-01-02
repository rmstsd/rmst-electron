import { Menu, ipcMain } from 'electron'

import { createTray } from './main-process/createTray'
import { createNumWindow, createSearchWindow, createSettingWindow } from './main-process/electronWindow'
import { addIpcMain } from './main-process/ipcMain'
import { addShortcut, addUiohook } from './main-process/uiohook'

export async function initElectronApp() {
  addIpcMain()
  Menu.setApplicationMenu(null)

  createSearchWindow()
  createSettingWindow()
  createNumWindow()

  createTray()

  addUiohook()
  addShortcut()
}
