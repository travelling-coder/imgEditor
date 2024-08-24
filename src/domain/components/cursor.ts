import messageHandler from '@/infrastructure/messageHandler'

interface Config {
  type: ToolbarType
}

class Cursor {
  private _point: Position = { x: 0, y: 0 }
  config = {
    type: 'brush'
  }

  constructor(private _id: string) {
    // messageHandler.on
  }
}
