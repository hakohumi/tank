import socketIO from 'socket.io'
export class World {
  io: socketIO.Server
  constructor(io: socketIO.Server) {
    this.io = io // socketIO
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
  }

  // 衝突のチェック
  checkCollisions() {}

  // 新たな行動
  doNewActions(fDeltaTime: number) {
    // console.log(`in doNewActions fDeltaTime: ${fDeltaTime}`)
  }
}
