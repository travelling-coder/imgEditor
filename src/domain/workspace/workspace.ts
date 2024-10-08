import { Canvas } from './canvas'
import getSortCutManager from '@/domain/scheduler/sortCutManager'
import getUndoManager from '@/domain/scheduler/undoManager'
import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'
import Header from './header'
import { DrawMap } from './drawMap'

const defaultPending = 20

export class Workspace {
  private _dom: HTMLDivElement
  private _content: HTMLDivElement
  private _preview: Canvas
  private _operate: Canvas
  private _id: string
  private _pending: number
  private _drawMap: DrawMap

  constructor(dom: HTMLDivElement, id: string, pending = defaultPending) {
    this._id = id
    this._pending = pending
    dom.className = `${dom.className} ps-container`
    this._dom = dom

    this._drawMap = new DrawMap(this._id)
    new Header(this._id, this._createDom('ps-header'))
    this._content = this._createDom('ps-content')

    this._operate = new Canvas(
      this._id,
      this._createDom('ps-operate-canvas', true, this._content),
      'operate',
      this._pending,
      this._drawMap
    )

    this._preview = new Canvas(
      this._id,
      this._createDom('ps-preview-canvas', true, this._content),
      'preview',
      this._pending,
      this._drawMap
    )

    getUndoManager(this._id)
    getSortCutManager({}).bindDom(id, dom)
    this.setLayout('lr')
  }

  private _createDom = (className?: string, withDefaultStyle?: boolean, dom?: HTMLDivElement) => {
    const div = createDiv({
      className,
      style: withDefaultStyle ? { flex: '1', backgroundColor: 'white' } : {}
    })
    ;(dom || this._dom).appendChild(div)
    return div
  }

  getPreview() {
    return this._preview
  }

  getOperate() {
    return this._operate
  }

  setLayout(type: 'lr' | 'tb' | 'rl' | 'bt') {
    switch (type) {
      case 'lr':
        this._content.style.flexDirection = 'row'
        break
      case 'tb':
        this._content.style.flexDirection = 'column'
        break
      case 'rl':
        this._content.style.flexDirection = 'row-reverse'
        break
      case 'bt':
        this._content.style.flexDirection = 'column-reverse'
        break
    }
  }

  destroy() {
    this._operate.destroy()
    this._operate.destroy()
    this._dom.remove()
  }

  id() {
    return this._id
  }

  initWorkspace(src: string) {
    const img = new Image()
    img.src = src
    img.onload = () => {
      const { width, height } = img
      const { width: canvasWidth, height: canvasHeight } = this._preview.getSize()

      const scale = Math.min((canvasWidth * 0.8) / width, (canvasHeight * 0.8) / height)
      const x = Math.floor((canvasWidth - width * scale) / 2)
      const y = Math.floor((canvasHeight - height * scale) / 2)

      messageHandler.emit(getMsgType('zoomInit', this._id), {
        // zoom: Math.floor(scale * 100),
        zoom: 200,
        // zeroPoint: { x, y }
        zeroPoint: { x: -300, y: -200 }
      })
      // messageHandler.emit(getMsgType('zeroPoint', this._id), { x, y })
      messageHandler.emit(getMsgType('zeroPoint', this._id), { x: -300, y: -200 })

      this._drawMap.loadImg(img)
      this._preview.loadImg()
      this._operate.loadImg()
    }
  }
}
