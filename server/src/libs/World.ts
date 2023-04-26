import socketIO from 'socket.io'
import { Tank } from './Tanks.ts'

export class World {
  io: socketIO.Server
  setTank: Set<Tank>

  constructor(io: socketIO.Server) {
    this.io = io // socketIO

    this.setTank = new Set() // タンクリスト
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
    // console.log(`in updateObjects fDeltaTime: ${fDeltaTime}`)

    // タンクごとの処理
    this.setTank.forEach((tank) => {
      tank.update(fDeltaTime)
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
    // タンクの生成
    const tank = new Tank()

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
