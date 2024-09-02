type ToolbarType = 'redo' | 'undo' | 'pen' | 'brush' | 'easer' | 'grab'

interface ToolbarOptions {
  type: ToolbarType
  icon: string
  title: string
  unActiveAble?: boolean
}
