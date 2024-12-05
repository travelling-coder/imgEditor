interface PSConfig {
  basicIconUrl: string
  toolbars: ToolbarOptions[]
}

const globalConfig: PSConfig = {
  basicIconUrl: '../assets/icons/',
  toolbars: [
    {
      type: 'undo',
      icon: 'undo',
      title: 'Undo',
      unActiveAble: true
    },
    {
      type: 'redo',
      icon: 'redo',
      title: 'redo',
      unActiveAble: true
    },
    {
      type: 'brush',
      icon: 'brush',
      title: 'brush'
    },
    {
      type: 'pen',
      icon: 'pen',
      title: 'pen'
    },
    {
      type: 'easer',
      icon: 'easer',
      title: 'easer'
    },
    {
      type: 'grab',
      icon: 'grab',
      title: 'handle'
    }
  ]
}

export default globalConfig
