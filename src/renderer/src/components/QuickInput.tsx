import { useLayoutEffect, useState } from 'react'
import { QuickInputEvent, SettingEvent } from '@common/ipcEvent'
import { Button } from '@arco-design/web-react'
import clsx from 'clsx'
import ResizeObserver from 'rc-resize-observer'

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
    getContent()

    document.addEventListener('visibilitychange', () => {
      getContent()
    })
  }, [])

  const pressChar = (key: Key) => {
    window.electron.ipcRenderer.send(QuickInputEvent.Press_Char, key)
  }

  const [contentList, setContentList] = useState<string[]>([])

  const getContent = () => {
    window.electron.ipcRenderer.invoke(SettingEvent.Get_Setting).then(data => {
      setContentList(data?.notes || [])
    })
  }

  function hideNumWin() {
    window.electron.ipcRenderer.invoke(QuickInputEvent.Hide_Num_Win)
  }

  return (
    <ResizeObserver
      onResize={size => {
        window.electron.ipcRenderer.send(QuickInputEvent.Set_Size, { width: size.width, height: size.height })
      }}
    >
      <div className="select-none p-[3%]">
        <div className="win-drag h-[22px] bg-orange-400 flex mb-[5px]">
          <Button size="mini" className={clsx('win-not-drag h-full')} onClick={hideNumWin}>
            x
          </Button>
        </div>

        <div className="flex flex-col gap-[6px]">
          {contentList.map((item, index) => (
            <Button
              size="small"
              key={index}
              type="default"
              className="!border-gray-300 !text-gray-800"
              onClick={() => {
                window.electron.ipcRenderer.invoke(QuickInputEvent.Copy_And_Paste, item).then(hideNumWin)
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </ResizeObserver>
  )
}

export default Num
