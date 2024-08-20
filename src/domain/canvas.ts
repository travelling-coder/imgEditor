import { createCanvas } from '@/infrastructure/createDom'
import getRule from './components/rule'
import messageHandler from '@/infrastructure/messageHandler'
import polyMousemove from '@/infrastructure/polyMousemove'
import { onMove, onDown, onUp } from './handler/drag'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'

export class Canvas {
  private _dom: HTMLDivElement

  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _id: string
  private _type: string

  private _rule: ReturnType<typeof getRule>
  private _pending: number
  zoom: number = 100
  zeroPoint: Position = { x: 0, y: 0 }
  img: HTMLImageElement | null = null

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

    messageHandler.on(getMsgType('zoomChange', this._id), (data: { zoom: number }) => {
      this.zoom = data.zoom
      this.drawImage()
    })
    messageHandler.on(getMsgType('zeroPoint', this._id), (data: Position) => {
      this.zeroPoint = data
      this.drawImage()
    })

    polyMousemove(this._canvas, {
      onDown: (e) => {
        return onDown.bind(this)(e, this.zeroPoint)
      },
      onMove: (e, s) => {
        messageHandler.emit(getMsgType('zeroPoint', this._id), onMove(e, s))
      },
      onUp: (e, s) => {
        messageHandler.emit(getMsgType('zeroPoint', this._id), onUp(e, s))
      }
    })
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

  drawImage() {
    if (this.img) {
      const { width, height } = this.img!
      const { x, y } = this.zeroPoint
      const scale = this.zoom / 100
      this.clearCanvas()
      this._ctx.drawImage(this.img!, x, y, width * scale, height * scale)
    }
  }

  loadImg(img: HTMLImageElement) {
    this.img = img
    this.drawImage()
  }

  getSize() {
    const { width, height } = this._canvas
    return { width, height }
  }
}
