export class Queue<T = any> {
  private _maxSteps: number
  private _steps: T[] = []

  constructor(maxSteps: number = 1000) {
    this._maxSteps = maxSteps
  }

  getStep(step: number) {
    return this._steps[step]
  }

  push(data: T) {
    if (this._steps.length >= this._maxSteps) {
      this._steps.shift()
    }
    this._steps.push(data)
  }

  clear() {
    this._steps.length = 0
  }

  length() {
    return this._steps.length
  }

  pushWithStep(step: number, data: T) {
    if (step >= this._maxSteps) {
      this.push(data)
    } else {
      this._steps = this._steps.slice(0, step).concat([data])
    }
  }
}
