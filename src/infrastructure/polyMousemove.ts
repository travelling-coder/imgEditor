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
  }
) => {
  let mousedown = false
  let state: T

  const onMouseDown = (event: MouseEvent) => {
    mousedown = true
    state = onDown?.(event) as T
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (event: MouseEvent) => {
    mousedown && onMove(event, state)
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
