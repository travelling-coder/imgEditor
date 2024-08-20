import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'
import { getInstance } from '@/infrastructure/singleton'

class Zoom {
  private _dom: HTMLDivElement
  private _id: string
  private _maxZoom = 300
  private _minZoom = 10
  private _zoom: number = 100
  private _zoomDom: HTMLDivElement | undefined
  private _fixedZoom: number = 100
  private _zoomInBtn: HTMLDivElement | undefined
  private _zoomOutBtn: HTMLDivElement | undefined

  constructor(id: string, dom: HTMLDivElement) {
    this._dom = dom
    this._id = id
    this.init()
  }

  init() {
    this.initDom()
    messageHandler.on(getMsgType('zoomInit', this._id), this.onInit.bind(this))
    messageHandler.on(getMsgType('zoomIn', this._id), this.zoomIn.bind(this))
    messageHandler.on(getMsgType('zoomOut', this._id), this.zoomOut.bind(this))
  }

  initDom() {
    this._dom.classList.add('ps-zoom')
    this._dom.style.position = 'absolute'
    this._dom.style.bottom = '10px'
    this._dom.style.left = '30px'

    const zoomInBtn = createDiv({
      content: '+',
      style: { display: 'flex', justifyContent: 'center' },
      onClick: this.zoomIn.bind(this),
      attr: { title: '放大' }
    })
    const zoomOutBtn = createDiv({
      content: '-',
      style: { display: 'flex', justifyContent: 'center' },
      onClick: this.zoomOut.bind(this),
      attr: { title: '缩小' }
    })
    const zoomDom = createDiv({
      content: `${this._zoom}%`,
      onClick: this.reset.bind(this),
      attr: { title: '还原尺寸' }
    })
    this._zoomDom = zoomDom
    this._zoomInBtn = zoomInBtn
    this._zoomOutBtn = zoomOutBtn

    this._dom.appendChild(zoomOutBtn)
    this._dom.appendChild(zoomDom)
    this._dom.appendChild(zoomInBtn)
  }

  onInit({ zoom }: { zoom: number }) {
    this._fixedZoom = zoom
    this.onZoom(zoom)
  }

  zoomInAble() {
    return this._zoom < this._maxZoom
  }

  zoomOutAble() {
    return this._zoom > this._minZoom
  }

  checkZoomInAble() {
    if (!this.zoomInAble()) {
      this._zoomInBtn!.classList.add('ps-zoom-disabled')
    } else {
      this._zoomInBtn!.classList.remove('ps-zoom-disabled')
    }
  }

  checkZoomOutAble() {
    if (!this.zoomOutAble()) {
      this._zoomOutBtn!.classList.add('ps-zoom-disabled')
    } else {
      this._zoomOutBtn!.classList.remove('ps-zoom-disabled')
    }
  }

  onZoom(zoom: number) {
    this._zoom = zoom
    this._zoomDom && (this._zoomDom!.innerText = `${this._zoom}%`)
    this.checkZoomInAble()
    this.checkZoomOutAble()
    messageHandler.emit(getMsgType('zoomChange', this._id), { zoom })
  }

  getStep() {
    if (this._zoom <= 50) {
      return 5
    } else if (this._zoom <= 100) {
      return 10
    } else if (this._zoom <= 200) {
      return 20
    } else if (this._zoom <= 500) {
      return 50
    } else {
      return 100
    }
  }

  // 放大
  zoomIn() {
    if (!this.zoomInAble()) return
    const step = this.getStep()
    const newZoom = Math.floor(this._zoom / step) * step + step
    this.onZoom(newZoom)
  }

  // 缩小
  zoomOut() {
    if (!this.zoomOutAble()) return
    const step = this.getStep()
    const newZoom = Math.floor(this._zoom / step) * step - step
    this.onZoom(newZoom)
  }

  reset() {
    this.onZoom(this._fixedZoom)
    messageHandler.emit(getMsgType('zoomChange', this._id), { zoom: this._fixedZoom })
  }

  destroy() {
    messageHandler.off(getMsgType('zoomInit', this._id))
    messageHandler.off(getMsgType('zoomIn', this._id))
    messageHandler.off(getMsgType('zoomOut', this._id))
  }
}

export default (id: string, dom: HTMLDivElement) => {
  return getInstance(`zoom-${id}`, () => new Zoom(id, dom))
}
