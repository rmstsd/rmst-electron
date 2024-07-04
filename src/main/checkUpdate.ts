import { autoUpdater } from 'electron-updater'
import { app, dialog } from 'electron'
import log from 'electron-log/main'
import { electronWindow } from './main-process/electronWindow'
import { is } from '@electron-toolkit/utils'
import path from 'node:path'

log.transports.file.level = 'info'
autoUpdater.logger = log
autoUpdater.autoDownload = false

if (is.dev) {
  Reflect.defineProperty(app, 'isPackaged', {
    get() {
      return true
    }
  })
  log.info(path.join(process.cwd(), 'dev-app-update.yml'))
  autoUpdater.updateConfigPath = path.join(process.cwd(), 'dev-app-update.yml')
}

export function checkForUpdates() {
  return autoUpdater.checkForUpdates().catch(err => {
    log.info('checkForUpdates 失败', err)

    return Promise.reject()
  })
}

//* 监听updater的事件
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/

// 当开始检查更新的时候触发
autoUpdater.on('checking-for-update', () => {
  log.info('开始检查更新')
})

// 发现可更新数据时
autoUpdater.on('update-available', () => {
  log.info('有更新')

  dialog
    .showMessageBox({
      type: 'info',
      title: '版本更新',
      message: '有新版本可用, 是否更新',
      detail: '更新日志: xxxxxx',
      cancelId: 1, // 按esc默认点击索引按钮
      defaultId: 0, // 默认高亮的按钮下标
      buttons: ['确认', '取消'] // 按钮按索引从右往左排序
    })
    .then(({ response }) => {
      log.info('update-available', response)

      if (response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
})

// 没有可更新数据时
autoUpdater.on('update-not-available', () => {
  log.info('没有更新')

  dialog.showMessageBox({ type: 'info', title: '版本更新', message: '没有更新' })
})

// 下载监听
autoUpdater.on('download-progress', progressObj => {
  log.info('下载监听', progressObj)

  electronWindow.SettingWindow.setProgressBar(progressObj.percent / 100)
})

// 下载完成
autoUpdater.on('update-downloaded', () => {
  log.info('下载完成')

  dialog
    .showMessageBox({
      type: 'info',
      title: '版本更新',
      message: '新版本已经下载完成, 是否更新',
      cancelId: 1, // 按esc默认点击索引按钮
      defaultId: 0, // 默认高亮的按钮下标
      buttons: ['确认', '取消'] // 按钮按索引从右往左排序
    })
    .then(({ response }) => {
      console.log(response)

      if (response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
})

// 当更新发生错误的时候触发。
autoUpdater.on('error', err => {
  console.log('更新出现错误', err.message)
  if (err.message.includes('sha512 checksum mismatch')) {
  } else {
  }
})
