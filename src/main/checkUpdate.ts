import { autoUpdater, NsisUpdater } from 'electron-updater'
import { app, dialog } from 'electron'
import path from 'node:path'
import log from 'electron-log/main'
import { is } from '@electron-toolkit/utils'

log.transports.file.level = 'info'
autoUpdater.logger = log

export function checkForUpdates() {
  autoUpdater.checkForUpdates().catch(err => {
    log.info('checkForUpdates 失败', err)
  })
}

export function quitAndInstall() {
  autoUpdater.quitAndInstall()
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
})

// 没有可更新数据时
autoUpdater.on('update-not-available', () => {
  log.info('没有更新')
})

// 下载监听
autoUpdater.on('download-progress', progressObj => {
  log.info('下载监听', progressObj)
})

// 下载完成
autoUpdater.on('update-downloaded', () => {
  log.info('下载完成')

  dialog
    .showMessageBox({
      type: 'info',
      title: '这里是标题',
      message: '提示内容',
      detail: '额外信息',
      cancelId: 1, // 按esc默认点击索引按钮
      defaultId: 0, // 默认高亮的按钮下标
      buttons: ['确认', '取消'] // 按钮按索引从右往左排序
    })
    .then(({ response }) => {
      console.log(response)

      if (response === 0) {
        quitAndInstall()
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
