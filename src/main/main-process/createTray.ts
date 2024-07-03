import { Menu, Tray } from 'electron'

import { electronWindow } from './electronWindow'

import icon from '../../../resources/icon.png?asset'
import { checkForUpdates } from '../checkUpdate'

// 托盘图标
export const createTray = () => {
  const tray = new Tray(icon)

  tray.on('click', () => {
    // electronWindow.circleWindow.show()
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: '检查更新', type: 'normal', click: () => checkForUpdates() },
    {
      label: '设置',
      type: 'normal',
      click: () => {
        electronWindow.SettingWindow?.show()
      }
    },
    { label: '退出', type: 'normal', click: () => process.exit(0) }
  ])

  tray.setToolTip('rmst')
  tray.setContextMenu(contextMenu)
}
