// ゲームオブジェクトクラス
// ・タンク、壁、弾丸の親クラス
export class GameObject {
  // コンストラクタ
  constructor(
    protected fWidth: number,
    protected fHeight: number,
    public fX: number,
    public fY: number,
    public fAngle: number
  ) {
    this.fWidth = fWidth // 幅
    this.fHeight = fHeight // 高さ
    this.fX = fX // 位置(X)
    this.fY = fY // 位置(Y)
    this.fAngle = fAngle // 向き（+x軸の方向が0。+y軸の方向がPI/2）

    this.fX = fX
    this.fY = fY
  }

  toJSON() {
    return {
      fX: this.fX,
      fY: this.fY,
      fAngle: this.fAngle,
    }
  }
}
