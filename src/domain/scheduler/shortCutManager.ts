import { getInstance } from '@/infrastructure/singleton'

class ShortCutManager {
  private _dom
  constructor(dom: HTMLDivElement) {
    this._dom = dom
  }
}

export default (id: string, dom: HTMLDivElement) => {
  return getInstance(`short-cut-manager-${id}`, () => new ShortCutManager(dom))
}
