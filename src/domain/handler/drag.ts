const onDown = (event: MouseEvent, startPoint: Position) => {
  const { x, y } = startPoint
  const { clientX, clientY } = event
  const dx = clientX - x
  const dy = clientY - y
  document.body.classList.add('dragging')
  return { dx, dy }
}

const onMove = (event: MouseEvent, diff: ReturnType<typeof onDown>) => {
  const { clientX, clientY } = event
  const x = clientX - diff.dx
  const y = clientY - diff.dy
  return { x, y }
}

const onUp = (event: MouseEvent, diff: ReturnType<typeof onDown>) => {
  const { clientX, clientY } = event
  const x = clientX - diff.dx
  const y = clientY - diff.dy
  document.body.classList.remove('dragging')
  return { x, y }
}

export { onDown, onMove, onUp }
