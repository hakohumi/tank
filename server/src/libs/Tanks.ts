// モジュール
import { GameObject } from './GameObject.ts'

// 設定
import { SharedSettings } from '../../../client/src/SharedSettings.ts'
import { GameSettings } from './GameSettings'
import { Wall } from './Wall.ts'
import { OverlapTester } from './OverlapTester.ts'
import { Rect } from './Rect.ts'

export interface _ObjMovementType {
  [key: string]: boolean
}

export interface ObjMovementType extends _ObjMovementType {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
}

// タンククラス
export class Tank extends GameObject {
  objMovement: Partial<ObjMovementType>
  fSpeed: number
  fRotationSpeed: number

  // コンストラクタ
  constructor(rectField: Rect, setWall: Set<Wall>) {
    // 親クラスのコンストラクタ呼び出し
    super(
      SharedSettings.TANK_WIDTH,
      SharedSettings.TANK_HEIGHT,
      0.0,
      0.0,
      Math.random() * 2 * Math.PI
    )

    this.objMovement = {} // 動作
    this.fSpeed = GameSettings.TANK_SPEED // 速度[m/s]。1frameあたり5進む => 1/30[s] で5進む => 1[s]で150進む。
    this.fRotationSpeed = GameSettings.TANK_ROTATION_SPEED // 回転速度[rad/s]。1frameあたり0.1進む => 1/30[s] で0.1進む => 1[s]で3[rad]進む。

    // 障害物にぶつからない初期位置の算出
    do {
      this.setPos(
        rectField.fLeft + Math.random() * (rectField.fRight - rectField.fLeft),
        rectField.fBottom + Math.random() * (rectField.fTop - rectField.fBottom)
      )
    } while (this.overlapWalls(setWall))

    // 初期位置
    this.fX =
      Math.random() * (SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH)
    this.fY =
      Math.random() * (SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT)
  }
  // 更新
  // ※rectField : フィールド矩形は、オブジェクト中心と判定する。（OverlapTester.pointInRect()）
  //               オブジェクトの大きさ分狭めた(上下左右で、大きさの半分づつ狭めた）矩形が必要。
  //               呼び出され側で領域を狭めのは、処理コストが無駄なので、呼び出す側で領域を狭めて渡す。
  update(fDeltaTime: number, rectField: Rect, setWall: Set<Wall>) {
    const fX_old = this.fX // 移動前座標値のバックアップ
    const fY_old = this.fY // 移動前座標値のバックアップ
    let bDrived = false // 前後方向の動きがあったか

    // 動作に従って、タンクの状態を更新
    if (this.objMovement['forward']) {
      // 前進
      const fDistance = this.fSpeed * fDeltaTime
      //console.log( 'forward' );
      this.setPos(
        this.fX + fDistance * Math.cos(this.fAngle),
        this.fY + fDistance * Math.sin(this.fAngle)
      )
      bDrived = true
    }
    if (this.objMovement['back']) {
      // 後進
      const fDistance = this.fSpeed * fDeltaTime
      //console.log( 'back' );
      this.setPos(
        this.fX - fDistance * Math.cos(this.fAngle),
        this.fY - fDistance * Math.sin(this.fAngle)
      )
      bDrived = true
    }
    if (bDrived) {
      // 動きがある場合は、不可侵領域との衝突のチェック
      let bCollision = false
      if (!OverlapTester.pointInRect(rectField, { fX: this.fX, fY: this.fY })) {
        // フィールドの外に出た。
        bCollision = true
      } else if (this.overlapWalls(setWall)) {
        // 壁に当たった。
        bCollision = true
      }
      if (bCollision) {
        // 衝突する場合は、移動できない。
        this.setPos(fX_old, fY_old)
        bDrived = false // 前後方向の動きはなし
      }
    }

    if (this.objMovement['left']) {
      // 左転回
      //console.log( 'left' );
      // X軸が右向き、Y軸が「上」向きの世界では、左回転は、角度が増える方向
      // X軸が右向き、Y軸が「下」向きの世界では、左回転は、角度が減る方向
      //this.fAngle += this.fRotationSpeed * fDeltaTime;  // Y軸が「上」向き用（WebGLキャンバスへの描画用）
      this.fAngle -= this.fRotationSpeed * fDeltaTime // Y軸が「下」向き用（2Dキャンバスへの描画用）
    }

    if (this.objMovement['right']) {
      // 右転回
      //console.log( 'right' );
      // X軸が右向き、Y軸が「上」向きの世界では、右回転は、角度が減る方向
      // X軸が右向き、Y軸が「下」向きの世界では、右回転は、角度が増える方向
      //this.fAngle -= this.fRotationSpeed * fDeltaTime;  // Y軸が「上」向き用（WebGLキャンバスへの描画用）
      this.fAngle += this.fRotationSpeed * fDeltaTime // Y軸が「下」向き用（2Dキャンバスへの描画用）
    }

    return bDrived // 前後方向の動きがあったかを返す（ボットタンクで使用する）
  }
}
