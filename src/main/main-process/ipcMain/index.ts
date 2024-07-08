import { BrowserWindow, ipcMain, shell, clipboard, app } from 'electron'
import { Key, keyboard } from '@nut-tree/nut-js'
import killPort from 'kill-port'

import { electronWindow } from '../../main-process/electronWindow'

import { clearAllStore, getStoreSetting, setStoreSetting } from './store'
import { getProjectNamesTree, nodeCmdDir, openSpawnDir, setDirWinSize } from './openDir'
import { checkForUpdates } from '../../checkUpdate'

import { BrowserEvent, CommonEvent, KillPortEvent, OpenDirEvent, QuickInputEvent, SettingEvent } from '@common/ipcEvent'

keyboard.config.autoDelayMs = 0

export const addIpcMain = () => {
  ipcMain.handle(CommonEvent.Copy_Text, (_, content) => {
    clipboard.writeText(content)
  })
  ipcMain.on(CommonEvent.Hide_Focused_Win, () => BrowserWindow.getFocusedWindow()?.hide())
  ipcMain.on(CommonEvent.Open_External, (_, url) => shell.openExternal(url))

  addQuickOpenDirIpcMain()
  addQuickInputIpcMain()
  addBrowserIpcMain()
  addSettingIpcMain()
  addKillPortIpcMain()
}

function addSettingIpcMain() {
  ipcMain.handle(SettingEvent.Save_Setting, async (_, value) => {
    setStoreSetting(value)
  })
  ipcMain.handle(SettingEvent.Get_Setting, () => getStoreSetting())
  ipcMain.handle(SettingEvent.Clear_Ele_Store, () => {
    clearAllStore()
  })
  ipcMain.handle(SettingEvent.Check_Update, () => checkForUpdates())

  ipcMain.handle(SettingEvent.Get_Base_Info, () => {
    return {
      appPath: app.getAppPath(),
      version: app.getVersion(),
      name: app.getName()
    }
  })
}

function addBrowserIpcMain() {
  ipcMain.handle(BrowserEvent.Browser_Minimize, () => electronWindow.RmstBrowserWindow.minimize())
  ipcMain.handle(BrowserEvent.Browser_Maximize, () => electronWindow.RmstBrowserWindow.maximize())
  ipcMain.handle(BrowserEvent.Browser_Unmaximize, () => electronWindow.RmstBrowserWindow.unmaximize())
  ipcMain.handle(BrowserEvent.Browser_Close, () => electronWindow.RmstBrowserWindow.close())
}

function addQuickInputIpcMain() {
  ipcMain.handle(QuickInputEvent.Hide_Num_Win, () => {
    electronWindow.QuickInput.hide()
  })
  ipcMain.on(QuickInputEvent.Set_Num_Win_Size, (_, { width, height }) => {
    electronWindow.QuickInput.setBounds({ width, height })
  })
  ipcMain.on(QuickInputEvent.Press_Char, (_, value: Key) => {
    keyboard.type(value)
  })
  ipcMain.handle(QuickInputEvent.Copy_And_Paste, async (_, value) => {
    clipboard.writeText(value)

    await keyboard.pressKey(Key.LeftControl, Key.V)
    await keyboard.releaseKey(Key.LeftControl, Key.V)
  })
}

function addQuickOpenDirIpcMain() {
  ipcMain.on(OpenDirEvent.Spawn_Open_Dir, openSpawnDir)
  ipcMain.on(OpenDirEvent.Node_Cmd_Dir, nodeCmdDir)
  ipcMain.on(OpenDirEvent.Set_Dir_Win_Size, setDirWinSize)

  ipcMain.handle(OpenDirEvent.Project_Names_Tree, getProjectNamesTree)

  ipcMain.handle(OpenDirEvent.Get_DirPaths, () => getStoreSetting().projectPaths)
  ipcMain.handle(OpenDirEvent.Get_EditorPath, () => getStoreSetting().vscodePath)
  ipcMain.handle(OpenDirEvent.Get_CmdPath, () => getStoreSetting().cmdPath)
}

function addKillPortIpcMain() {
  ipcMain.handle(KillPortEvent.Search_Process, (_, value) => killPort(value))
}
