import { createDiv, createSpan } from '@/infrastructure/createDom'
import { clamp } from '@/infrastructure/math'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'
import { Slider } from '@/infrastructure/slider'

interface HeaderSliderParams {
  eventKey: string
  showLabel: boolean
  title: string
}

export class HeaderSlider {
  private _slider: Slider
  private _label: HTMLSpanElement | null = null
  private _firstEventTime: number = 0
  private _firstEventTimer: NodeJS.Timeout | null = null

  constructor(
    private _id: string,
    private _value: number = 0,
    parent: HTMLDivElement,
    private _config: HeaderSliderParams
  ) {
    this._slider = new Slider(this._id, this._value, this.onChange.bind(this))

    const titleDom = createSpan({ content: _config.title, className: 'ps-toolbar-title' })
    if (this._config.showLabel) {
      this._label = createSpan({
        content: `${this._value}`,
        style: { width: '20px', textAlign: 'center' }
      })
    }
    const sliderDom = this._slider.getDom()
    parent.appendChild(
      createDiv({
        className: ['ps-toolbar-item', 'ps-toolbar-radius'],
        children: this._label ? [titleDom, this._label, sliderDom] : [titleDom, sliderDom]
      })
    )
  }

  getStep() {
    if (this._firstEventTime === 0) {
      this._firstEventTime = Date.now()
    }
    if (this._firstEventTimer) {
      window.clearTimeout(this._firstEventTimer)
    }
    this._firstEventTimer = setTimeout(() => {
      this._firstEventTime = 0
    }, 100)

    return Math.min(Math.ceil((Date.now() - this._firstEventTime) / 500) || 1, 10)
  }

  in() {
    const value = clamp(this._value + this.getStep(), 0, 100)
    this._slider.updateValue(value)
  }

  out() {
    const value = clamp(this._value - this.getStep(), 0, 100)
    this._slider.updateValue(value)
  }

  onChange(value: number) {
    this._value = value
    this._label && (this._label.textContent = `${value}`)
    messageHandler.emit(getMsgType(this._config.eventKey, this._id), value)
  }

  getDom() {
    return this._slider.getDom()
  }
}
