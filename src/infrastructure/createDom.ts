interface CreateDomParams {
  className?: string | string[]
  style?: Partial<CSSStyleDeclaration>
  content?: string
  children?: HTMLElement[]
  title?: string
  onClick?: (e: MouseEvent) => void
  attr?: { [key: string]: string | number }
}

const parser: DOMParser = new DOMParser()

const readParams = <T extends HTMLElement>(dom: T, params: CreateDomParams = {}): T => {
  const { className, style, content, children, onClick, title, attr } = params || {}
  className &&
    (typeof className === 'string'
      ? dom.classList.add(className)
      : (className as string[]).forEach((classItem) => dom.classList.add(classItem)))
  if (style) {
    for (let key in style) {
      dom.style[key] = style[key]!
    }
  }
  content && (dom.innerHTML = content)
  title && (dom.title = title)
  children && children.forEach((child) => dom.appendChild(child))
  onClick && dom.addEventListener('click', onClick)
  attr && Object.keys(attr).forEach((key) => dom.setAttribute(key, attr[key] as string))
  return dom
}

export const createDiv = (params?: CreateDomParams) => {
  const div = document.createElement('div')
  return readParams(div, params)
}

export const createCanvas = (params?: CreateDomParams) => {
  const canvas = document.createElement('canvas')
  return readParams(canvas, params)
}

export const createSvg = async (src: string) => {
  const module = (await import(/* @vite-ignore */ src)).default
  const svgDoc = parser.parseFromString(await (await fetch(module)).text(), 'image/svg+xml')
  return svgDoc.documentElement
}
