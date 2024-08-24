import { preventDefault } from '@/infrastructure/helper'
import { getInstance } from '@/infrastructure/singleton'

const genKeyboardKey = (sortCut: Omit<KeyboardSortCut, 'callback'>) =>
  `${sortCut.ctl ? true : false}-${sortCut.shift ? true : false}-${sortCut.alt ? true : false}-${sortCut.key}${(sortCut as KeyboardSortCut).type ? `-${(sortCut as KeyboardSortCut).type}` : ''}`

const genMouseKey = (sortCut: Omit<MouseSortCut, 'callback'>) =>
  `${sortCut.win ? 'win' : 'dom'}-${sortCut.ctl ? true : false}-${sortCut.shift ? true : false}-${sortCut.alt ? true : false}-${sortCut.key}${(sortCut as KeyboardSortCut).type ? `-${(sortCut as KeyboardSortCut).type}` : ''}`

const genWheelKey = (sortCut: Omit<WheelSortCut, 'callback'>) =>
  `${sortCut.win ? 'win' : 'dom'}-${sortCut.ctl ? true : false}-${sortCut.shift ? true : false}-${sortCut.alt ? true : false}-${sortCut.key}${(sortCut as KeyboardSortCut).type ? `-${(sortCut as KeyboardSortCut).type}` : ''}`

const genPreventKey = (sortCut: Omit<SortCut, 'callback'>) =>
  `${sortCut.ctl ? true : false}-${sortCut.shift ? true : false}-${sortCut.alt ? true : false}-${sortCut.key}`

class SortCutManager {
  private _eventMap = new Map<string, SortCut>()
  private _preventMap = new Map<string, Omit<SortCut, 'callback'>[]>()
  private _domMap = new Map<string, HTMLElement>()
  private _id: string = ''

  constructor(
    keyboardSortCuts: KeyboardSortCut[],
    mouseSortCuts: MouseSortCut[],
    wheelSortCuts: WheelSortCut[],
    preventSortCuts: Omit<SortCut, 'callback'>[]
  ) {
    keyboardSortCuts.forEach((sortCut) => {
      const key = genKeyboardKey(sortCut)
      this._eventMap.set(key, sortCut)
    })
    mouseSortCuts.forEach((sortCut) => {
      const key = genMouseKey(sortCut)
      this._eventMap.set(key, sortCut)
    })
    wheelSortCuts.forEach((sortCut) => {
      const key = genWheelKey(sortCut)
      this._eventMap.set(key, sortCut)
    })
    preventSortCuts.forEach((sortCut) => {
      const key = genPreventKey(sortCut)
      this._preventMap.set(key, [sortCut])
    })

    window.addEventListener('keydown', this.onKeydown.bind(this), true)
    window.addEventListener('keyup', this.onKeyup.bind(this), true)
    window.addEventListener('mousedown', this.onMouse.bind(this, true), true)
    window.addEventListener('wheel', this.onWheel.bind(this, true), true)
  }

  onKeyboard(event: KeyboardEvent, type: 'keydown' | 'keyup' | 'keypress') {
    const key = `${event.ctrlKey}-${event.shiftKey}-${event.altKey}-${event.key}`
    const suffixKey = `${event.ctrlKey}-${event.shiftKey}-${event.altKey}-${event.key}-${type}`
    const sortCut = this._eventMap.get(key) as KeyboardSortCut
    const suffixSortCut = this._eventMap.get(suffixKey) as KeyboardSortCut
    if (sortCut) {
      sortCut.callback(event, this._id)
      preventDefault(event)
    }
    if (suffixSortCut) {
      suffixSortCut.callback(event, this._id)
      preventDefault(event)
    }
  }

  onKeydown(event: KeyboardEvent) {
    this.onKeyboard(event, 'keydown')
  }

  onKeyup(event: KeyboardEvent) {
    this.onKeyboard(event, 'keyup')
  }

  onMouse(win: boolean, event: MouseEvent) {
    const eventKey = event.button === 0 ? 'left' : event.button === 2 ? 'right' : 'wheel'
    const key = `${win ? 'win' : 'dom'}-${event.ctrlKey}-${event.shiftKey}-${event.altKey}-${eventKey}`
    const sortCut = this._eventMap.get(key) as MouseSortCut
    sortCut && sortCut.callback(event, this._id)
  }

  onWheel(win: boolean, event: WheelEvent) {
    const eventKey = event.deltaY > 0 ? 'wheel-up' : 'wheel-down'
    const key = `${win ? 'win' : 'dom'}-${event.ctrlKey}-${event.shiftKey}-${event.altKey}-${eventKey}`
    const sortCut = this._eventMap.get(key) as WheelSortCut
    sortCut && sortCut.callback(event, this._id)
  }

  bindDom(id: string, dom: HTMLElement) {
    this._id = id
    if (!this._domMap.has(id)) {
      dom.addEventListener('mousedown', this.onMouse.bind(this, false))
      dom.addEventListener('wheel', this.onWheel.bind(this, false))
    }
    return this
  }

  unbind(id: string) {
    const dom = this._domMap.get(id)
    if (!dom) return
    dom.removeEventListener('mousedown', this.onMouse.bind(this, false))
    dom.removeEventListener('wheel', this.onWheel.bind(this, false))
    this._domMap.delete(id)
    return this
  }

  destroyed() {
    const keys = this._domMap.keys()
    for (const key of keys) {
      this.unbind(key)
    }
    window.removeEventListener('keydown', this.onKeydown.bind(this), true)
    window.removeEventListener('keyup', this.onKeyup.bind(this), true)
    window.removeEventListener('mousedown', this.onMouse.bind(this, true), true)
    window.removeEventListener('wheel', this.onWheel.bind(this, true), true)
  }
}

export default ({
  keyboardSortCuts = [],
  mouseSortCuts = [],
  wheelSortCuts = [],
  preventSortCuts = []
}: {
  keyboardSortCuts?: KeyboardSortCut[]
  mouseSortCuts?: MouseSortCut[]
  wheelSortCuts?: WheelSortCut[]
  preventSortCuts?: Omit<SortCut, 'callback'>[]
}): SortCutManager =>
  getInstance(
    `sort-cut-manager`,
    () => new SortCutManager(keyboardSortCuts, mouseSortCuts, wheelSortCuts, preventSortCuts)
  )
