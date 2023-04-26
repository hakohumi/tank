// モジュール
import { GameObject } from './GameObject'

// 設定
import { SharedSettings } from '../../../client/src/SharedSettings'

// 壁クラス
export class Wall extends GameObject {
  // コンストラクタ
  constructor(fX: number, fY: number) {
    // 親クラスのコンストラクタ呼び出し
    super(SharedSettings.WALL_WIDTH, SharedSettings.WALL_HEIGHT, fX, fY, 0)
  }
}
