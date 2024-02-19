import { BrowserWindow, ipcMain, shell, clipboard } from 'electron'
import fse from 'fs-extra'
import { spawn } from 'cross-spawn'
import cmd from 'node-cmd'
import Store from 'electron-store'

import { electronWindow } from '../main-process/electronWindow'

import { Key, keyboard } from '@nut-tree/nut-js'

const store = new Store()

export const addIpcMain = () => {
  ipcMain.on('hide-focused-win', () => BrowserWindow.getFocusedWindow()?.hide())
  ipcMain.on('open-external', (_, url) => shell.openExternal(url))

  ipcMain.on('spawn-open-dir', openSpawnDir)

  ipcMain.on('node-cmd-dir', nodeCmdDir)

  ipcMain.on('set-dir-win-size', setDirWinSize)

  ipcMain.handle('project-names-tree', getProjectNamesTree)

  ipcMain.on('set-dirPaths', (_, value) => store.set('dirNames', value))
  ipcMain.on('set-editorPath', (_, value) => store.set('editorPath', value))
  ipcMain.on('set-cmdPath', (_, value) => store.set('cmdPath', value))

  ipcMain.handle('get-dirPaths', () => store.get('dirNames'))
  ipcMain.handle('get-editorPath', () => store.get('editorPath'))
  ipcMain.handle('get-cmdPath', () => store.get('cmdPath'))

  ipcMain.handle('hide-num-win', () => {
    electronWindow.NumWindow.hide()
  })

  ipcMain.on('clear-ele-store', () => store.clear())

  ipcMain.handle('copy-text', (_, content) => {
    clipboard.writeText(content)
  })

  ipcMain.handle('get-note', () => store.get('note'))
  ipcMain.handle('set-note', (_, value) => {
    store.set('note', value)
  })

  ipcMain.on('set-num-win-size', (_, value) => {
    electronWindow.NumWindow.setBounds({ height: value })
  })

  ipcMain.on('press-char', (_, value: Key) => {
    keyboard.type(value)
  })

  ipcMain.handle('minimize', () => electronWindow.RmstBrowserWindow.minimize())
  ipcMain.handle('maximize', () => electronWindow.RmstBrowserWindow.maximize())
  ipcMain.handle('unmaximize', () => electronWindow.RmstBrowserWindow.unmaximize())
  ipcMain.handle('close', () => electronWindow.RmstBrowserWindow.close())
}

const openSpawnDir = (_, dirPath) => {
  const editorPath = store.get('editorPath') as string
  if (!editorPath) {
    return
  }
  spawn(editorPath, [dirPath], { detached: true })
}

const nodeCmdDir = (_, dirPath) => {
  const cmdPath = store.get('cmdPath') as string
  if (!cmdPath) {
    return
  }

  cmd.runSync(`${cmdPath} -d ${dirPath}`)
}

const setDirWinSize = (_, value) => {
  const { x, y } = electronWindow.searchWindow.getBounds()
  electronWindow.searchWindow.setBounds({ x: x + 1, y: y + 1, width: 800, height: value })
}

const getProjectNamesTree = () => {
  const blackList = ['$RECYCLE.BIN', 'System Volume Information']

  const namesTree = ((store.get('dirNames') as string[]) || []).map(item => ({
    name: item.replace(/\\/g, '/'),
    children: fse.readdirSync(item).filter(item => !blackList.includes(item))
  }))

  return namesTree
}
