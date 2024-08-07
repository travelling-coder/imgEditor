import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getInstance } from '@/infrastructure/singleton'

class Zoom {
  private _dom: HTMLDivElement
  private _id: string
  private _maxZoom = 300
  private _minZoom = 10
  private _zoom: number = 100
  private _zoomDom: HTMLDivElement | undefined
  private _fixedZoom: number = 100

  constructor(id: string, dom: HTMLDivElement) {
    this._dom = dom
    this._id = id
    this.init()
  }

  init() {
    this.initDom()
    messageHandler.emit(`zoom-${this._id}`, { zoom: this._zoom })
    messageHandler.on(`zoom-${this._id}`, this.onZoom)
    messageHandler.on(`zoom-in-${this._id}`, this.zoomIn)
    messageHandler.on(`zoom-out-${this._id}`, this.zoomOut)
  }

  initDom() {
    this._dom.classList.add('ps-zoom')
    this._dom.style.position = 'absolute'
    this._dom.style.bottom = '10px'
    this._dom.style.left = '10px'

    const zoomInBtn = createDiv({
      content: '+',
      style: { display: 'flex', justifyContent: 'center' }
    })
    const zoomOutBtn = createDiv({
      content: '-',
      style: { display: 'flex', justifyContent: 'center' }
    })
    const zoomDom = createDiv({ content: `${this._zoom}%` })

    this._dom.appendChild(zoomOutBtn)
    this._dom.appendChild(zoomDom)
    this._dom.appendChild(zoomInBtn)
  }

  onZoom(data: { zoom: number }) {
    this._zoom = data.zoom
  }

  // 放大
  zoomIn() {
    // this._zoom += this._step
    // if (this._zoom > 200) {
    //   this._zoom = 200
    // }
  }

  // 缩小
  zoomOut() {}

  reset() {
    this._zoom = this._fixedZoom
    messageHandler.emit(`zoom-${this._id}`, { zoom: this._zoom })
  }

  destroy() {
    messageHandler.off(`zoom-${this._id}`)
    messageHandler.off(`zoom-in-${this._id}`)
    messageHandler.off(`zoom-out-${this._id}`)
  }
}

export default (id: string, dom: HTMLDivElement) => {
  return getInstance(`zoom-${id}`, () => new Zoom(id, dom))
}
