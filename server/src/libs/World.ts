import socketIO from 'socket.io'
import { Tank } from './Tanks.ts'
import { Wall } from './Wall.ts'
import { SharedSettings } from '../../../client/src/SharedSettings.ts'
import { GameSettings } from './GameSettings.ts'

export class World {
  io: socketIO.Server
  setTank: Set<Tank>
  setWall: Set<Wall>

  constructor(io: socketIO.Server) {
    this.io = io // socketIO

    this.setTank = new Set() // タンクリスト
    this.setWall = new Set() // 壁リスト

    // 壁の生成
    for (let i = 0; i < GameSettings.WALL_COUNT; i++) {
      // ランダム座標値の作成
      const fX_left =
        Math.random() * (SharedSettings.FIELD_WIDTH - SharedSettings.WALL_WIDTH)
      const fY_bottom =
        Math.random() *
        (SharedSettings.FIELD_HEIGHT - SharedSettings.WALL_HEIGHT)
      // 壁生成
      const wall = new Wall(
        fX_left + SharedSettings.WALL_WIDTH * 0.5,
        fY_bottom + SharedSettings.WALL_HEIGHT * 0.5
      )
      // 壁リストへの登録
      this.setWall.add(wall)
    }
  }

  // 更新処理
  update(fDeltaTime: number) {
    // オブジェクトの座標値の更新
    this.updateObjects(fDeltaTime)

    // 衝突チェック
    this.checkCollisions()

    // 新たな行動（特に、ボットに関する生成や動作
    this.doNewActions(fDeltaTime)
  }

  // オブジェクトの座標値の更新
  updateObjects(fDeltaTime: number) {
    // タンクの可動域
    const rectTankField = {
      fLeft: 0 + SharedSettings.TANK_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.TANK_HEIGHT * 0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH * 0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT * 0.5,
    }

    // タンクごとの処理
    this.setTank.forEach((tank) => {
      tank.update(fDeltaTime, rectTankField, this.setWall)
    })
  }

  // 衝突のチェック
  checkCollisions() {}

  // 新たな行動
  doNewActions(_fDeltaTime: number) {
    // console.log(`in doNewActions fDeltaTime: ${fDeltaTime}`)
  }

  // タンクの生成
  createTank() {
    // タンクの可動域
    const rectTankField = {
      fLeft: 0 + SharedSettings.TANK_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.TANK_HEIGHT * 0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH * 0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT * 0.5,
    }

    // タンクの生成
    const tank = new Tank(rectTankField, this.setWall)

    // タンクリストへの登録
    this.setTank.add(tank)

    return tank
  }

  // タンクの破棄
  destroyTank(tank: Tank) {
    // タンクリストリストからの削除
    this.setTank.delete(tank)
  }
}
