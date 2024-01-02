import { useLayoutEffect } from 'react'

const Num = () => {
  useLayoutEffect(() => {
    window.electron.ipcRenderer.send('set-num-win-size', document.body.offsetHeight)
  }, [])

  const pressChar = char => {
    window.electron.ipcRenderer.send('press-char', char)
  }

  const sssss = () => {
    window.electron.ipcRenderer.invoke('hide-num-win')
  }

  return (
    <div>
      <button onClick={() => sssss()}>aa</button>
      <div className="win-drag" style={{ height: 14, backgroundColor: 'orange', cursor: 'move' }}></div>

      <div className="parent">
        <button className="div1" onClick={sssss}>
          rmst
        </button>
        <button className="div2" onClick={() => pressChar('/')}>
          /
        </button>
        <button className="div3" onClick={() => pressChar('*')}>
          *
        </button>
        <button className="div4" onClick={() => pressChar('-')}>
          -
        </button>
        <button className="div5" onClick={() => pressChar('7')}>
          7
        </button>
        <button className="div6" onClick={() => pressChar('8')}>
          8
        </button>
        <button className="div7" onClick={() => pressChar('9')}>
          9
        </button>
        <button className="div8" onClick={() => pressChar('+')}>
          +
        </button>
        <button className="div9" onClick={() => pressChar('4')}>
          4
        </button>
        <button className="div10" onClick={() => pressChar('5')}>
          5
        </button>
        <button className="div11" onClick={() => pressChar('6')}>
          6
        </button>
        <button className="div12" onClick={() => pressChar('1')}>
          1
        </button>
        <button className="div13" onClick={() => pressChar('2')}>
          2
        </button>
        <button className="div14" onClick={() => pressChar('3')}>
          3
        </button>
        <button className="div15" onClick={() => pressChar('enter')}>
          enter
        </button>
        <button className="div16" onClick={() => pressChar('0')}>
          0
        </button>
        <button className="div17" onClick={() => pressChar('.')}>
          .
        </button>
      </div>
    </div>
  )
}

export default Num
