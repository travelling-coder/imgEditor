import { createDiv } from '@/infrastructure/createDom'
import getToolBar from './components/toolbar'
import { Hardness } from './components/hardness'
import { Radius } from './components/radius'
import messageHandler from '@/infrastructure/messageHandler'
import { getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'
import getZoom from './components/zoom'

export default class Header {
  private _toolbar: ReturnType<typeof getToolBar>
  private _zoom: ReturnType<typeof getZoom>
  private _hardness: Hardness
  private _radius: Radius

  constructor(
    private _id: string,
    header: HTMLDivElement
  ) {
    this._toolbar = getToolBar(this._id, header.appendChild(createDiv()))
    this._zoom = getZoom(this._id, header.appendChild(createDiv()))
    this._hardness = new Hardness(this._id, 0, header)
    this._radius = new Radius(this._id, 0, header)

    this.init()
  }

  init() {
    const radius = this._radius
    const hardness = this._hardness

    messageHandler.on(getSortCutMsgType('radiusIn', this._id), radius.radiusIn.bind(radius))
    messageHandler.on(getSortCutMsgType('radiusOut', this._id), radius.radiusOut.bind(radius))

    messageHandler.on(getSortCutMsgType('hardnessIn', this._id), hardness.hardnessIn.bind(hardness))
    messageHandler.on(
      getSortCutMsgType('hardnessOut', this._id),
      hardness.hardnessOut.bind(hardness)
    )
  }
}
