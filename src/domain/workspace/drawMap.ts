export class DrawMap {
  source: HTMLImageElement | null = null
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(private _id: string) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
  }

  initImage() {
    if (this.source) {
      const { width, height } = this.source!
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvas.width = width
      this.canvas.height = height
      this.ctx.drawImage(this.source!, 0, 0, width, height)
      const imageData = this.ctx.getImageData(0, 0, width, height)
      const { data } = imageData
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 255
        data[i + 3] = 100
      }
      this.ctx.putImageData(imageData, 0, 0)
      this.ctx.clearRect(0, 0, 100, 100)
      this.ctx.clearRect(100, 100, 300, 300)
    }
  }

  loadImg(img: HTMLImageElement) {
    this.source = img
    this.initImage()
  }
}
