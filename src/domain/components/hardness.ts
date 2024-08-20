import { createDiv, createSpan } from '@/infrastructure/createDom'
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
  }

  onChange(value: number) {
    console.log(value)
  }

  getDom() {
    return this._slider.getDom()
  }
}
