import { Canvas } from './canvas'
import getShortCutManager from './shortCutManager'
import getUndoManager from './undoManager'

export class Container {
  private _dom: HTMLDivElement
  private _preview: Canvas
  private _operate: Canvas
  private _id: string
  private _operateManage: ReturnType<typeof getUndoManager>
  private _shortCutManage: ReturnType<typeof getShortCutManager>

  constructor(dom: HTMLDivElement) {
    this._id = Math.random().toString(36).substr(2, 9)
    dom.className = `${dom.className} ps-container`
    this._dom = dom
    this.setLayout('lr')
    const preview = this._createDom()
    this._preview = new Canvas(preview)
    const operate = this._createDom()
    this._operate = new Canvas(operate)
    this._operateManage = getUndoManager(this._id)
    this._shortCutManage = getShortCutManager(this._id, this._dom)
  }

  private _createDom = () => {
    const preview = document.createElement('div')
    preview.style.flex = '1'
    preview.style.backgroundColor = 'white'
    this._dom.appendChild(preview)
    return preview
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
