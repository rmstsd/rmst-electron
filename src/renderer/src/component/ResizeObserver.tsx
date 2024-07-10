import React, { PropsWithChildren, useEffect, useRef } from 'react'

export default function ResizeObserver(
  props: PropsWithChildren<{ onResize?: (size: { width: number; height: number }) => void }>
) {
  const ref = useRef<HTMLElement>()

  useEffect(() => {
    const ob = new window.ResizeObserver(() => {
      const rect = ref.current.getBoundingClientRect()
      props?.onResize({ width: rect.width, height: rect.height })
    })

    if (ref.current) {
      ob.observe(ref.current)
    }

    return () => {
      ob.disconnect()
    }
  }, [ref.current])

  if (!props.children) {
    return null
  }

  return React.cloneElement(props.children as any, { ref })
}
