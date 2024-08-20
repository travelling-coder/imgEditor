export const genId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}
