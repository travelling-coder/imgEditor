import { createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'

interface Config {
  color: string
  radius: number
  hardness: number
  opacity: number
}

const defaultConfig: Config = {
  color: 'blue',
  radius: 10,
  hardness: 0,
  opacity: 100
}

export default class Cursor {
  private _point: Position = { x: 0, y: 0 }
  private _type: ToolbarType | undefined
  private _cacheConfig: Map<ToolbarType, Config> = new Map([])
  private _dom: HTMLDivElement
  private _lock = false
  private _cursor: HTMLImageElement = new Image()

  constructor(
    private _id: string,
    private _parent: HTMLDivElement,
    private _config: Config
  ) {
    _parent.appendChild((this._dom = createDiv({ className: 'global-cursor' })))
    _parent.addEventListener('mousemove', this.onMousemove.bind(this))
    messageHandler.on(getMsgType('hardnessChange', this._id), this.updateHardness.bind(this))
    messageHandler.on(getMsgType('radiusChange', this._id), this.updateRadius.bind(this))
    messageHandler.on(getMsgType('opacityChange', this._id), this.updateOpacity.bind(this))
    messageHandler.on(getMsgType('colorChange', this._id), this.updateColor.bind(this))
    messageHandler.on(getMsgType('cursorPosition', this._id), this.updateCursorPosition.bind(this))
    messageHandler.on(getMsgType('cursorHide', this._id), this.hideCursor.bind(this))
    messageHandler.on(getMsgType('cursorLock', this._id), this.onLock.bind(this))
    messageHandler.on(getMsgType('cursorUnlock', this._id), this.onUnlock.bind(this))
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

  onMousemove(e: MouseEvent) {
    var rect = this._parent.getBoundingClientRect()
    var x = e.clientX - rect.left // 鼠标相对于目标元素的X坐标
    var y = e.clientY - rect.top // 鼠标相对于目标元素的Y坐标
    if ((e.target as HTMLElement).closest('.ps-rule')) {
      messageHandler.emit(getMsgType('cursorHide', this._id))
    } else {
      messageHandler.emit(getMsgType('cursorPosition', this._id), { x, y })
    }
  }

  onLock() {
    this._dom.style.display = 'none'
    this._lock = true
  }

  onUnlock() {
    this._dom.style.display = 'block'
    this._lock = false
  }

  hideCursor() {
    this._dom.style.display = 'none'
  }

  updateCursorPosition(p: Position) {
    try {
      if (this._dom.style.display === 'none' && !this._lock) {
        this._dom.style.display = 'block'
      }
      this._point = p
      this._dom.style.left = `${p.x}px`
      this._dom.style.top = `${p.y}px`
    } catch {
      // ignore
    }
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
