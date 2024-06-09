import { BrowserWindow, globalShortcut, screen } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'

import { electronWindow } from './electronWindow'

let prevTime = 0
// 全局鼠标事件
const addUiohook = () => {
  uIOhook.on('keyup', evt => {
    // if (evt.keycode === UiohookKey.F12) {
    //   BrowserWindow.getFocusedWindow()?.webContents.openDevTools({ mode: 'detach' })
    // }
    // if (evt.keycode === UiohookKey.F5) {
    //   BrowserWindow.getFocusedWindow()?.webContents.reloadIgnoringCache()
    // }
    // if (evt.keycode === UiohookKey.Escape) {
    //   BrowserWindow.getFocusedWindow()?.hide()
    // }

    if (evt.keycode === UiohookKey.Alt) {
      const cur = performance.now()
      if (cur - prevTime < 300) {
        handleNumWindow()
      }

      prevTime = cur
    }
  })

  uIOhook.start()
}

export const addShortcut = () => {
  // addUiohook()
  globalShortcut.register('Alt+Space', () => {
    if (electronWindow.OpenDir.isVisible()) {
      electronWindow.OpenDir.minimize()
      electronWindow.OpenDir.hide()
    } else {
      electronWindow.OpenDir.show()
      electronWindow.OpenDir.setSkipTaskbar(true)
      electronWindow.OpenDir.removeMenu()
    }
  })

  globalShortcut.register('Alt+n', () => {
    handleNumWindow()
  })
}

function handleNumWindow() {
  if (electronWindow.QuickInput.isVisible()) {
    electronWindow.QuickInput.hide()
  } else {
    const cursorCoord = screen.getCursorScreenPoint()
    electronWindow.QuickInput.setBounds({ x: cursorCoord.x - 10, y: cursorCoord.y - 10 })
    electronWindow.QuickInput.show()
  }
}
