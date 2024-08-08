import { Canvas } from './canvas'
import getShortCutManager from './shortCutManager'
import getUndoManager from './undoManager'
import getToolBar from './toolbar'
import getZoom from './zoom'
import { createDiv } from '@/infrastructure/createDom'

export class Container {
  private _dom: HTMLDivElement
  private _preview: Canvas
  private _operate: Canvas
  private _id: string
  private _operateManage: ReturnType<typeof getUndoManager>
  private _shortCutManage: ReturnType<typeof getShortCutManager>
  private _toolbar: ReturnType<typeof getToolBar>
  private _zoom: ReturnType<typeof getZoom>

  constructor(dom: HTMLDivElement, id: string) {
    this._id = id
    dom.className = `${dom.className} ps-container`
    this._dom = dom
    this.setLayout('lr')
    const preview = this._createDom('ps-preview-canvas')
    this._preview = new Canvas(this._id, preview, 'preview')
    // const operate = this._createDom('ps-operate-canvas')
    // this._operate = new Canvas(this._id, operate, 'operate')

    // this._toolbar = getToolBar(this._id, this._createAbsoluteDom())
    // this._zoom = getZoom(this._id, this._createAbsoluteDom())

    // this._operateManage = getUndoManager(this._id)
    // this._shortCutManage = getShortCutManager(this._id, this._dom)
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
}
