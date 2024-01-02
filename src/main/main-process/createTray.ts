import { Menu, app, Tray } from 'electron'

import { electronWindow, trayPath } from './electronWindow'

// 托盘图标
export const createTray = () => {
  const tray = new Tray(trayPath)

  tray.on('click', () => {
    // electronWindow.circleWindow.show()
  })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '设置',
      type: 'normal',
      click: (menuItem, browserWindow, event) => {
        electronWindow.settingWindow?.show()
      }
    },
    // {
    //   label: 'note',
    //   type: 'normal',
    //   click: (menuItem, browserWindow, event) => {
    //     electronWindow.NoteWindow?.show()
    //   }
    // },
    // {
    //   label: 'fanYi',
    //   type: 'normal',
    //   click: (menuItem, browserWindow, event) => {
    //     electronWindow.YoudaoTranslateWindow?.show()
    //   }
    // },
    { label: '退出', type: 'normal', click: () => process.exit(0) }
  ])
  tray.setToolTip('rmst')
  tray.setContextMenu(contextMenu)
}
