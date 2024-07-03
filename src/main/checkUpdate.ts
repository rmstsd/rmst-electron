import { autoUpdater } from 'electron-updater'
import { app } from 'electron'
import path from 'node:path'
import log from 'electron-log/main'

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true
  }
})

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.updateConfigPath = path.join(__dirname, '../../dist/win-unpacked/resources/app-update.yml')

export function checkForUpdates() {
  autoUpdater.checkForUpdates().catch(err => {
    console.log('网络连接问题', err)
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
  console.log('开始检查更新')
})

// 发现可更新数据时
autoUpdater.on('update-available', () => {
  console.log('有更新')
})

// 没有可更新数据时
autoUpdater.on('update-not-available', () => {
  console.log('没有更新')
})

// 下载监听
autoUpdater.on('download-progress', progressObj => {
  console.log(progressObj, '下载监听')
})

// 下载完成
autoUpdater.on('update-downloaded', () => {
  console.log('下载完成')
})

// 当更新发生错误的时候触发。
autoUpdater.on('error', err => {
  console.log('更新出现错误', err.message)
  if (err.message.includes('sha512 checksum mismatch')) {
  } else {
  }
})
