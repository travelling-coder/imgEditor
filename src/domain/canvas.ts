export class Canvas {
  private _dom: HTMLDivElement

  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D

  constructor(dom: HTMLDivElement) {
    this._dom = dom
    this._canvas = document.createElement('canvas')
    this._ctx = this._canvas.getContext('2d')!
    this._dom.appendChild(this._canvas)
    setTimeout(() => {
      this._canvas.width = this._dom.clientWidth
      this._canvas.height = this._dom.clientHeight
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
}
