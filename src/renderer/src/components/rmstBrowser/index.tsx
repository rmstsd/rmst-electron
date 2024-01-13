import { Button, Divider, Input, Menu, Tabs } from '@arco-design/web-react'
import { IconLeft, IconRefresh, IconRight } from '@arco-design/web-react/icon'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { WebviewTag } from 'electron'

import { useRmstStore } from '@renderer/store'

import './st.less'

interface TabView {
  title: string
  url: string
  webview?: WebviewTag
}

const rmstBrowser = () => {
  const rmstStore = useRmstStore()
  const [wd, setWd] = useState('稍等')

  const [tabs, setTabs] = useState<TabView[]>([
    {
      title: 'aa',
      url: 'https://www.baidu.com/'
    }
  ])

  const [activeIndex, setActiveIndex] = useState('0')

  const handleAddTab = () => {
    const nTbs = tabs.concat({ title: 'bb', url: `https://www.baidu.com` })
    setTabs(nTbs)
    setActiveIndex(String(nTbs.length - 1))
  }
  const handleDeleteTab = key => {
    const index = Number(key)
    setTabs(tabs.filter((_, idx) => idx !== index))

    setActiveIndex(String(index - 1))
  }

  const webviewRefs = useRef<WebviewTag[]>([])

  useEffect(() => {
    const curWv = webviewRefs.current[Number(activeIndex)]

    const domReady = () => {
      setCanGoBack(curWv.canGoBack())
      setCanGoForward(curWv.canGoForward())
    }
    curWv.addEventListener('dom-ready', domReady)

    rmstStore.setCurrentWebview(curWv)

    return () => {
      curWv.removeEventListener('dom-ready', domReady)
    }
  }, [activeIndex])

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  return (
    <div className="rmst-browser">
      <header className="tool-row">
        <Button type="text" size="large" icon={<IconLeft />} disabled={!canGoBack} />
        <Button type="text" size="large" icon={<IconRight />} disabled={!canGoForward} />
        <Button type="text" size="large" icon={<IconRefresh />} onClick={() => rmstStore.currentWebview.reload()} />

        <Input readOnly value={tabs[activeIndex].url} />

        <Input type="text" value={wd} onChange={setWd} style={{ marginLeft: 'auto' }} />
        <Button
          onClick={() => {
            const nTbs = tabs.concat({ title: 'bb', url: `https://www.baidu.com/s?wd=${wd}` })
            setTabs(nTbs)
            setActiveIndex(String(nTbs.length - 1))
          }}
        >
          搜索
        </Button>
      </header>

      <Divider style={{ margin: 0 }} />

      <Tabs
        activeTab={activeIndex}
        onChange={setActiveIndex}
        editable
        type="card-gutter"
        onAddTab={handleAddTab}
        onDeleteTab={handleDeleteTab}
      >
        {tabs.map((item, index) => (
          <Tabs.TabPane title={item.title} key={String(index)}>
            <Webview
              ref={el => {
                webviewRefs.current[index] = el
              }}
              item={item}
              onTitleUpdated={title => {
                tabs[index].title = title
                setTabs([...tabs])
              }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>

      {rmstStore.contextMenuVisible && <ContextMenu />}
    </div>
  )
}

export default rmstBrowser

const Webview = forwardRef<WebviewTag, { item; onTitleUpdated }>((props, ref) => {
  const { item, onTitleUpdated } = props

  const store = useRmstStore()
  const webRef = useRef<WebviewTag>(null)

  useImperativeHandle(ref, () => webRef.current)

  useEffect(() => {
    webRef.current.addEventListener('page-title-updated', evt => {
      onTitleUpdated(evt.title)
    })

    webRef.current.addEventListener('context-menu', evt => {
      console.log(evt)

      store.setContextMenuVisible(true)
      store.setContextMenuCoord({ x: evt.params.x, y: evt.params.y })
    })
  }, [])

  return <webview ref={webRef} src={item.url} style={{ width: '100%', height: '100%' }}></webview>
})

function ContextMenu() {
  const rmstStore = useRmstStore()

  return (
    <>
      <div
        className="mask"
        onClick={() => rmstStore.setContextMenuVisible(false)}
        onContextMenu={evt => {
          rmstStore.setContextMenuCoord({ x: evt.clientX, y: evt.clientY })
        }}
      />

      <Menu className="context-menu" style={{ left: rmstStore.contextMenuCoord.x, top: rmstStore.contextMenuCoord.y }}>
        <Menu.Item key="c">检查</Menu.Item>
      </Menu>
    </>
  )
}
