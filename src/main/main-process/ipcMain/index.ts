import { BrowserWindow, ipcMain, shell, clipboard, app } from 'electron'
import { Key, keyboard } from '@nut-tree/nut-js'

import { electronWindow } from '../../main-process/electronWindow'

import { clearAllStore, getStoreSetting, setStoreSetting } from './store'
import { getProjectNamesTree, nodeCmdDir, openSpawnDir, setDirWinSize } from './openDir'
import { checkForUpdates } from '../../checkUpdate'

keyboard.config.autoDelayMs = 0

export const addIpcMain = () => {
  ipcMain.handle('copy-text', (_, content) => {
    clipboard.writeText(content)
  })
  ipcMain.on('hide-focused-win', () => BrowserWindow.getFocusedWindow()?.hide())
  ipcMain.on('open-external', (_, url) => shell.openExternal(url))

  addQuickOpenDirIpcMain()

  addQuickInputIpcMain()

  addBrowserIpcMain()

  addSettingIpcMain()
}

function addSettingIpcMain() {
  ipcMain.handle('save-setting', async (_, value) => {
    setStoreSetting(value)
  })
  ipcMain.handle('get-setting', () => getStoreSetting())
  ipcMain.handle('clear-ele-store', () => {
    clearAllStore()
  })
  ipcMain.handle('check-update', () => checkForUpdates())

  ipcMain.handle('get-base-info', () => {
    return {
      appPath: app.getAppPath(),
      version: app.getVersion(),
      name: app.getName()
    }
  })
}

function addBrowserIpcMain() {
  ipcMain.handle('minimize', () => electronWindow.RmstBrowserWindow.minimize())
  ipcMain.handle('maximize', () => electronWindow.RmstBrowserWindow.maximize())
  ipcMain.handle('unmaximize', () => electronWindow.RmstBrowserWindow.unmaximize())
  ipcMain.handle('close', () => electronWindow.RmstBrowserWindow.close())
}

function addQuickInputIpcMain() {
  ipcMain.handle('hide-num-win', () => {
    electronWindow.QuickInput.hide()
  })
  ipcMain.on('set-num-win-size', (_, { width, height }) => {
    electronWindow.QuickInput.setBounds({ width, height })
  })
  ipcMain.on('press-char', (_, value: Key) => {
    keyboard.type(value)
  })
  ipcMain.handle('copy-and-paste', async (_, value) => {
    clipboard.writeText(value)

    await keyboard.pressKey(Key.LeftControl, Key.V)
    await keyboard.releaseKey(Key.LeftControl, Key.V)
  })
}

function addQuickOpenDirIpcMain() {
  ipcMain.on('spawn-open-dir', openSpawnDir)
  ipcMain.on('node-cmd-dir', nodeCmdDir)
  ipcMain.on('set-dir-win-size', setDirWinSize)

  ipcMain.handle('project-names-tree', getProjectNamesTree)

  ipcMain.handle('get-dirPaths', () => getStoreSetting().projectPaths)
  ipcMain.handle('get-editorPath', () => getStoreSetting().vscodePath)
  ipcMain.handle('get-cmdPath', () => getStoreSetting().cmdPath)
}
