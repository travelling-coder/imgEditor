import { createDiv, createSpan } from '@/infrastructure/createDom'
import { clamp } from '@/infrastructure/math'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType, getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'
import { Slider } from '@/infrastructure/slider'

export class Hardness {
  private _slider: Slider

  constructor(
    private _id: string,
    private _value: number = 0,
    parent: HTMLDivElement
  ) {
    this._slider = new Slider(this._id, this._value, this.onChange.bind(this))

    const titleDom = createSpan({ content: '硬度: ', className: 'ps-toolbar-title' })
    const sliderDom = this._slider.getDom()
    parent.appendChild(
      createDiv({
        className: ['ps-toolbar-item', 'ps-toolbar-hardness'],
        children: [titleDom, sliderDom]
      })
    )
    messageHandler.on(getMsgType('hardnessIn', this._id), this.hardnessIn.bind(this))
    messageHandler.on(getMsgType('hardnessOut', this._id), this.hardnessOut.bind(this))
  }

  hardnessIn() {
    const value = clamp(Math.floor(this._value / 10) + 10, 0, 100)
    this._slider.updateValue(value)
  }

  hardnessOut() {
    const value = clamp(Math.floor(this._value / 10) - 10, 0, 100)
    this._slider.updateValue(value)
  }

  onChange(value: number) {
    messageHandler.emit(getMsgType('hardnessChange', this._id), value)
  }

  getDom() {
    return this._slider.getDom()
  }
}
