import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'

interface Config {
  color: string
  radius: number
  hardness: number
  opacity: number
}

export default class Cursor {
  private _point: Position = { x: 0, y: 0 }
  private _type: ToolbarType | undefined
  private _cacheConfig: Map<ToolbarType, Config> = new Map()
  private _dom: HTMLDivElement

  constructor(
    private _id: string,
    private _parent: HTMLDivElement,
    private _config: Config
  ) {
    this._dom = createDiv({ className: 'global-cursor' })
    _parent.appendChild(this._dom)
    messageHandler.on(getMsgType('hardnessChange', this._id), this.updateHardness.bind(this))
    messageHandler.on(getMsgType('radiusChange', this._id), this.updateRadius.bind(this))
    messageHandler.on(getMsgType('opacityChange', this._id), this.updateOpacity.bind(this))
    messageHandler.on(getMsgType('colorChange', this._id), this.updateColor.bind(this))
  }

  updateType(type: ToolbarType) {
    this._type = type
    this._config = this._cacheConfig.get(type) || this._config
    this.updateConfig()
  }

  updateColor(color: string) {
    this._config.color = color
    this.updateConfig()
  }

  updateRadius(radius: number) {
    this._config.radius = radius
    this.updateConfig()
  }

  updateHardness(hardness: number) {
    this._config.hardness = hardness
    this.updateConfig()
  }

  updateOpacity(opacity: number) {
    this._config.opacity = opacity
    this.updateConfig()
  }

  updateCursorPosition(p: Position) {
    this._point = p
    this._dom.style.left = `${p.x}px`
    this._dom.style.top = `${p.y}px`
  }

  updateConfig() {
    switch (this._type) {
      case 'easer':
        break

      case 'pen':
        break

      case 'pencil':
        break

      case 'undo':
        break

      case 'redo':
        break
    }
  }
}
