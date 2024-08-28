import { getInstance, getInstanceAsync } from './singleton'
import { Tooltip } from './tooltip'

interface CreateDomParams {
  className?: string | string[]
  style?: Partial<CSSStyleDeclaration>
  content?: string | HTMLElement
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
  if (content) {
    if (typeof content === 'string') {
      dom.textContent = content
    } else {
      dom.appendChild(content)
    }
  }
  if (title) {
    dom.classList.add('tooltip-container')
    new Tooltip(dom as unknown as HTMLDivElement, title, { position: 'bottom' })
  }
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
  return getInstanceAsync(src, async () => {
    const module = (await import(/* @vite-ignore */ src)).default
    const svgDoc = parser.parseFromString(await (await fetch(module)).text(), 'image/svg+xml')
    return svgDoc.documentElement
  })
}

export const createSpan = (params?: CreateDomParams) => {
  const span = document.createElement('span')
  return readParams(span, params)
}
