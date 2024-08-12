import { createDiv } from '@/infrastructure/createDom'
import polyMousemove from '@/infrastructure/polyMousemove'

export class HelpLineManager {
  parent: HTMLDivElement
  rect: DOMRect | undefined
  private _infos: HTMLDivElement
  lines: Record<string, { dom: HTMLDivElement; type: 'h' | 'v'; id: string }> = {}

  constructor(dom: HTMLDivElement) {
    this.parent = dom
    this._infos = createDiv({
      className: 'help-line-infos',
      style: { position: 'absolute', top: '0', left: '0', zIndex: '9999', display: 'none' }
    })
    this.parent.appendChild(this._infos)
    setTimeout(() => {
      this.rect = dom.getBoundingClientRect()
    })
  }

  updateInfos(e: MouseEvent) {
    const x = e.clientX - (this.rect?.left || 0)
    const y = e.clientY - (this.rect?.top || 0)
    const text = `(x: ${x}, y: ${y})`

    this._infos.style.top = y + 'px'
    this._infos.style.left = x + 'px'
    this._infos.innerText = text
  }

  onDown(e: MouseEvent) {
    const target = (e.target as HTMLDivElement).id
    this.updateInfos(e)
    this.mousedown(this.lines[target].type)
    return this.lines[target]
  }

  onMove(e: MouseEvent, state: { id: string; type: 'h' | 'v' }) {
    this.moveLine(state.id, state.type === 'h' ? e.clientY : e.clientX)
    this.updateInfos(e)
  }

  onUp(e: MouseEvent, state: { id: string }) {
    const target = e.target as HTMLDivElement
    this.mouseup()
    if (target.classList.contains('ps-rule')) {
      this.removeLine(state.id)
    }
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
    this.parent.appendChild(line)
    return this.lines[id]
  }

  mousedown(type: 'h' | 'v') {
    document.body.style.cursor = type === 'h' ? 'ns-resize' : 'ew-resize'
    this._infos.style.display = 'block'
  }

  moveLine(id: string, target: number) {
    const { dom, type } = this.lines[id] || {}
    if (dom) {
      if (type === 'v') {
        dom.style.left = `${target + 1 - (this.rect?.left || 0)}px`
      } else {
        dom.style.top = `${target + 1 - (this.rect?.top || 0)}px`
      }
    }
  }

  mouseup() {
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
}
