import messageHandler from '@/infrastructure/messageHandler'

const defaultConfig: ToolbarOptions[] = [
  {
    type: 'undo',
    icon: 'undo',
    title: 'Undo'
  },
  {
    type: 'redo',
    icon: 'redo',
    title: 'redo'
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

export class Toolbar {
  private _dom: HTMLDivElement
  private _basicIconUrl: string
  private _options: ToolbarOptions[]
  private _parser: DOMParser = new DOMParser()
  private _domList: HTMLDivElement[] = []

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
    const { type, icon, title } = option
    const module = (await import(icon)).default
    const svgDoc = this._parser.parseFromString(await (await fetch(module)).text(), 'image/svg+xml')
    const svgElement = svgDoc.documentElement

    const div = document.createElement('div')
    div.appendChild(svgElement)
    div.title = title
    div.className = type
    div.addEventListener('click', () => {
      this.onClick(div)
      this.emitToolbarEvent(type)
    })
    this._dom.appendChild(div)
    this._domList.push(div)
  }

  async initOptions() {
    for (let option of this._options) {
      this.createOptionDom(option)
    }
  }

  onClick(div: HTMLDivElement) {
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
