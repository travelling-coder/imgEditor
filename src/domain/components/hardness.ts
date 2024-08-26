import { createDiv, createSpan } from '@/infrastructure/createDom'
import { clamp } from '@/infrastructure/math'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType, getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'
import { Slider } from '@/infrastructure/slider'

export class Hardness {
  private _slider: Slider
  private _label: HTMLSpanElement | null = null

  constructor(
    private _id: string,
    private _value: number = 0,
    parent: HTMLDivElement,
    showLabel = true
  ) {
    this._slider = new Slider(this._id, this._value, this.onChange.bind(this))

    const titleDom = createSpan({ content: '硬度: ', className: 'ps-toolbar-title' })
    if (showLabel) {
      this._label = createSpan({
        content: `${this._value}`,
        style: { width: '20px', textAlign: 'center' }
      })
    }
    const sliderDom = this._slider.getDom()
    parent.appendChild(
      createDiv({
        className: ['ps-toolbar-item', 'ps-toolbar-hardness'],
        children: this._label ? [titleDom, this._label, sliderDom] : [titleDom, sliderDom]
      })
    )
  }

  hardnessIn() {
    const value = clamp(this._value + 1, 0, 100)
    this._slider.updateValue(value)
  }

  hardnessOut() {
    const value = clamp(this._value - 1, 0, 100)
    this._slider.updateValue(value)
  }

  onChange(value: number) {
    this._value = value
    this._label && (this._label.textContent = `${value}`)
    messageHandler.emit(getMsgType('hardnessChange', this._id), value)
  }

  getDom() {
    return this._slider.getDom()
  }
}
