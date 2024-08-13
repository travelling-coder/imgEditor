import { createCanvas } from '@/infrastructure/createDom'
import getRule from './rule'
import messageHandler from '@/infrastructure/messageHandler'

export class Canvas {
  private _dom: HTMLDivElement

  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _id: string
  private _type: string

  private _rule: ReturnType<typeof getRule>
  private _pending: number

  constructor(id: string, dom: HTMLDivElement, type: string, pending: number) {
    dom.classList.add('ps-canvas-container')
    this._pending = pending
    this._type = type
    this._dom = dom
    this._id = id
    this._canvas = createCanvas({
      style: { position: 'absolute', top: `${this._pending}px`, left: `${this._pending}px` }
    })
    this._ctx = this._canvas.getContext('2d')!
    this._dom.appendChild(this._canvas)
    this._rule = getRule(`${id}`, this._dom, type, this._pending)
    setTimeout(this.initCanvas.bind(this))
  }

  initCanvas() {
    this._canvas.width = this._dom.clientWidth - this._pending
    this._canvas.height = this._dom.clientHeight - this._pending
  }

  canvas() {
    return this._canvas
  }

  ctx() {
    return this._ctx
  }

  hidden() {
    this._dom.style.display = 'none'
  }

  show() {
    this._dom.style.display = 'block'
  }

  destroy() {
    this._dom.removeChild(this._canvas)
    this._dom.remove()
  }

  clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  drawImage(img: HTMLImageElement, scale: number, { x, y }: Position) {
    const { width, height } = img
    this.clearCanvas()
    this._ctx.drawImage(img, x, y, width * scale, height * scale)
  }

  loadImg(img: HTMLImageElement, zoom: number, p: Position) {
    this.drawImage(img, zoom, p)
  }

  getSize() {
    const { width, height } = this._canvas
    return { width, height }
  }
}
