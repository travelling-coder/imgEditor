import { createCanvas } from '@/infrastructure/createDom'
import getRule from '@/domain/components/rule'
import messageHandler from '@/infrastructure/messageHandler'
import polyMousemove from '@/infrastructure/polyMousemove'
import { onMove, onDown, onUp } from '@/domain/handler/drag'
import { getMsgType, getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'
import Cursor from '@/domain/components/cursor'
import type { DrawMap } from './drawMap'

export class Canvas {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D

  private _rule: ReturnType<typeof getRule>
  private _dragging: boolean = false
  private _dragEndCb: VoidFunction | null = null
  zoom: number = 100
  zeroPoint: Position = { x: 0, y: 0 }

  constructor(
    private _id: string,
    private _dom: HTMLDivElement,
    private _type: 'preview' | 'operate',
    private _pending: number,
    private _drawMap: DrawMap
  ) {
    _dom.classList.add('ps-canvas-container')
    this._canvas = createCanvas({
      style: { position: 'absolute', top: `${this._pending}px`, left: `${this._pending}px` }
    })
    this._ctx = this._canvas.getContext('2d')!
    this._ctx.globalCompositeOperation = 'destination-over'
    this._dom.appendChild(this._canvas)
    this._rule = getRule(`${_id}`, this._dom, _type, this._pending)
    new Cursor(_id, _dom, { color: '', radius: 5, hardness: 0, opacity: 0 })
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

    messageHandler.on(
      getSortCutMsgType('start-drag', this._id),
      this.updateDragStatus.bind(this, true)
    )

    messageHandler.on(
      getSortCutMsgType('end-drag', this._id),
      this.updateDragStatus.bind(this, false)
    )
  }

  updateDragStatus(start = true) {
    if (this._dragging === start) {
      return
    } else if (start) {
      this._dom.classList.add('no-course')
      document.body.classList.add('dragable')
      this._dragEndCb = polyMousemove(this._canvas, {
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
    } else {
      this._dom.classList.remove('no-course')
      document.body.classList.remove('dragable')
      this._dragEndCb?.()
    }
    this._dragging = start
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

  setCompositeOperation(init?: boolean) {
    if (init) {
      this._ctx.globalCompositeOperation = 'copy'
      this._ctx.globalAlpha = 1
    } else {
      this._ctx.globalCompositeOperation =
        this._type === 'operate' ? 'source-over' : 'destination-in'
      this._ctx.globalAlpha = this._type === 'operate' ? 0.6 : 1
    }
  }

  drawImage() {
    if (this._drawMap?.source) {
      const { source } = this._drawMap
      this.setCompositeOperation(true)
      const { width, height } = source!
      const { x, y } = this.zeroPoint
      const scale = this.zoom / 100
      this.clearCanvas()
      this._ctx.drawImage(source!, x, y, width * scale, height * scale)
      this.drawMap()
    }
  }

  loadImg() {
    this.drawImage()
  }

  drawMap() {
    const canvas = this._drawMap.canvas
    this.setCompositeOperation()
    if (this._drawMap) {
      switch (this._type) {
        case 'preview':
          this._ctx.drawImage(
            canvas,
            this.zeroPoint.x,
            this.zeroPoint.y,
            (canvas.width * this.zoom) / 100,
            (canvas.height * this.zoom) / 100
          )
          break
        case 'operate':
          this._ctx.drawImage(
            canvas,
            this.zeroPoint.x,
            this.zeroPoint.y,
            (canvas.width * this.zoom) / 100,
            (canvas.height * this.zoom) / 100
          )
          break
      }
    }
  }

  getSize() {
    const { width, height } = this._canvas
    return { width, height }
  }
}
