import { Workspace } from './workspace'
import getSortCutManager from './scheduler/sortCutManager'
import messageHandler from '@/infrastructure/messageHandler'
import { getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'

const keyboardSortCuts: KeyboardSortCut[] = [
  {
    key: 'c',
    type: 'keydown',
    callback: (event, id) => {
      console.log('c down', id)
    }
  },
  {
    key: '=',
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('hardnessIn', id))
    }
  },
  {
    key: '=',
    ctrl: true,
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('zoomIn', id))
    }
  },
  {
    key: '0',
    ctrl: true,
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('zoomReset', id))
    }
  },
  {
    key: '-',
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('hardnessOut', id))
    }
  },
  {
    key: '-',
    ctrl: true,
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('zoomOut', id))
    }
  },
  {
    key: '[',
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('radiusOut', id))
    }
  },
  {
    key: ']',
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('radiusIn', id))
    }
  },
  {
    key: '[',
    ctrl: true,
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('opacityOut', id))
    }
  },
  {
    key: ']',
    ctrl: true,
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('opacityIn', id))
    }
  },
  {
    key: 'c',
    type: 'keyup',
    callback: (event, id) => {
      console.log('c keyup', id)
    }
  }
]
const mouseSortCuts: MouseSortCut[] = [
  {
    key: 'left',
    callback: (event, id) => {
      console.log('left mouse dom', id)
    }
  },
  {
    key: 'left',
    win: true,
    callback: (event, id) => {
      console.log('left mouse win', id)
    }
  }
]

const wheelSortCuts: WheelSortCut[] = [
  {
    key: 'wheel-up',
    callback: (event, id) => {
      console.log('wheel-up', id)
    }
  },
  {
    key: 'wheel-down',
    callback: (event, id) => {
      console.log('wheel-down', id)
    }
  }
]

const preventSortCuts: Omit<SortCut, 'callback'>[] = [
  {
    key: 'tab'
  }
]
export class Container {
  constructor(private _dom: HTMLDivElement) {
    getSortCutManager({ keyboardSortCuts, mouseSortCuts, wheelSortCuts, preventSortCuts })
  }

  createWorkspace() {
    const id = Math.random().toString(36).substr(2, 9)
    return new Workspace(this._dom, id)
  }
}
