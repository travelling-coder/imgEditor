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

  constructor(
    dom: HTMLDivElement,
    basicIconUrl: string,
    options: ToolbarOptions[] = defaultConfig
  ) {
    this._dom = dom
    this._basicIconUrl = basicIconUrl
  }
}
