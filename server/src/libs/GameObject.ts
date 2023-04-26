// ゲームオブジェクトクラス

import { OverlapTester } from './OverlapTester'
import { Rect } from './Rect'
import { Wall } from './Wall'

// ・タンク、壁、弾丸の親クラス
export class GameObject {
  rectBound: Rect = { fLeft: 0.0, fBottom: 0.0, fRight: 0.0, fTop: 0.0 }

  // コンストラクタ
  constructor(
    protected fWidth: number,
    protected fHeight: number,
    public fX: number,
    public fY: number,
    public fAngle: number
  ) {
    // this.fWidth = fWidth // 幅
    // this.fHeight = fHeight // 高さ
    // this.fX = fX // 位置(X)
    // this.fY = fY // 位置(Y)
    // this.fAngle = fAngle // 向き（+x軸の方向が0。+y軸の方向がPI/2）

    this.setPos(fX, fY)
  }

  toJSON() {
    return {
      fX: this.fX,
      fY: this.fY,
      fAngle: this.fAngle,
    }
  }
  setPos(fX: number, fY: number) {
    this.fX = fX
    this.fY = fY
    this.rectBound = {
      fLeft: fX - this.fWidth * 0.5,
      fBottom: fY - this.fHeight * 0.5,
      fRight: fX + this.fWidth * 0.5,
      fTop: fY + this.fHeight * 0.5,
    }
  }

  // 壁との干渉チェック
  overlapWalls(setWall: Set<Wall>) {
    let result = Array.from(setWall).some((wall: Wall) => {
      if (OverlapTester.overlapRects(this.rectBound, wall.rectBound)) {
        return true
      }

      return false
    })

    return result
  }
}
