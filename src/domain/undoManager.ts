import messageHandler from '@/infrastructure/messageHandler'
import { Queue } from '@/infrastructure/queue'
import { getInstance } from '@/infrastructure/singleton'

const maxStep = 20

interface UndoManagerExecData {
  type: string
  data: any
}

class UndoRedoManager {
  private steps = new Queue<UndoManagerExecData>(maxStep)
  private currentStep = -1

  clear() {
    this.steps.clear()
    this.currentStep = -1
  }

  private undoAble() {
    return this.currentStep > -1
  }

  undo() {
    if (this.undoAble()) {
      const stepData = this.steps.getStep(this.currentStep - 1)
      this.exec(stepData, false)
      this.currentStep--
    }
  }

  private redoAble() {
    return this.currentStep < this.steps.length() - 1
  }

  redo() {
    if (this.redoAble()) {
      const stepData = this.steps.getStep(this.currentStep + 1)
      this.exec(stepData, false)
      this.currentStep++
    }
  }

  private updateAble() {
    messageHandler.emit('redoAble', this.redoAble())
    messageHandler.emit('undoAble', this.undoAble())
  }

  exec({ type, data }: UndoManagerExecData, isNewStep: boolean = true) {
    messageHandler.emit(type, data)

    if (isNewStep) {
      this.steps.pushWithStep(this.currentStep, { type, data })
    }

    this.updateAble()
  }
}

export default (id: string) => {
  return getInstance(`undo-redo-manager-${id}`, () => new UndoRedoManager())
}
