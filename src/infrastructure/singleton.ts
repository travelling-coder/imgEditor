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

export async function getInstanceAsync(key: string, cb: () => Promise<any>) {
  if (singletonMap.has(key)) {
    return singletonMap.get(key)
  } else {
    const instance = await cb()
    singletonMap.set(key, instance)
    return instance
  }
}
