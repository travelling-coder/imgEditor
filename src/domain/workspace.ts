import { Canvas } from './canvas'
import getSortCutManager from './scheduler/sortCutManager'
import getUndoManager from './scheduler/undoManager'
import getToolBar from './components/toolbar'
import getZoom from './components/zoom'
import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'
import { Hardness } from './components/hardness'

const defaultPending = 30

export class Workspace {
  private _dom: HTMLDivElement
  private _content: HTMLDivElement
  private _preview: Canvas
  private _operate: Canvas
  private _id: string
  private _operateManage: ReturnType<typeof getUndoManager>
  private _shortCutManage: ReturnType<typeof getSortCutManager>
  private _toolbar: ReturnType<typeof getToolBar>
  private _zoom: ReturnType<typeof getZoom>
  private _pending: number

  constructor(dom: HTMLDivElement, id: string, pending = defaultPending) {
    this._id = id
    this._pending = pending
    dom.className = `${dom.className} ps-container`
    this._dom = dom

    const header = this._createDom('ps-header')
    new Hardness(this._id, 50, header)

    this._content = this._createDom('ps-content')

    const preview = this._createDom('ps-preview-canvas', true, this._content)
    this._preview = new Canvas(this._id, preview, 'preview', this._pending)
    const operate = this._createDom('ps-operate-canvas', true, this._content)
    this._operate = new Canvas(this._id, operate, 'operate', this._pending)

    this._toolbar = getToolBar(this._id, this._createAbsoluteDom())
    this._zoom = getZoom(this._id, this._createAbsoluteDom())

    this._operateManage = getUndoManager(this._id)
    this._shortCutManage = getSortCutManager({}).bindDom(id, dom)

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
        zoom: Math.floor(scale * 100),
        zeroPoint: { x, y }
      })
      messageHandler.emit(getMsgType('zeroPoint', this._id), { x, y })

      this._preview.loadImg(img)
      this._operate.loadImg(img)
    }
  }
}
