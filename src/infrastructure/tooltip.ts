import { createDiv } from './createDom'
import { debounce, preventDefault } from './helper'
import { clamp } from './math'

interface TooltipConfig {
  position?: 'top' | 'bottom'
  delay?: number
  withMouse?: boolean
  format?: (value: number) => number
}

export class Tooltip {
  private _tooltip: HTMLDivElement
  private _timer: NodeJS.Timeout | null = null
  private _delay: number
  private _withMouse: boolean
  private _format: ((value: number) => number) | undefined

  private _state = {
    enter: false,
    keep: false
  }

  constructor(
    private _dom: HTMLDivElement,
    private _content: string | HTMLElement,
    config: TooltipConfig = {}
  ) {
    const { position = 'top', delay = 0, withMouse, format } = config
    this._withMouse = withMouse || false
    this._delay = delay
    this._format = format

    this._tooltip = createDiv({
      className: ['tooltip', `tooltip-${position}`],
      style: {
        display: 'none'
      },
      content: _content
    })

    this._dom.appendChild(
      createDiv({
        style: {
          width: '100%',
          height: '100%',
          position: 'absolute',
          userSelect: 'none',
          pointerEvents: 'none'
        },
        children: [this._tooltip]
      })
    )

    // this._dom.appendChild(this._tooltip)

    this._dom.addEventListener('mouseenter', this.onEnter.bind(this))
    this._tooltip.addEventListener('mouseenter', this.onEnter.bind(this))
    this._dom.addEventListener('mouseleave', this.onLeave.bind(this))
    this._tooltip.addEventListener('mouseleave', this.onLeave.bind(this))
    withMouse && this._dom.addEventListener('mousemove', this.onMove.bind(this))
    withMouse && this._tooltip.addEventListener('mousemove', preventDefault)
  }

  onEnter() {
    this.updateDisplay({ enter: true })
  }

  onMove(e: MouseEvent) {
    const rect = this._dom.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentX = Math.round((offsetX * 105) / rect.width) - 2
    this._tooltip.style.left = `${clamp(percentX, 0, 100)}%`
    this.updateContent(String(clamp(percentX, 0, 100)))
  }

  onLeave() {
    this.updateDisplay({ enter: false })
  }

  updateContent(content: string | HTMLElement) {
    this._content = content
    this.refreshContent()
    if (this._withMouse && typeof content === 'string') {
      const percent = parseInt(content)
      const value = this._format ? this._format(percent) : percent
      this._content = value.toString()
      this._tooltip.style.left = `${clamp(percent, 0, 100)}%`
    } else {
      this._content = content
    }
    this.refreshContent()
  }

  refreshContent() {
    this._tooltip.innerHTML = ''
    if (typeof this._content === 'string') {
      this._tooltip.innerHTML = this._content
    } else {
      this._tooltip.appendChild(this._content)
    }
  }

  updateDisplay(param: { enter?: boolean; keep?: boolean }) {
    this._state = { ...this._state, ...param }

    if (!this._state.enter && !this._state.keep) {
      this._timer = setTimeout(() => {
        this._tooltip.style.display = 'none'
      }, this._delay)
    } else {
      this._timer && window.clearTimeout(this._timer)
      this._tooltip.style.display = 'block'
    }
  }

  destroy() {
    this._tooltip.remove()

    this._dom.removeEventListener('mouseenter', this.onEnter.bind(this))
    this._tooltip.removeEventListener('mouseenter', this.onEnter.bind(this))
    this._dom.removeEventListener('mouseleave', this.onLeave.bind(this))
    this._tooltip.removeEventListener('mouseleave', this.onLeave.bind(this))
    this._dom.removeEventListener('mousemove', this.onMove.bind(this))
    this._tooltip.removeEventListener('mousemove', preventDefault)
  }
}
