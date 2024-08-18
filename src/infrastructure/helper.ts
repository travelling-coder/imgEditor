const defaultDelay = 1000
export function debounce(fn: (...args: any) => void, delay = defaultDelay) {
  let timer: NodeJS.Timeout
  return function (...args: any[]) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const throttle = (fn: (...args: any) => void, delay = defaultDelay) => {
  let time = 0

  return function (...args: any[]) {
    if (Date.now() - time >= delay) {
      fn(...args)
      time = Date.now()
    }
  }
}
