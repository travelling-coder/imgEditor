import { createCanvas, createDiv } from '@/infrastructure/createDom'
import messageHandler from '@/infrastructure/messageHandler'
import { getInstance } from '@/infrastructure/singleton'
import { HelpLineManager } from './helpLine'
import { ctxDrawLine, ctxDrawText } from '@/infrastructure/canvasDrawer'
import polyMousemove from '@/infrastructure/polyMousemove'
import { genId } from '@/infrastructure/math'

const pending = 30
const width = `${pending}px`
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

  constructor(id: string, dom: HTMLDivElement) {
    // 垂直标尺
    this._ruleV = createCanvas({
      className: ['ps-rule-v', 'ps-rule'],
      style: { height: `calc(100% - ${pending}px)`, width: `${pending}px`, top: `${pending}px` },
      attr: { width: pending }
    })
    // 水平标尺
    this._ruleH = createCanvas({
      className: ['ps-rule-h', 'ps-rule'],
      style: { height: `${pending}px`, width: `calc(100% - ${pending}px)`, left: `${pending}px` },
      attr: { height: pending }
    })
    // 中间占位
    this._ruleM = createDiv({
      className: ['ps-rule-m', 'ps-rule'],
      style: { height: width, width }
    })
    // 辅助线盒子
    this._ruleC = createDiv({
      className: ['ps-rule-c', 'ps-rule'],
      style: { height: width, width }
    })
    dom.appendChild(this._ruleH)
    dom.appendChild(this._ruleV)
    dom.appendChild(this._ruleM)
    this._helper = new HelpLineManager(this._ruleC, this)
    this._ruleM.appendChild(this._ruleC)
    this._id = id

    setTimeout(() => {
      const { clientHeight, clientWidth } = dom
      this._ruleV.height = clientHeight - pending
      this._ruleH.width = clientWidth - pending
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
    messageHandler.on(`zoom-${this._id}`, (data: { zoom: number }) => {
      this._zoom = data.zoom
      this.drawRule()
    })
    this.initCanvasEvent()
  }

  onDown(e: MouseEvent, type: 'h' | 'v') {
    const { width } = this._ruleH
    const { height } = this._ruleV
    const length = type === 'h' ? width : height
    this._helper.mousedown(type)
    this._helper.updateInfos(e, type)
    return this._helper.createLine(type, genId(), {
      [type === 'h' ? 'left' : 'top']: pending + 'px',
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
    this.getStep()
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
    const end = pending * 0.9
    const endPoint = type === 'h' ? { x: p.x, y: end } : { x: end, y: p.y }
    ctxDrawLine(ctx, p, endPoint, this._color)
  }

  drawMiddleMark(p: Position, type: 'h' | 'v') {
    const ctx = type === 'h' ? this._ruleH.getContext('2d')! : this._ruleV.getContext('2d')!
    const end = pending * 0.8
    const endPoint = type === 'h' ? { x: p.x, y: end } : { x: end, y: p.y }
    ctxDrawLine(ctx, p, endPoint, this._color)
  }

  drawLargeMark(p: Position, text: string, type: 'h' | 'v') {
    const ctx = type === 'h' ? this._ruleH.getContext('2d')! : this._ruleV.getContext('2d')!
    const end = pending * 0.7
    const endPoint = type === 'h' ? { x: p.x, y: end } : { x: end, y: p.y }
    const textPoint = type === 'h' ? { x: p.x, y: end - 2 } : { x: end - 2, y: p.y }

    ctxDrawLine(ctx, p, endPoint, this._color)
    ctxDrawText(ctx, text, textPoint, this._color)
  }

  getStep() {
    const { width } = this._ruleH
    const { height } = this._ruleV
    const step = ((Math.min(width, height) / 5) * this._zoom) / 100
    if (step < 10) {
      this._step = 10
    } else if (step < 20) {
      this._step = 20
    } else if (step < 50) {
      this._step = 50
    } else {
      this._step = 100
    }
  }

  getMarks(total: number, start: number) {
    const marks = []
    const step = (this._step * this._zoom) / 1000
    // const firstMark = Math.floor(start / step)
    // const base = start % step < 0 ? (start % step) + step : start % step
    const base = start % step

    for (let i = 0; i * step <= total; i++) {
      const p = i * step + base
      const t = Math.abs((i * this._step) / 10 - start + base)
      const type = t % this._step ? ((t * 2) % this._step ? 's' : 'm') : 'l'

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
    // const total = (width * this._zoom) / 100
    const total = width
    // const start = ((this._zeroPoint.x - pending) * this._zoom) / 100
    const start = this._zeroPoint.x - pending

    const marks = this.getMarks(total, start)
    for (let i = 0; i < marks.length; i++) {
      const point = { x: marks[i].p, y: pending }
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
    // const total = (height * this._zoom) / 100
    const total = height
    // const start = ((this._zeroPoint.y - pending) * this._zoom) / 100
    const start = this._zeroPoint.y - pending

    const marks = this.getMarks(total, start)
    for (let i = 0; i < marks.length; i++) {
      const point = { x: pending, y: marks[i].p }
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
    messageHandler.off(`zoom-${this._id}`)
  }

  getZeroPoint() {
    return this._zeroPoint
  }
}

export default (id: string, dom: HTMLDivElement, type: string) => {
  return getInstance(`rule-${id}-${type}`, () => new Rule(id, dom))
}
