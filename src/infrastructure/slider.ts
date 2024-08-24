import { createDiv } from './createDom'
import { preventDefault } from './helper'
import { clamp } from './math'
import polyMousemove from './polyMousemove'
import { Tooltip } from './tooltip'

export class Slider {
  private _dom: HTMLDivElement
  private _bg: HTMLDivElement
  private _handler: HTMLDivElement
  private _tooltip: Tooltip

  constructor(
    private _id: string,
    public value: number,
    private _onChange: (value: number) => void
  ) {
    this._handler = createDiv({
      className: 'slider-handler'
    })
    this._bg = createDiv({
      className: 'slider-bg',
      children: [this._handler]
    })
    this._dom = createDiv({
      className: 'slider-container',
      children: [this._bg]
    })
    this._tooltip = new Tooltip(this._dom, value.toString(), {
      withMouse: true,
      position: 'bottom'
    })

    this.updateClassValue(value)
    this._handler.addEventListener('mouseenter', this.checkValue)

    polyMousemove(this._dom, {
      onDown: this.onDown.bind(this),
      onMove: this.onMove.bind(this),
      onUp: this.onUp.bind(this)
    })
  }

  show() {
    this._dom.style.display = 'block'
  }

  hide() {
    this._dom.style.display = 'none'
  }

  checkValue = () => {
    this._tooltip.updateContent(this.value.toString())
  }

  updateClassValue(value: number) {
    this._handler.style.left = `${value}%`
    this.value = value
    this.checkValue()
  }

  updateValue(value: number) {
    this.updateClassValue(value)
    this._onChange(value)
  }

  updateByEvent(event: MouseEvent) {
    const rect = this._dom.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const percentX = Math.round((offsetX * 105) / rect.width) - 2

    this.updateValue(clamp(percentX, 0, 100))
  }

  onDown(event: MouseEvent) {
    document.body.classList.add('no-select')
    this.updateByEvent(event)
    this._tooltip.updateDisplay({ keep: true })
    return true
  }

  onMove(event: MouseEvent, state: boolean) {
    if (state) {
      this.updateByEvent(event)
    }
    preventDefault(event)
  }

  onUp() {
    this._tooltip.updateDisplay({ keep: false })
    document.body.classList.remove('no-select')
  }

  getDom() {
    return this._dom
  }
}
