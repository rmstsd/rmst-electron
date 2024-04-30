import { BrowserWindow, globalShortcut, screen } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'

import { electronWindow } from './electronWindow'

// 全局鼠标事件
export const addUiohook = () => {
  uIOhook.on('keyup', evt => {
    if (evt.keycode === UiohookKey.F12) {
      BrowserWindow.getFocusedWindow()?.webContents.openDevTools({ mode: 'detach' })
    }
    if (evt.keycode === UiohookKey.F5) {
      BrowserWindow.getFocusedWindow()?.webContents.reloadIgnoringCache()
    }
    if (evt.keycode === UiohookKey.Escape) {
      BrowserWindow.getFocusedWindow()?.hide()
    }
  })

  // uIOhook.on('mousemove', () => {
  //   clearTimeout(timer)
  // })

  // evt.button  1: 左键 2: 右键
  // uIOhook.on('mousedown', evt => {
  //   if (evt.button === 2) {
  //     timer = setTimeout(() => {
  //       robot.keyTap('c', 'control')

  //       const { x, y } = screen.getCursorScreenPoint()

  //       const { width, height } = electronWindow.circleWindow.getBounds()

  //       const p_x = Math.round(x - width / 2)
  //       const p_y = Math.round(y - height / 2)
  //       electronWindow.circleWindow.setBounds({ x: p_x, y: p_y })
  //       electronWindow.circleWindow.show()

  //       electronWindow.circleWindow.webContents.send('exec-ani-circle')
  //     }, 300)
  //   }
  // })

  // uIOhook.on('mouseup', () => {
  //   clearTimeout(timer)
  // })

  uIOhook.start()
}

export const addShortcut = () => {
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
    if (electronWindow.QuickInput.isVisible()) {
      electronWindow.QuickInput.hide()
    } else {
      const cursorCoord = screen.getCursorScreenPoint()
      electronWindow.QuickInput.setBounds({ x: cursorCoord.x - 10, y: cursorCoord.y - 10 })
      electronWindow.QuickInput.show()
    }
  })
}
