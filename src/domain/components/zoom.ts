import { createDiv, createSpan } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType, getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'
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
  private _zeroPoint: Position = { x: 0, y: 0 }
  private _currentZoom: HTMLSpanElement | undefined

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
    messageHandler.on(getSortCutMsgType('zoomReset', this._id), this.reset.bind(this))
    messageHandler.on(getSortCutMsgType('zoomIn', this._id), this.zoomIn.bind(this))
    messageHandler.on(getSortCutMsgType('zoomOut', this._id), this.zoomOut.bind(this))
  }

  initDom() {
    this._dom.classList.add('ps-zoom')

    this._currentZoom = createSpan({ content: `${this._zoom}%` })

    const zoomInBtn = createDiv({
      content: '+',
      style: { display: 'flex', justifyContent: 'center' },
      onClick: this.zoomIn.bind(this),
      title: 'zoom in'
    })
    const zoomOutBtn = createDiv({
      content: '-',
      style: { display: 'flex', justifyContent: 'center' },
      onClick: this.zoomOut.bind(this),
      title: 'zoom out'
    })
    const zoomDom = createDiv({
      content: this._currentZoom,
      onClick: this.reset.bind(this),
      title: 'reset zoom'
    })
    this._zoomDom = zoomDom
    this._zoomInBtn = zoomInBtn
    this._zoomOutBtn = zoomOutBtn

    this._dom.appendChild(zoomOutBtn)
    this._dom.appendChild(zoomDom)
    this._dom.appendChild(zoomInBtn)
  }

  onInit({ zoom, zeroPoint }: { zoom: number; zeroPoint: Position }) {
    this._fixedZoom = zoom
    this._zeroPoint = zeroPoint
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
    this._currentZoom && (this._currentZoom!.innerText = `${this._zoom}%`)
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

  // to lager zoom
  zoomIn() {
    if (!this.zoomInAble()) return
    const step = this.getStep()
    const newZoom = Math.floor(this._zoom / step) * step + step
    this.onZoom(newZoom)
  }

  // to smaller zoom
  zoomOut() {
    if (!this.zoomOutAble()) return
    const step = this.getStep()
    if (this._zoom % step === 0) {
      this.onZoom(this._zoom - step)
    } else {
      this.onZoom(this._zoom - (this._zoom % step))
    }
    // const newZoom = Math.floor(this._zoom / step) * step - step
    // this.onZoom(newZoom)
  }

  reset() {
    this.onZoom(this._fixedZoom)
    messageHandler.emit(getMsgType('zoomChange', this._id), { zoom: this._fixedZoom })
    messageHandler.emit(getMsgType('zeroPoint', this._id), this._zeroPoint)
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
