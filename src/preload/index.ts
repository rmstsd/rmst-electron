import { contextBridge } from 'electron'
import { electronAPI, exposeElectronAPI } from '@electron-toolkit/preload'
exposeElectronAPI()
// Custom APIs for renderer
const api = {}
console.log('process.contextIsolated', process.contextIsolated)
// Use `contextBridge` APIs to expose Electron APIs to renderer only if context isolation is enabled, otherwise just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
