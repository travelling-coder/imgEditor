class MessageHandler {
  private _eventMap: Map<string, MessageHandlerItem[]> = new Map()
  private _messageMap: Map<string, MessageHandlerItem[]> = new Map()

  constructor() {}

  on(key: string, callback: Function, isMessage: boolean = false) {
    const map = isMessage ? this._messageMap : this._eventMap
    const callbacks: MessageHandlerItem[] = map.get(key) || []
    callbacks.push({ key, callback })
    map.set(key, callbacks)
  }

  once(key: string, callback: Function, isMessage: boolean = false) {
    const map = isMessage ? this._messageMap : this._eventMap
    const callbacks: MessageHandlerItem[] = map.get(key) || []
    callbacks.push({ key, callback, once: true })
    map.set(key, callbacks)
  }

  off(key: string, callback?: Function, isMessage: boolean = false) {
    const map = isMessage ? this._messageMap : this._eventMap
    if (callback) {
      const callbacks: MessageHandlerItem[] = map.get(key) || []
      const newCallbacks = callbacks.filter((item) => item.callback !== callback)
      newCallbacks.length ? map.delete(key) : map.set(key, newCallbacks)
    } else {
      map.delete(key)
    }
  }

  exec(key: string, data?: any) {}
}
