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
  }
]

export class Toolbar {
  private _dom: HTMLDivElement
  private _basicIconUrl: string
  private _options: ToolbarOptions[]

  constructor(
    id: string,
    dom: HTMLDivElement,
    basicIconUrl: string = '@assets/icons/',
    options: ToolbarOptions[] = defaultConfig
  ) {
    this._dom = dom
    this._basicIconUrl = basicIconUrl
    this._options = options.map((option) => ({
      ...option,
      icon: `${this._basicIconUrl}${option.icon}.svg`
    }))
  }

  init() {
    for (let option of this._options) {
      const { type, icon, title } = option
      const button = document.createElement('button')
      button.type = 'button'
      button.title = title
      button.innerHTML = `<img src="${icon}">`
      button.addEventListener('click', () => {
        // this.emit(type)
      })
      this._dom.appendChild(button)
    }
  }

  options() {
    return this._options
  }
}
