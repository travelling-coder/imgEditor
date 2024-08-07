export const createDiv = (params?: {
  className?: string
  style?: Partial<CSSStyleDeclaration>
  content?: string
  children?: HTMLElement[]
  title?: string
  onClick?: (e: MouseEvent) => void
}) => {
  const { className, style, content, children, onClick, title } = params || {}
  const div = document.createElement('div')
  className && div.classList.add(className)
  if (style) {
    for (let key in style) {
      div.style[key] = style[key]!
    }
  }
  content && (div.innerHTML = content)
  title && (div.title = title)
  children && children.forEach((child) => div.appendChild(child))
  onClick && div.addEventListener('click', onClick)
  return div
}
