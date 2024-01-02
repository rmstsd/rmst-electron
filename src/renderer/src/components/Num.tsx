import { useLayoutEffect } from 'react'
// 来自 @nut-tree/nut-js

enum Key {
  Space = 0,
  Escape = 1,
  Tab = 2,
  LeftAlt = 3,
  LeftControl = 4,
  RightAlt = 5,
  RightControl = 6,
  LeftShift = 7,
  LeftSuper = 8,
  RightShift = 9,
  RightSuper = 10,
  F1 = 11,
  F2 = 12,
  F3 = 13,
  F4 = 14,
  F5 = 15,
  F6 = 16,
  F7 = 17,
  F8 = 18,
  F9 = 19,
  F10 = 20,
  F11 = 21,
  F12 = 22,
  F13 = 23,
  F14 = 24,
  F15 = 25,
  F16 = 26,
  F17 = 27,
  F18 = 28,
  F19 = 29,
  F20 = 30,
  F21 = 31,
  F22 = 32,
  F23 = 33,
  F24 = 34,
  Num0 = 35,
  Num1 = 36,
  Num2 = 37,
  Num3 = 38,
  Num4 = 39,
  Num5 = 40,
  Num6 = 41,
  Num7 = 42,
  Num8 = 43,
  Num9 = 44,
  A = 45,
  B = 46,
  C = 47,
  D = 48,
  E = 49,
  F = 50,
  G = 51,
  H = 52,
  I = 53,
  J = 54,
  K = 55,
  L = 56,
  M = 57,
  N = 58,
  O = 59,
  P = 60,
  Q = 61,
  R = 62,
  S = 63,
  T = 64,
  U = 65,
  V = 66,
  W = 67,
  X = 68,
  Y = 69,
  Z = 70,
  Grave = 71,
  Minus = 72,
  Equal = 73,
  Backspace = 74,
  LeftBracket = 75,
  RightBracket = 76,
  Backslash = 77,
  Semicolon = 78,
  Quote = 79,
  Return = 80,
  Comma = 81,
  Period = 82,
  Slash = 83,
  Left = 84,
  Up = 85,
  Right = 86,
  Down = 87,
  Print = 88,
  Pause = 89,
  Insert = 90,
  Delete = 91,
  Home = 92,
  End = 93,
  PageUp = 94,
  PageDown = 95,
  Add = 96,
  Subtract = 97,
  Multiply = 98,
  Divide = 99,
  Decimal = 100,
  Enter = 101,
  NumPad0 = 102,
  NumPad1 = 103,
  NumPad2 = 104,
  NumPad3 = 105,
  NumPad4 = 106,
  NumPad5 = 107,
  NumPad6 = 108,
  NumPad7 = 109,
  NumPad8 = 110,
  NumPad9 = 111,
  CapsLock = 112,
  ScrollLock = 113,
  NumLock = 114,
  AudioMute = 115,
  AudioVolDown = 116,
  AudioVolUp = 117,
  AudioPlay = 118,
  AudioStop = 119,
  AudioPause = 120,
  AudioPrev = 121,
  AudioNext = 122,
  AudioRewind = 123,
  AudioForward = 124,
  AudioRepeat = 125,
  AudioRandom = 126,
  LeftWin = 127,
  RightWin = 128,
  LeftCmd = 129,
  RightCmd = 130,
  Menu = 131,
  Fn = 132
}
const Num = () => {
  useLayoutEffect(() => {
    window.electron.ipcRenderer.send('set-num-win-size', document.body.offsetHeight)
  }, [])

  const pressChar = (key: Key) => {
    window.electron.ipcRenderer.send('press-char', key)
  }

  return (
    <div style={{ userSelect: 'none' }}>
      <header style={{ height: 14, backgroundColor: 'orange', display: 'flex' }}>
        <div className="win-drag" style={{ flexGrow: 1, cursor: 'move' }}></div>
        <button
          onClick={() => {
            window.electron.ipcRenderer.invoke('hide-num-win')
          }}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          x
        </button>
      </header>

      <div className="parent">
        <button className="div1">rmst</button>

        <button className="div2" onClick={() => pressChar(Key.Divide)}>
          /
        </button>
        <button className="div3" onClick={() => pressChar(Key.Multiply)}>
          *
        </button>
        <button className="div4" onClick={() => pressChar(Key.Subtract)}>
          -
        </button>
        <button className="div5" onClick={() => pressChar(Key.Num7)}>
          7
        </button>
        <button className="div6" onClick={() => pressChar(Key.Num8)}>
          8
        </button>
        <button className="div7" onClick={() => pressChar(Key.Num9)}>
          9
        </button>
        <button className="div8" onClick={() => pressChar(Key.Add)}>
          +
        </button>
        <button className="div9" onClick={() => pressChar(Key.Num4)}>
          4
        </button>
        <button className="div10" onClick={() => pressChar(Key.Num5)}>
          5
        </button>
        <button className="div11" onClick={() => pressChar(Key.Num6)}>
          6
        </button>
        <button className="div12" onClick={() => pressChar(Key.Num1)}>
          1
        </button>
        <button className="div13" onClick={() => pressChar(Key.Num2)}>
          2
        </button>
        <button className="div14" onClick={() => pressChar(Key.Num3)}>
          3
        </button>
        <button className="div15" onClick={() => pressChar(Key.Enter)}>
          enter
        </button>
        <button className="div16" onClick={() => pressChar(Key.Num0)}>
          0
        </button>
        <button className="div17" onClick={() => pressChar(Key.Decimal)}>
          .
        </button>
      </div>
    </div>
  )
}

export default Num
