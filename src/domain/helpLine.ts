import { createDiv } from '@/infrastructure/createDom'
import polyMousemove from '@/infrastructure/polyMousemove'
import type { Rule } from './rule'

export class HelpLineManager {
  parentRule: Rule
  parentDom: HTMLDivElement
  rect: DOMRect | undefined
  private _infos: HTMLDivElement
  lines: Record<string, { dom: HTMLDivElement; type: 'h' | 'v'; id: string }> = {}

  constructor(dom: HTMLDivElement, parent: Rule) {
    this.parentDom = dom
    this._infos = createDiv({
      className: 'help-line-infos'
    })
    this.parentRule = parent
    this.parentDom.appendChild(this._infos)
    setTimeout(() => {
      this.rect = dom.getBoundingClientRect()
    })
  }

  updateInfos(e: MouseEvent, type: 'h' | 'v') {
    const { x, y } = this.getTarget(e)
    const { x: zeroX, y: zeroY } = this.parentRule.getZeroPoint()
    const text = type === 'h' ? `y: ${y - zeroY}` : `x: ${x - zeroX}`

    this._infos.style.top = y + 'px'
    this._infos.style.left = x + 'px'
    this._infos.innerText = text
  }

  onDown(e: MouseEvent) {
    const target = (e.target as HTMLDivElement).id
    this.updateInfos(e, this.lines[target].type)
    this.mousedown(this.lines[target].type)
    return this.lines[target]
  }

  onMove(e: MouseEvent, state: { id: string; type: 'h' | 'v' }) {
    this.moveLine(e, state.id)
    this.updateInfos(e, state.type)
  }

  onUp(e: MouseEvent, state: { id: string }) {
    this.mouseup(e, state.id)
  }

  createLine(type: 'h' | 'v', id: string, style?: Partial<CSSStyleDeclaration>) {
    const line = createDiv({
      className: ['help-line', type === 'h' ? 'help-line-h' : 'help-line-v'],
      attr: { id },
      style
    })

    polyMousemove(line, {
      onDown: this.onDown.bind(this),
      onMove: this.onMove.bind(this),
      onUp: this.onUp.bind(this)
    })
    this.lines[id] = { dom: line, type, id }
    this.parentDom.appendChild(line)
    return this.lines[id]
  }

  mousedown(type: 'h' | 'v') {
    document.body.style.cursor = type === 'h' ? 'ns-resize' : 'ew-resize'
    this._infos.style.display = 'block'
  }

  getTarget(e: MouseEvent) {
    const x = Math.max(e.clientX + 1 - (this.rect?.left || 0), 0)
    const y = Math.max(e.clientY + 1 - (this.rect?.top || 0), 0)
    return { x, y }
  }

  moveLine(e: MouseEvent, id: string) {
    const { dom, type } = this.lines[id] || {}
    if (dom) {
      const target = this.getTarget(e)[type === 'h' ? 'y' : 'x']
      dom.style[type === 'h' ? 'top' : 'left'] = `${target}px`
    }
  }

  mouseup(e: MouseEvent, id: string) {
    const target = e.target as HTMLDivElement
    const type = this.lines[id].type
    if (
      target.classList.contains(`ps-rule-${type}`) ||
      this.getTarget(e)[type === 'h' ? 'y' : 'x'] <= 0
    ) {
      this.removeLine(id)
    }
    document.body.style.cursor = 'unset'
    this._infos.style.display = 'none'
  }

  removeLine(id: string) {
    const { dom } = this.lines[id] || {}
    if (dom) {
      dom.remove()
      delete this.lines[id]
    }
  }

  getZeroPoint() {
    return this.parentRule._zeroPoint
  }
}
