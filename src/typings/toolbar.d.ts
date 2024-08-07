type ToolbarType = 'redo' | 'undo' | 'pen' | 'pencil' | 'easer'

interface ToolbarOptions {
  type: ToolbarType
  icon: string
  title: string
  unActiveAble?: boolean
}
