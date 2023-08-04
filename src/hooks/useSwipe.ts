import { RefObject, useCallback, useEffect, useRef } from 'react'

export interface MoveArgs {
  index: number
  dy: number
  dx: number
  y: number
  x: number
  isVertical: boolean
  isHorizontal: boolean
  isFirst: boolean
  stopSwipe: () => void
}

export function useSwipe(
  options: {
    ref?: RefObject<HTMLDivElement>
    capture?: boolean
    prevent?: boolean
    move?: (e: MouseEvent, args: MoveArgs) => void
  } = {
    capture: false,
    prevent: false,
    move: () => {},
  },
) {
  const { ref, capture, prevent, move } = options

  const index = useRef(-1)
  const isVertical = useRef(false)

  const onPointerDown = useCallback(
    (e: Event) => {
      index.current = 0

      if (prevent) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    [prevent],
  )

  const onPointerMove = useCallback(
    (e: MouseEvent) => {
      const idx = index.current
      const hadDown = idx >= 0

      if (hadDown) {
        const isFirst = idx === 0
        index.current = idx + 1

        const vertical =
          Math.abs(e.movementY) > Math.floor(Math.abs(e.movementX / 2))

        if (isFirst) {
          isVertical.current = vertical
        }

        document.body.style.cursor = isVertical.current
          ? 'row-resize'
          : 'col-resize'

        move?.(e, {
          index: index.current,
          dy: -e.movementY,
          dx: -e.movementX,
          y: e.offsetY,
          x: e.offsetX,
          isVertical: isVertical.current,
          isHorizontal: !isVertical.current,
          isFirst,
          stopSwipe: () => {
            index.current = -1
            document.body.style.cursor = 'unset'
          },
        })
      }

      if (prevent) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    [move, prevent],
  )

  const onPointerUp = useCallback(
    (e: MouseEvent) => {
      index.current = -1
      document.body.style.cursor = 'unset'

      if (prevent) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    [prevent],
  )

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove, {
      capture,
    })

    window.addEventListener('pointerup', onPointerUp, {
      capture,
    })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)

      window.removeEventListener('pointermove', onPointerMove, {
        capture: true,
      })

      window.removeEventListener('pointerup', onPointerUp, {
        capture: true,
      })
    }
  }, [capture, onPointerMove, onPointerUp])

  useEffect(() => {
    const ele = ref?.current ?? window
    ele?.addEventListener('pointerdown', onPointerDown, {
      capture,
    })

    return () => {
      ele?.removeEventListener('pointerdown', onPointerDown)

      ele?.removeEventListener('pointerdown', onPointerDown, {
        capture,
      })
    }
  }, [ref, capture, onPointerDown])
}
