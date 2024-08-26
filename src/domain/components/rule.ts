import { createCanvas, createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getInstance } from '@/infrastructure/singleton'
import { HelpLineManager } from './helpLine'
import { ctxDrawLine, ctxDrawText } from '@/infrastructure/canvasDrawer'
import polyMousemove from '@/infrastructure/polyMousemove'
import { genId } from '@/infrastructure/math'
import { debounce, throttle } from '@/infrastructure/helper'
import { getMsgType } from '@/infrastructure/messageHandlerConstants'

export class Rule {
  private _ruleH: HTMLCanvasElement
  private _ruleV: HTMLCanvasElement
  private _ruleM: HTMLDivElement
  private _ruleC: HTMLDivElement
  private _id: string
  private _helper: HelpLineManager
  private _zoom = 100
  private _zeroPoint: Position = { x: 160, y: 100 }
  private _color = '#000'
  private _step = 0
  private _pending: number

  constructor(id: string, dom: HTMLDivElement, pending: number) {
    this._pending = pending
    // vertical ruler
    this._ruleV = createCanvas({
      className: ['ps-rule-v', 'ps-rule'],
      style: {
        height: `calc(100% - ${this._pending}px)`,
        width: `${this._pending}px`,
        top: `${this._pending}px`
      },
      attr: { width: this._pending }
    })
    // horizontal ruler
    this._ruleH = createCanvas({
      className: ['ps-rule-h', 'ps-rule'],
      style: {
        height: `${this._pending}px`,
        width: `calc(100% - ${this._pending}px)`,
        left: `${this._pending}px`
      },
      attr: { height: this._pending }
    })
    // helpline container handle
    this._ruleM = createDiv({
      className: ['ps-rule-m', 'ps-rule'],
      style: { height: `${this._pending}px`, width: `${this._pending}px` }
    })
    // helpline container
    this._ruleC = createDiv({
      className: ['ps-rule-c', 'ps-rule'],
      style: { height: `${this._pending}px`, width: `${this._pending}px` }
    })
    dom.appendChild(this._ruleH)
    dom.appendChild(this._ruleV)
    dom.appendChild(this._ruleM)
    this._helper = new HelpLineManager(this._ruleC, this)
    this._ruleM.appendChild(this._ruleC)
    this._id = id

    setTimeout(() => {
      const { clientHeight, clientWidth } = dom
      this._ruleV.height = clientHeight - this._pending
      this._ruleH.width = clientWidth - this._pending
      this.init()
    })
  }

  init() {
    const ctxH = this._ruleH.getContext('2d')!
    const ctxV = this._ruleV.getContext('2d')!

    ctxH.textAlign = 'center'
    ctxV.textAlign = 'right'

    ctxH.textBaseline = 'bottom'
    ctxV.textBaseline = 'middle'

    this.drawRule()
    this.initCanvasEvent()
    messageHandler.on(getMsgType('zoomChange', this._id), (data: { zoom: number }) => {
      this._zoom = data.zoom
      this.drawRule()
    })
    messageHandler.on(getMsgType('zeroPoint', this._id), (data: Position) => {
      this._zeroPoint = data
      this.drawRule()
    })
  }

  onDown(e: MouseEvent, type: 'h' | 'v') {
    const { width } = this._ruleH
    const { height } = this._ruleV
    const length = type === 'h' ? width : height
    this._helper.mousedown(type)
    this._helper.updateInfos(e, type)
    return this._helper.createLine(type, genId(), {
      [type === 'h' ? 'left' : 'top']: this._pending + 'px',
      [type === 'h' ? 'width' : 'height']: length + 'px'
    })
  }

  onMove(e: MouseEvent, state: { id: string; type: 'h' | 'v' }) {
    this._helper.moveLine(e, state.id)
    this._helper.updateInfos(e, state.type)
  }

  onUp(e: MouseEvent, state: { id: string }) {
    this._helper.mouseup(e, state.id)
  }

  initCanvasEvent() {
    const canvasH = this._ruleH
    const canvasV = this._ruleV
    const helper = this._helper

    polyMousemove<ReturnType<typeof this._helper.createLine>>(canvasH, {
      onDown: (e) => this.onDown.bind(this)(e, 'h'),
      onMove: this.onMove.bind(this),
      onUp: this.onUp.bind(this)
    })
    polyMousemove(canvasV, {
      onDown: (e) => this.onDown.bind(this)(e, 'v'),
      onMove: this.onMove.bind(this),
      onUp: this.onUp.bind(this)
    })
  }

