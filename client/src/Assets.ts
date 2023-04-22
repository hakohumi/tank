export class Assets {
  imageField: HTMLImageElement
  rectFieldInFieldImage: { sx: number; sy: number; sw: number; sh: number }

  constructor() {
    this.imageField = new Image()
    this.imageField.src = '../images/grass01.png'

    this.rectFieldInFieldImage = { sx: 0, sy: 0, sw: 512, sh: 512 }
  }
}
