import fse from 'fs-extra'
import { spawn } from 'cross-spawn'

import { getStoreSetting } from './store'
import { electronWindow } from '../electronWindow'

export const openSpawnDir = (_, dirPath) => {
  const editorPath = getStoreSetting().vscodePath
  if (!editorPath) {
    return
  }
  spawn(editorPath, [dirPath], { detached: true })
}

export const nodeCmdDir = (_, dirPath) => {
  const cmdPath = getStoreSetting().cmdPath
  if (!cmdPath) {
    return
  }

  spawn(cmdPath, [`-d ${dirPath}`], { shell: true })

  // import cmd from 'node-cmd'
  // cmd.runSync(`${cmdPath} -d ${dirPath}`)
}

export const setDirWinSize = (_, value) => {
  const { x, y } = electronWindow.OpenDir.getBounds()
  electronWindow.OpenDir.setBounds({ x: x + 1, y: y + 1, width: 800, height: value })
}

export const getProjectNamesTree = () => {
  const blackList = ['$RECYCLE.BIN', 'System Volume Information']

  const { projectPaths = [] } = getStoreSetting()
  const namesTree = projectPaths.map(item => ({
    name: item.replace(/\\/g, '/'),
    children: fse.readdirSync(item).filter(item => !blackList.includes(item))
  }))

  return namesTree
}
