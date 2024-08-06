const singletonMap = new Map()

export function getInstance(key: string, cb: () => any) {
  if (singletonMap.has(key)) {
    return singletonMap.get(key)
  } else {
    const instance = cb()
    singletonMap.set(key, instance)
    return instance
  }
}
