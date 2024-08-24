type KeyboardSortCutCallback = (event: KeyboardEvent, id: string) => void
type MouseSortCutCallback = (event: MouseEvent, id: string) => void
type WheelSortCutCallback = (event: WheelEvent, id: string) => void

interface SortCutBase {
  ctl?: boolean
  shift?: boolean
  alt?: boolean
  key: 'left' | 'right' | 'wheel' | 'wheel-up' | 'wheel-down' | string
}

interface KeyboardSortCut extends SortCutBase {
  type: 'keydown' | 'keyup'
  callback: KeyboardSortCutCallback
}

interface MouseSortCut extends SortCutBase {
  win?: boolean
  callback: MouseSortCutCallback
}

interface WheelSortCut extends SortCutBase {
  win?: boolean
  callback: WheelSortCutCallback
}

type SortCut = KeyboardSortCut | MouseSortCut | WheelSortCut
