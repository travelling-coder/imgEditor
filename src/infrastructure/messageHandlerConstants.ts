const messageHandlerConstants = {
  zoomChange: 'zoom-change',
  zoomInit: 'zoom-init',
  zoomIn: 'zoom-in',
  zoomOut: 'zoom-out',
  zeroPoint: 'zero-point',
  redoAble: 'redo-able',
  undoAble: 'undo-able',
  redo: 'redo',
  undo: 'undo',

  hardnessChange: 'hardness-change',
  hardnessIn: 'hardness-in',
  hardnessOut: 'hardness-out'
}

export const getMsgType = (key: keyof typeof messageHandlerConstants | string, id?: string) => {
  const prefix = messageHandlerConstants[key as keyof typeof messageHandlerConstants] || key
  const suffix = id ? `-${id}` : ''
  return `${prefix}${suffix}`
}

export const getSortCutMsgType = (
  key: keyof typeof messageHandlerConstants | string,
  id?: string
) => {
  const prefix = messageHandlerConstants[key as keyof typeof messageHandlerConstants] || key
  const suffix = id ? `-${id}` : ''
  return `sort-cut-${prefix}${suffix}`
}
