import { useEffect, useState, useRef } from 'react'
import { Button, Divider, Input, Message, Spin } from '@arco-design/web-react'

const Note = () => {
  const [content, setContent] = useState('')
  const shaRef = useRef('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // getContent()
  }, [])

  const getContent = () => {
    setLoading(true)
    window.electron.ipcRenderer.invoke('get-content').then(data => {
      setContent(data.content || '')
      shaRef.current = data.sha

      setLoading(false)
    })
  }

  const updateContent = async () => {
    const contentString = contentList.join('\n')

    setLoading(true)
    window.electron.ipcRenderer
      .invoke('update-content', contentString, shaRef.current)
      .then(() => {
        Message.success('更新成功')
      })
      .catch(() => {
        Message.error('更新失败')
      })
      .finally(() => {
        getContent()
      })
  }

  const contentList = content.split('\n')

  return (
    <Spin loading={loading} block size={30} style={{ margin: 10 }}>
      <Button onClick={updateContent}>更新</Button>

      <Divider />

      <div style={{ display: 'flex', gap: 10 }}>
        <Input.TextArea value={content} onChange={setContent} style={{ height: 300, flex: 1 }} />

        <section style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {contentList.map((item, index) => (
            <Input
              value={item}
              key={index}
              readOnly
              suffix={
                <Button
                  long
                  onClick={() => {
                    window.electron.ipcRenderer.invoke('copy-text', item).then(() => {
                      window.electron.ipcRenderer.send('hide-focused-win')
                    })
                  }}
                >
                  复 制
                </Button>
              }
            />
          ))}
        </section>
      </div>
    </Spin>
  )
}

export default Note
