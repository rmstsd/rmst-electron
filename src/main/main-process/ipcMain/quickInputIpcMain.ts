import { ipcMain, clipboard } from 'electron'
import { Key, keyboard } from '@nut-tree/nut-js'

import { QuickInputEvent } from '@common/ipcEvent'
import { electronWindow } from '../electronWindow'

keyboard.config.autoDelayMs = 0

export function addQuickInputIpcMain() {
  ipcMain.handle(QuickInputEvent.Hide_Quick_Input_Win, () => electronWindow.QuickInput.hide())
  ipcMain.on(QuickInputEvent.Set_Quick_Input_Win_Size, (_, { width, height }) => {
    electronWindow.QuickInput.setResizable(true)
    electronWindow.QuickInput.setSize(parseInt(width), parseInt(height))
    electronWindow.QuickInput.setResizable(false)
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