  drawRule() {
    this.clearCanvas()
    this.drawHRuler()
    this.drawVRuler()
  }

  clearCanvas() {
    const ctxH = this._ruleH.getContext('2d')!
    const ctxV = this._ruleV.getContext('2d')!
    ctxH.clearRect(0, 0, this._ruleH.width, this._ruleH.height)
    ctxV.clearRect(0, 0, this._ruleV.width, this._ruleV.height)
  }

  drawSmallMark(p: Position, type: 'h' | 'v') {
    const ctx = type === 'h' ? this._ruleH.getContext('2d')! : this._ruleV.getContext('2d')!
    const end = this._pending * 0.9
    const endPoint = type === 'h' ? { x: p.x, y: end } : { x: end, y: p.y }
    ctxDrawLine(ctx, p, endPoint, this._color)
  }

  drawMiddleMark(p: Position, type: 'h' | 'v') {
    const ctx = type === 'h' ? this._ruleH.getContext('2d')! : this._ruleV.getContext('2d')!
    const end = this._pending * 0.8
    const endPoint = type === 'h' ? { x: p.x, y: end } : { x: end, y: p.y }
    ctxDrawLine(ctx, p, endPoint, this._color)
  }

  drawLargeMark(p: Position, text: string, type: 'h' | 'v') {
    const ctx = type === 'h' ? this._ruleH.getContext('2d')! : this._ruleV.getContext('2d')!
    const end = this._pending * 0.7
    const endPoint = type === 'h' ? { x: p.x, y: end } : { x: end, y: p.y }
    const textPoint = type === 'h' ? { x: p.x, y: end } : { x: end - 2, y: p.y }

    ctxDrawLine(ctx, p, endPoint, this._color)
    ctxDrawText(ctx, text, textPoint, this._color, type)
  }

  getMarks(total: number, start: number) {
    const marks = []
    let step = 0
    if (this._zoom < 20) {
      step = 100
    } else if (this._zoom < 50) {
      step = 50
    } else if (this._zoom < 100) {
      step = 20
    } else if (this._zoom < 200) {
      step = 10
    } else {
      step = 5
    }
    const realStep = (step * this._zoom) / 100

    const base = Number((start % realStep).toFixed(2))
    const res = Math.floor(start / realStep)

    for (let i = 0; i * realStep <= total; i++) {
      const p = i * realStep + base
      const realIndex = Math.abs(i - res)
      const t = realIndex * step
      const type = realIndex % 10 ? (realIndex % 5 ? 's' : 'm') : 'l'

      marks.push({
        p,
        t: String(t),
        type
      })
    }

    return marks
  }

  drawHRuler() {
    const { width } = this._ruleH
    const total = width
    const start = this._zeroPoint.x

    const marks = this.getMarks(total, start)
    for (let i = 0; i < marks.length; i++) {
      const point = { x: marks[i].p, y: this._pending }
      const type = marks[i].type
      if (type === 'l') {
        this.drawLargeMark(point, marks[i].t, 'h')
      } else if (type === 'm') {
        this.drawMiddleMark(point, 'h')
      } else {
        this.drawSmallMark(point, 'h')
      }
    }
  }

  drawVRuler() {
    const { height } = this._ruleV
    const total = height
    const start = this._zeroPoint.y

    const marks = this.getMarks(total, start)
    for (let i = 0; i < marks.length; i++) {
      const point = { x: this._pending, y: marks[i].p }
      const type = marks[i].type
      if (type === 'l') {
        this.drawLargeMark(point, marks[i].t, 'v')
      } else if (type === 'm') {
        this.drawMiddleMark(point, 'v')
      } else {
        this.drawSmallMark(point, 'v')
      }
    }
  }

  reset() {}

  destroy() {
    messageHandler.off(getMsgType('zoomInit', this._id))
    messageHandler.off(getMsgType('zeroPoint', this._id))
  }

  getZeroPoint() {
    return this._zeroPoint
  }

  getPending() {
    return this._pending
  }
}

export default (id: string, dom: HTMLDivElement, type: string, pending: number) => {
  return getInstance(`rule-${id}-${type}`, () => new Rule(id, dom, pending))
}
