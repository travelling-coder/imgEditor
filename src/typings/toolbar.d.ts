type ToolbarType = 'redo' | 'undo' | 'pen' | 'pencil' | 'easer' | 'brush'

interface ToolbarOptions {
  type: ToolbarType
  icon: string
  title: string
}
