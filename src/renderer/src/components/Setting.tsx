import { Button, Form, Input, Message } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { useEffect } from 'react'

export default function Setting() {
  const [form] = Form.useForm()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-setting').then(data => {
      form.setFieldsValue(data)
    })
  }, [])

  const onSubmit = value => {
    console.log(value)
    window.electron.ipcRenderer.invoke('save-setting', value).then(() => {
      Message.success('保存成功')
    })
  }

  const clearEleStore = () => {
    window.electron.ipcRenderer.invoke('clear-ele-store').then(() => {
      Message.info('已清除')
    })
  }

  const ini = {
    // cmdPath: '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\wt.exe',
    // projectPaths: ['E:\\', 'E:\\git-src', 'E:\\whh'],
    // notes: ['2864617610@qq.com', '18842542125', '李春雷', '17642029052'],
    // vscodePath: 'D:\\VS Code\\Code.exe'
  }

  return (
    <div>
      <Form style={{ paddingRight: '10%' }} initialValues={ini} form={form} autoComplete="off" onSubmit={onSubmit}>
        <Form.Item style={{ marginTop: 20 }} label=" " className="sticky-top-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <h2>设置</h2>
            <Button type="primary" htmlType="submit" style={{ position: 'sticky' }}>
              Submit
            </Button>
            <Button type="primary" status="danger" onClick={clearEleStore}>
              清空本地缓存
            </Button>
            <Button
              type="primary"
              onClick={() => {
                window.electron.ipcRenderer.invoke('check-update').then(() => {})
              }}
            >
              检查更新
            </Button>
          </div>
        </Form.Item>

        <Form.Item label="vsCode 路径" field="vscodePath">
          <Input placeholder="例如: D:\Microsoft VS Code\Code.exe" />
        </Form.Item>

        <Form.Item label="cmd Path" field="cmdPath">
          <Input placeholder="例如: D:\WindowsTerminal\wt.exe" />
        </Form.Item>

        <Form.Item label="项目目录列表">
          <Form.List field="projectPaths">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key} style={{ display: 'flex', gap: 10 }}>
                        <Form.Item field={item.field}>
                          <Input placeholder="例如: E:\project" />
                        </Form.Item>
                        <Button
                          icon={<IconDelete />}
                          shape="circle"
                          status="danger"
                          onClick={() => remove(index)}
                          style={{ flexShrink: 0 }}
                        />
                      </div>
                    )
                  })}
                  <Button onClick={() => add()}>add</Button>
                </div>
              )
            }}
          </Form.List>
        </Form.Item>

        <Form.Item label="笔记列表">
          <Form.List field="notes">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key} style={{ display: 'flex', gap: 10 }}>
                        <Form.Item field={item.field}>
                          <Input placeholder="任意字符串" />
                        </Form.Item>
                        <Button
                          icon={<IconDelete />}
                          shape="circle"
                          status="danger"
                          style={{ flexShrink: 0 }}
                          onClick={() => remove(index)}
                        />
                      </div>
                    )
                  })}

                  <Button onClick={() => add()}>add</Button>
                </div>
              )
            }}
          </Form.List>
        </Form.Item>
      </Form>
    </div>
  )
}
