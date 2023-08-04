import { useCallback, useRef } from 'react'
import { MoveArgs, useSwipe } from '../hooks/useSwipe'

export function Chart() {
  const move = useCallback((_: MouseEvent, args: MoveArgs) => {
    const { dx, isHorizontal, isFirst, stopSwipe } = args

    console.log('Chart', args)

    const chart = ref?.current
    if (isHorizontal) {
      if (chart) {
        chart.scrollBy(dx, 0)
      }
    } else {
      if (isFirst) {
        stopSwipe()
      }
    }
  }, [])

  const ref = useRef<HTMLDivElement>(null)

  useSwipe({
    ref,
    capture: false, // work normal without capture
    prevent: true, // block everything above me
    move,
  })

  return (
    <div
      style={{
        border: '3px solid gray',
      }}
    >
      <h1>Chart</h1>
      <div
        ref={ref}
        style={{
          width: 500,
          height: 500,
          overflowX: 'scroll',
          overflowY: 'hidden',
        }}
      >
        <div
          style={{
            width: 1000,
            height: 500,
          }}
        >
          <div
            style={{
              width: 250,
              height: 500,
              backgroundColor: 'rebeccapurple',
              display: 'inline-block',
            }}
          ></div>
          <div
            style={{
              width: 250,
              height: 500,
              backgroundColor: 'black',
              display: 'inline-block',
            }}
          ></div>
          <div
            style={{
              width: 250,
              height: 500,
              backgroundColor: 'magenta',
              display: 'inline-block',
            }}
          ></div>
          <div
            style={{
              width: 250,
              height: 500,
              backgroundColor: 'lime',
              display: 'inline-block',
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
