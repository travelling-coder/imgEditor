import globalConfig from '@/domain/store/globalConfig'
import ColorConverter from './colorConverter'
import { createCanvas, createSvg } from './createDom'

interface BrushConfig {
  color: string
  radius: number
  hardness: number
  opacity: number
}

export class BrushManager {
  private _color: string = '#000000'
  private _radius: number = 10
  private _hardness: number = 0
  private _opacity: number = 100

  private _canvas: HTMLCanvasElement = createCanvas()
  private _ctx = this._canvas.getContext('2d')!

  constructor(
    private _dom: HTMLCanvasElement,
    private _type: string
  ) {}

  updateCursor(config: BrushConfig) {
    this._color = config.color
    this._radius = config.radius
    this._hardness = config.hardness
    this._opacity = config.opacity
  }

  getGradient(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = ColorConverter.hexToRgb(this._color) || { r: 0, g: 0, b: 255 }
    const gradient = ctx.createRadialGradient(
      this._radius,
      this._radius,
      0,
      this._radius,
      this._radius,
      this._radius
    )
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this._opacity / 100})`)
    gradient.addColorStop(
      Math.pow(this._hardness / 100, 1.2),
      `rgba(${r}, ${g}, ${b}, ${this._opacity / 100})`
    )
    gradient.addColorStop(1, 'transparent')

    return gradient
  }

  fillArc(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.arc(this._radius, this._radius, this._radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  drawIcon() {
    if (this._type === 'grab') {
      this._dom.style.cursor = 'grab'
    } else {
      const iconUrl = `${globalConfig.basicIconUrl}${this._type}.svg`
      createSvg(iconUrl).then((svg) => {
        const dom = svg.cloneNode(true)
        dom.setAttribute('width', '20')
        dom.setAttribute('height', '20')
        dom.style.color = '#000'
        const url = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(dom))}`
        this._dom.style.cursor = `url(${url}) 10 ${this._type === 'pen' ? 20 : 10}, auto`
      })
    }
  }

  drawCursor() {
    this._canvas.width = this._radius * 2
    this._canvas.height = this._radius * 2

    if (this._radius > 20) {
      this._dom.classList.remove('hide-course')
    } else {
      this._dom.classList.add('hide-course')
    }

    const gradient = this.getGradient(this._ctx)
    this.fillArc(this._ctx)
    this._ctx.fillStyle = gradient
    this._ctx.fill()
  }
}
