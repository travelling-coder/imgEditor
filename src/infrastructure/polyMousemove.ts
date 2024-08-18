import { debounce, throttle } from './helper'

export default <T = any>(
  dom: HTMLElement,
  {
    onDown,
    onMove,
    onUp
  }: {
    onDown?: (event: MouseEvent) => T
    onMove: (event: MouseEvent, state: T) => void
    onUp?: (event: MouseEvent, state: T) => void
  },
  delay = 10
) => {
  let mousedown = false
  let state: T

  const realMove = throttle((event: MouseEvent) => onMove(event, state), delay)

  const onMouseDown = (event: MouseEvent) => {
    mousedown = true
    state = onDown?.(event) as T
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (event: MouseEvent) => {
    mousedown && realMove(event, state)
  }

  const onMouseUp = (event: MouseEvent) => {
    onUp?.(event, state)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  dom.addEventListener('mousedown', onMouseDown)

  return () => {
    dom.removeEventListener('mousedown', onMouseDown)
  }
}
