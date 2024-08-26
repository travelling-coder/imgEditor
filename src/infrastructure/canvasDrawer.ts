export const ctxDrawLine = (
  ctx: CanvasRenderingContext2D,
  p1: Position,
  p2: Position,
  color: string
) => {
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.closePath()
}

export const ctxDrawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  p: Position,
  color: string,
  type: 'h' | 'v' = 'h'
) => {
  ctx.beginPath()
  ctx.font = '12px Arial'
  ctx.fillStyle = color
  if (type === 'v') {
    text = text.toString()
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], p.x, p.y + i * 12)
    }
  } else {
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.fillText(text, p.x, p.y)
  }
  ctx.closePath()
}
