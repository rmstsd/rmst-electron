import { useEffect, useState } from 'react'
import { Button, Divider, Input, Space } from '@arco-design/web-react'

const Note = () => {
  const [contentList, setContentList] = useState<string[]>([])

  useEffect(() => {
    getContent()
  }, [])

  const getContent = () => {
    window.electron.ipcRenderer.invoke('get-note').then(data => {
      setContentList(data || [])
    })
  }

  const updateContent = async () => {
    window.electron.ipcRenderer.invoke('set-note', contentList)
  }

  return (
    <div style={{ margin: 10 }}>
      <Space>
        <Button onClick={updateContent}>更新</Button>
        <Button onClick={() => setContentList(contentList.concat(''))}>增加</Button>
      </Space>

      <Divider />

      <div style={{ display: 'flex', gap: 10 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {contentList.map((item, index) => (
            <Input
              value={item}
              onChange={value => {
                contentList[index] = value
                setContentList([...contentList])
              }}
              suffix={
                <>
                  <Button
                    onClick={() => {
                      window.electron.ipcRenderer.invoke('copy-text', item).then(() => {
                        window.electron.ipcRenderer.send('hide-focused-win')
                      })
                    }}
                  >
                    复 制
                  </Button>
                  <Button
                    style={{ marginLeft: 5 }}
                    onClick={() => {
                      setContentList(contentList.toSpliced(index, 1))
                    }}
                  >
                    删 除
                  </Button>
                </>
              }
            />
          ))}
        </section>
      </div>
    </div>
  )
}

export default Note
