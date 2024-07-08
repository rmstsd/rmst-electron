import { Button, Form, Input, Message } from '@arco-design/web-react'
import { KillPortEvent } from '@common/ipcEvent'
import { useEffect, useRef, useState } from 'react'

export default function KillPort() {
  const ref = useRef(null)

  useEffect(() => {
    document.onvisibilitychange = () => {
      if (document.visibilityState === 'visible') {
        ref.current?.focus()
      }
    }
  }, [])

  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)

  const kill = () => {
    setLoading(true)
    window.electron.ipcRenderer
      .invoke(KillPortEvent.Search_Process, form.getFieldValue('port'))
      .then(res => {
        if (res.code === 0) {
          Message.success(res.stdout)
        } else {
          Message.error(res.stderr)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div style={{ padding: 40 }}>
      <Form form={form}>
        <Form.Item label="端口号" field="port">
          <Input ref={ref} placeholder="端口号" />
        </Form.Item>

        <Form.Item label=" " field="port">
          <Button loading={loading} onClick={kill}>
            kill
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
