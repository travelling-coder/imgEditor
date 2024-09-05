import { createDiv } from '@/infrastructure/createDom'
import getToolBar from './components/toolbar'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType, getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'
import getZoom from './components/zoom'
import { HeaderSlider } from '@/infrastructure/headerSlider'
import { showCursorToolbarType } from './constants'

export default class Header {
  private _toolbar: ReturnType<typeof getToolBar>
  private _zoom: ReturnType<typeof getZoom>
  private _hardness: HeaderSlider
  private _radius: HeaderSlider
  private _opacity: HeaderSlider

  constructor(
    private _id: string,
    header: HTMLDivElement
  ) {
    this._toolbar = getToolBar(this._id, header.appendChild(createDiv()))
    this._zoom = getZoom(this._id, header.appendChild(createDiv()))

    this._hardness = new HeaderSlider(this._id, 0, header, {
      showLabel: true,
      eventKey: 'hardnessChange',
      title: '硬度'
    })
    this._radius = new HeaderSlider(this._id, 10, header, {
      showLabel: true,
      eventKey: 'radiusChange',
      title: '半径',
      format(val) {
        return Math.max(val * 2, 10)
      },
      parse(val) {
        return val / 2
      }
    })
    this._opacity = new HeaderSlider(this._id, 0, header, {
      showLabel: true,
      eventKey: 'opacityChange',
      title: '不透明度'
    })

    this.init()
  }

  init() {
    const radius = this._radius
    const hardness = this._hardness
    const opacity = this._opacity

    messageHandler
      .on(getSortCutMsgType('radiusIn', this._id), radius.in.bind(radius))
      .on(getSortCutMsgType('radiusOut', this._id), radius.out.bind(radius))
      .on(getSortCutMsgType('hardnessIn', this._id), hardness.in.bind(hardness))
      .on(getSortCutMsgType('hardnessOut', this._id), hardness.out.bind(hardness))
      .on(getSortCutMsgType('opacityIn', this._id), opacity.in.bind(opacity))
      .on(getSortCutMsgType('opacityOut', this._id), opacity.out.bind(opacity))
      .on(getMsgType('toolbarType', this._id), this.updateType.bind(this))
  }

  updateType(type: ToolbarType) {
    const toolbars = [this._radius, this._hardness, this._opacity]

    if (showCursorToolbarType.includes(type)) {
      toolbars.forEach((item) => item.show())
    } else {
      toolbars.forEach((item) => item.hide())
    }
  }
}
