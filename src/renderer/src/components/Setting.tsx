import { Button, Divider, Input, Message, Space } from '@arco-design/web-react'
import { useEffect, useState } from 'react'

const Setting = () => {
  const [editorPath, setEditorPath] = useState<string>('')
  const [cmdPath, setCmdPath] = useState<string>('')
  const [dirPaths, setDirPaths] = useState<string[]>([])

  const saveSet = () => {
    if (!editorPath || dirPaths.length === 0 || dirPaths.some(item => !item)) {
      Message.error('不能为空')
      return
    }

    window.electron.ipcRenderer.send('set-editorPath', editorPath)
    window.electron.ipcRenderer.send('set-cmdPath', cmdPath)
    window.electron.ipcRenderer.send('set-dirPaths', dirPaths)

    Message.success('保存成功')
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-editorPath').then(data => {
      if (data) setEditorPath(data)
    })
    window.electron.ipcRenderer.invoke('get-cmdPath').then(data => {
      if (data) setCmdPath(data)
    })
    window.electron.ipcRenderer.invoke('get-dirPaths').then(data => {
      if (Array.isArray(data) && data.length) setDirPaths(data)
    })
  }, [])

  const clearEleStore = () => {
    window.electron.ipcRenderer.send('clear-ele-store')

    setEditorPath(undefined)
    setDirPaths([])
    Message.info('已清除')
  }

  return (
    <div className="user-set" style={{ padding: 10 }}>
      <h3>使用的编辑器的 .exe文件路径</h3>
      <Input
        placeholder="例如: D:\Microsoft VS Code\Code.exe"
        value={editorPath}
        style={{ width: 400 }}
        onChange={setEditorPath}
      />

      <h3>cmd Path</h3>
      <Input
        placeholder="例如: D:\WindowsTerminal\wt.exe"
        value={cmdPath}
        style={{ width: 400 }}
        onChange={setCmdPath}
      />

      <h3>
        项目所在的目录
        <span style={{ fontWeight: 'normal', marginLeft: 10 }}>
          (如果你的所有项目都在 E:\project 下 则可以填写 E:\project)
        </span>{' '}
      </h3>

      {dirPaths.map((item, index) => (
        <Space key={index} style={{ display: 'flex', marginBottom: 10 }}>
          <span>{index + 1}:</span>
          <Input
            placeholder="例如: E:\project"
            type="text"
            value={item}
            style={{ width: 400 }}
            onChange={value => {
              dirPaths[index] = value
              setDirPaths([...dirPaths])
            }}
          />
          <Button
            onClick={() => {
              dirPaths.splice(index, 1)
              setDirPaths([...dirPaths])
            }}
          >
            -
          </Button>
        </Space>
      ))}
      <Button onClick={() => setDirPaths(dirPaths.concat(''))} style={{ marginBottom: 5 }}>
        + 添加一个目录
      </Button>
      <Divider />
      <div style={{ display: 'flex', gap: 10 }}>
        <Button type="primary" onClick={saveSet} style={{ flexGrow: 1 }}>
          保存
        </Button>

        <Button type="primary" status="danger" onClick={clearEleStore}>
          清空本地缓存
        </Button>
      </div>
    </div>
  )
}

export default Setting
