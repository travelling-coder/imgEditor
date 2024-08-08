import { createDiv, createSvg } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getInstance } from '@/infrastructure/singleton'

const defaultConfig: ToolbarOptions[] = [
  {
    type: 'undo',
    icon: 'undo',
    title: 'Undo',
    unActiveAble: true
  },
  {
    type: 'redo',
    icon: 'redo',
    title: 'redo',
    unActiveAble: true
  },
  {
    type: 'pen',
    icon: 'pen',
    title: 'pen'
  },
  {
    type: 'pencil',
    icon: 'pencil',
    title: 'pencil'
  },
  {
    type: 'easer',
    icon: 'easer',
    title: 'easer'
  }
]

const localStorageToolbarKey = 'ps-toolbar-option'

class Toolbar {
  private _dom: HTMLDivElement
  private _basicIconUrl: string
  private _options: ToolbarOptions[]
  private _parser: DOMParser = new DOMParser()
  private _domList: HTMLDivElement[] = []
  private _activeOption: string | null = null

  constructor(
    id: string,
    dom: HTMLDivElement,
    basicIconUrl: string = '../assets/icons/',
    options: ToolbarOptions[] = defaultConfig
  ) {
    this._dom = dom
    this._basicIconUrl = basicIconUrl
    this._options = options.map((option) => ({
      ...option,
      icon: `${this._basicIconUrl}${option.icon}.svg`
    }))
    this._activeOption =
      localStorage.getItem(localStorageToolbarKey) ||
      options.filter((item) => !item.unActiveAble)[0].type
    this.init()
  }

  init() {
    this.initDom()
    this.initOptions()
  }

  initDom() {
    this._dom.classList.add('ps-toolbar')
    this._dom.style.position = 'absolute'
    this._dom.style.top = '10px'
    this._dom.style.left = '10px'
  }

  private async createOptionDom(option: ToolbarOptions) {
    const { type, icon, title, unActiveAble } = option

    const div = createDiv({
      className: type,
      title,
      children: [await createSvg(icon)],
      style: { flexBasis: '30px' },
      onClick: () => {
        !unActiveAble && this.onClick(div, type)
        this.emitToolbarEvent(type)
      }
    })
    this._dom.appendChild(div)
    this._domList.push(div)
    if (type === this._activeOption) {
      this.onClick(div, type)
    }
  }

  async initOptions() {
    for (let option of this._options) {
      this.createOptionDom(option)
    }
  }

  onClick(div: HTMLDivElement, type: string) {
    this._activeOption = type
    this._domList.forEach((item) => {
      item.classList.remove('active')
    })
    div.classList.add('active')
  }

  emitToolbarEvent(type: ToolbarType) {
    messageHandler.emit(type)
  }

  options() {
    return this._options
  }
}

export default (id: string, dom: HTMLDivElement) => {
  return getInstance(`toolbar-manager-${id}`, () => new Toolbar(id, dom))
}
