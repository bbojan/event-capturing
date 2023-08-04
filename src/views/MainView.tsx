import { useCallback, useMemo } from 'react'
import { MoveArgs, useSwipe } from '../hooks/useSwipe'
import { Chart } from './Chart'

export function MainView() {
  const move = useCallback((_: MouseEvent, args: MoveArgs) => {
    const { dy, isVertical, isFirst, stopSwipe } = args

    console.log('MainView', args)

    if (isVertical) {
      window.scrollBy(0, dy)
      // e.stopPropagation();
      // e.preventDefault();
    } else {
      if (isFirst) {
        stopSwipe()
      }
    }
  }, [])

  const capture = useMemo(
    () => new URLSearchParams(location.search).get('capture') === '1',
    [],
  )

  useSwipe({
    // will work correct only with true
    capture, // ignore chart preventing
    move,
  })

  return (
    <div
      style={{
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <h1>Main View</h1>
      <Chart />
      <div style={{ width: 500, height: 500, backgroundColor: 'yellow' }}></div>
      <div style={{ width: 500, height: 500, backgroundColor: 'green' }}></div>
    </div>
  )
}
