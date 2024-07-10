import { globalShortcut, screen } from 'electron'

import { electronWindow } from './electronWindow'

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
