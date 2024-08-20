import { Canvas } from './canvas'
import getShortCutManager from './scheduler/shortCutManager'
import getUndoManager from './scheduler/undoManager'
import getToolBar from './components/toolbar'
import getZoom from './components/zoom'
import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'
import { Hardness } from './components/hardness'

const defaultPending = 30

export class Container {
  private _dom: HTMLDivElement
  private _preview: Canvas
  private _operate: Canvas
  private _id: string
  private _operateManage: ReturnType<typeof getUndoManager>
  private _shortCutManage: ReturnType<typeof getShortCutManager>
  private _toolbar: ReturnType<typeof getToolBar>
  private _zoom: ReturnType<typeof getZoom>
  private _pending: number

  constructor(dom: HTMLDivElement, id: string, pending = defaultPending) {
    this._id = id
    this._pending = pending
    dom.className = `${dom.className} ps-container`
    this._dom = dom
    this.setLayout('lr')

    // const preview = this._createDom('ps-preview-canvas')
    // this._preview = new Canvas(this._id, preview, 'preview', this._pending)
    // const operate = this._createDom('ps-operate-canvas')
    // this._operate = new Canvas(this._id, operate, 'operate', this._pending)

    // this._toolbar = getToolBar(this._id, this._createAbsoluteDom())
    // this._zoom = getZoom(this._id, this._createAbsoluteDom())

    const header = this._createDom('ps-header')
    new Hardness(this._id, 50, header)

    this._operateManage = getUndoManager(this._id)
    this._shortCutManage = getShortCutManager(this._id, this._dom)
  }

  private _createDom = (className?: string) => {
    const div = createDiv({ className, style: { flex: '1', backgroundColor: 'white' } })
    this._dom.appendChild(div)
    return div
  }

  private _createAbsoluteDom = () => {
    const div = createDiv({ style: { position: 'absolute' } })
    this._dom.appendChild(div)
    return div
  }

  getPreview() {
    return this._preview
  }

  getOperate() {
    return this._operate
  }

  setLayout(type: 'lr' | 'tb' | 'rl' | 'bt') {
    this._dom.style.display = 'flex'
    this._dom.style.overflow = 'hidden'
    switch (type) {
      case 'lr':
        this._dom.style.flexDirection = 'row'
        break
      case 'tb':
        this._dom.style.flexDirection = 'column'
        break
      case 'rl':
        this._dom.style.flexDirection = 'row-reverse'
        break
      case 'bt':
        this._dom.style.flexDirection = 'column-reverse'
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

      messageHandler.emit(getMsgType('zoomInit', this._id), { zoom: Math.floor(scale * 100) })
      messageHandler.emit(getMsgType('zeroPoint', this._id), { x, y })

      this._preview.loadImg(img)
      this._operate.loadImg(img)
    }
  }
}
