import { Button, Form, Input, Message, Tag } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

import { SettingEvent } from '@common/ipcEvent'

export default function SettingPage() {
  const [form] = Form.useForm()

  const [baseInfo, setBaseInfo] = useState({ appPath: '', version: '', name: '' })

  useEffect(() => {
    window.electron.ipcRenderer.invoke(SettingEvent.Get_Setting).then(data => {
      form.setFieldsValue(data)
    })
    window.electron.ipcRenderer.invoke(SettingEvent.Get_Base_Info).then(data => {
      setBaseInfo(data)
    })
  }, [])

  const onSubmit = value => {
    console.log(value)
    window.electron.ipcRenderer.invoke(SettingEvent.Save_Setting, value).then(() => {
      Message.success('保存成功')
    })
  }

  const clearEleStore = () => {
    window.electron.ipcRenderer.invoke(SettingEvent.Clear_Ele_Store).then(() => {
      Message.info('已清除')
    })
  }

  const ini = {
    // cmdPath: '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\wt.exe',
    // projectPaths: ['E:\\', 'E:\\git-src', 'E:\\whh'],
    // notes: ['2864617610@qq.com', '18842542125', '李春雷', '17642029052'],
    // vscodePath: 'D:\\VS Code\\Code.exe'
  }

  const [cuLoading, setCuLoading] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 20, gap: 10, marginTop: 5 }}>
        <div>
          name: <Tag size="large">{baseInfo.name}</Tag>
        </div>
        <div>
          appPath: <Tag size="large">{baseInfo.appPath}</Tag>
        </div>
        <div>
          version: <Tag size="large">{baseInfo.version}</Tag>
        </div>
      </div>
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
              loading={cuLoading}
              type="primary"
              onClick={() => {
                setCuLoading(true)
                window.electron.ipcRenderer.invoke(SettingEvent.Check_Update).finally(() => {
                  setCuLoading(false)
                })
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
