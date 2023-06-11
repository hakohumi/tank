import socketIO from 'socket.io'
import { Tank } from './Tanks.ts'
import { Wall } from './Wall.ts'
import { OverlapTester } from './OverlapTester.ts'
import { SharedSettings } from '../../../client/src/SharedSettings.ts'
import { GameSettings } from './GameSettings.ts'
import { Bullet } from './Bullet.ts'

export class World {
  io: socketIO.Server
  setTank: Set<Tank>
  setWall: Set<Wall>
  setBullet: Set<Bullet>

  constructor(io: socketIO.Server) {
    this.io = io // socketIO

    this.setTank = new Set() // タンクリスト
    this.setWall = new Set() // 壁リスト
    this.setBullet = new Set() // 弾丸リスト

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

    // 弾丸の可動域
    const rectBulletField = {
      fLeft: 0 + SharedSettings.BULLET_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.BULLET_HEIGHT * 0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.BULLET_WIDTH * 0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.BULLET_HEIGHT * 0.5,
    }

    // 弾丸ごとの処理
    this.setBullet.forEach((bullet) => {
      const bDisappear = bullet.update(
        fDeltaTime,
        rectBulletField,
        this.setWall
      )
      if (bDisappear) {
        // 消失
        this.destroyBullet(bullet)
      }
    })
  }

  // 衝突のチェック
  checkCollisions() {
    // 弾丸ごとの処理
    this.setBullet.forEach((bullet) => {
      // タンクごとの処理
      this.setTank.forEach((tank) => {
        if (tank !== bullet.tank) {
          // 発射元のタンクとの衝突処理はなし
          if (OverlapTester.overlapRects(tank.rectBound, bullet.rectBound)) {
            // 衝突
            if (0 === tank.damage()) {
              // ライフ無くなった
              // タンクの削除
              console.log('dead : socket.id = %s', tank.strSocketID)
              this.destroyTank(tank)
            }
            this.destroyBullet(bullet)
            bullet.tank.iScore++ // 当てたタンクの得点を加算する
          }
        }
      })
    })
  }

  // 新たな行動
  doNewActions(_fDeltaTime: number) {
    // console.log(`in doNewActions fDeltaTime: ${fDeltaTime}`)
  }

  // タンクの生成
  createTank(strSocketID: string) {
    // タンクの可動域
    const rectTankField = {
      fLeft: 0 + SharedSettings.TANK_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.TANK_HEIGHT * 0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH * 0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT * 0.5,
    }

    // タンクの生成
    const tank = new Tank(strSocketID, rectTankField, this.setWall)

    // タンクリストへの登録
    this.setTank.add(tank)

    return tank
  }

  // タンクの破棄
  destroyTank(tank: Tank) {
    // タンクリストリストからの削除
    this.setTank.delete(tank)
  }

  // 弾丸の生成
  createBullet(tank: Tank) {
    const bullet = tank.shoot()
    if (bullet) {
      this.setBullet.add(bullet)
    }
  }

  // 弾丸の破棄
  destroyBullet(bullet: Bullet) {
    // 弾丸リストからの削除
    this.setBullet.delete(bullet)
  }
}
