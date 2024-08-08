import { genId } from '@/infrastructure/math'
import getRule from './rule'

export class Canvas {
  private _dom: HTMLDivElement

  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _id: string
  private _type: string

  private _rule: ReturnType<typeof getRule>

  constructor(id: string, dom: HTMLDivElement, type: string) {
    dom.classList.add('ps-canvas-container')
    this._type = type
    this._dom = dom
    this._id = id
    this._canvas = document.createElement('canvas')
    this._ctx = this._canvas.getContext('2d')!
    this._dom.appendChild(this._canvas)
    this._rule = getRule(`${id}`, this._dom, type)
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
