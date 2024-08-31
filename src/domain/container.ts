import { Workspace } from './workspace'
import getSortCutManager from './scheduler/sortCutManager'
import messageHandler from '@/infrastructure/messageHandler'
import { getMsgType, getSortCutMsgType } from '@/infrastructure/messageHandlerConstants'

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
  },
  {
    key: ' ',
    type: 'keydown',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('start-drag', id))
      messageHandler.emit(getMsgType('cursorLock', id))
    }
  },
  {
    key: ' ',
    type: 'keyup',
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('end-drag', id))
      messageHandler.emit(getMsgType('cursorUnlock', id))
    }
  }
]
const mouseSortCuts: MouseSortCut[] = [
  // {
  //   key: 'left',
  //   callback: (event, id) => {
  //     console.log('left mouse dom', id)
  //   }
  // },
  {
    key: 'contextmenu',
    callback: (event, id) => {
      console.log('contextmenu dom', id)
    }
  }
]

const wheelSortCuts: WheelSortCut[] = [
  {
    key: 'wheel-up',
    ctrl: true,
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('zoomIn', id))
    }
  },
  {
    key: 'wheel-down',
    ctrl: true,
    callback: (event, id) => {
      messageHandler.emit(getSortCutMsgType('zoomOut', id))
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
