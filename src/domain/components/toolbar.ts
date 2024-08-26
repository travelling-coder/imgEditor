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
    type: 'pencil',
    icon: 'pencil',
    title: 'pencil'
  },
  {
    type: 'pen',
    icon: 'pen',
    title: 'pen'
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
  private _activeOption: string | null = null
  private _id: string
  private _domMap: Map<string, HTMLDivElement> = new Map()

  constructor(
    id: string,
    dom: HTMLDivElement,
    basicIconUrl: string = '../assets/icons/',
    options: ToolbarOptions[] = defaultConfig
  ) {
    this._id = id
    this._dom = dom
    this._basicIconUrl = basicIconUrl
    this._options = options.map((option) => ({
      ...option,
      icon: `${this._basicIconUrl}${option.icon}.svg`
    }))
    this.init()
  }

  init() {
    this.initDom()
    this.initOptions()
  }

  initDom() {
    this._dom.classList.add('ps-toolbar')
  }

  private async createOptionDom(option: ToolbarOptions) {
    const { type, icon, title, unActiveAble } = option

    const div = createDiv({
      className: [type, 'ps-toolbar-item'],
      children: [await createSvg(icon)],
      style: { flexBasis: '30px' },
      onClick: () => {
        !unActiveAble && this.pick(type)
        this.emitToolbarEvent(type)
      },
      title
    })
    this._dom.appendChild(div)
    this._domMap.set(type, div)
  }

  async initOptions() {
    for (let option of this._options) {
      await this.createOptionDom(option)
    }
    this.pick(
      localStorage.getItem(localStorageToolbarKey) ||
        this._options.filter((item) => !item.unActiveAble)[0].type
    )
  }

  pick(type: string) {
    if (this._activeOption === type) return
    this._activeOption && this._domMap.get(this._activeOption)?.classList.remove('active')
    this._activeOption = type
    this._domMap.get(type)?.classList.add('active')
  }

  emitToolbarEvent(type: ToolbarType) {
    messageHandler.emit(`toolbar-${type}-${this._id}`)
  }

  options() {
    return this._options
  }
}

export default (id: string, dom: HTMLDivElement) => {
  return getInstance(`toolbar-manager-${id}`, () => new Toolbar(id, dom))
}
