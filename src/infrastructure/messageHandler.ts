class MessageHandler {
  private _eventMap: Map<string, MessageHandlerItem[]> = new Map()
  private _messageMap: Map<string, MessageHandlerItem[]> = new Map()

  constructor() {
    window.addEventListener('message', this.onMessage.bind(this))
  }

  private exec(key: string, data: any, isMessage: boolean = false) {
    const map = isMessage ? this._messageMap : this._eventMap
    const callbacks = map.get(key) || []
    callbacks.forEach((item) => {
      item.callback(data)
      if (item.once) {
        this.off(key, item.callback, isMessage)
      }
    })
  }

  private onMessage({ data }: MessageEvent<any>) {
    const { type, params } = data
    this.exec(type, params, true)
  }

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

  emit(key: string, data?: any, isMessage: boolean = false) {
    if (isMessage) {
      window.parent && window.parent.postMessage({ type: key, params: data }, '*')
      window.postMessage({ type: key, params: data })
    } else {
      this.exec(key, data)
    }
  }

  destroy() {
    window.removeEventListener('message', this.onMessage.bind(this))
  }
}

const messageHandler = new MessageHandler()
;(window as any).m = messageHandler
export default messageHandler
