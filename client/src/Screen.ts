import { Socket } from 'socket.io-client'
import { Assets } from './Assets.ts'
import { SharedSettings } from './SharedSettings.ts'
import { RenderingSettings } from './RenderingSettings.ts'

import { Tank } from '@Server/libs/Tanks.ts'
import { Wall } from '@Server/libs/Wall.ts'
import { Bullet } from '@Server/libs/Bullet.ts'

// スクリーンクラス
export class Screen {
  socket: Socket
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  assets: Assets
  iProcessingTimeNanoSec: number
  aTank: Array<Tank> | null
  aWall: Array<Wall> | null
  aBullet: Array<Bullet> | null

  constructor(socket: Socket, canvas: HTMLCanvasElement) {
    this.socket = socket
    this.canvas = canvas
    let context = canvas.getContext('2d')

    if (context == null) {
      throw new Error('not context')
    }

    this.context = context

    this.assets = new Assets()
    this.iProcessingTimeNanoSec = 0

    this.aTank = null
    this.aWall = null
    this.aBullet = null

    // キャンバスの初期化
    this.canvas.width = SharedSettings.FIELD_WIDTH
    this.canvas.height = SharedSettings.FIELD_HEIGHT

    // ソケットの初期化
    this.initSocket()

    // コンテキストの初期化
    // アンチエイリアスの抑止（画像がぼやけるのの防止）以下４行
    // this.context.mozImageSmoothingEnabled = false
    // this.context.webkitImageSmoothingEnabled = false
    // this.context.msImageSmoothingEnabled = false
    this.context.imageSmoothingEnabled = false
  }

  // ソケットの初期化
  initSocket() {
    // 接続確立時の処理
    // ・サーバーとクライアントの接続が確立すると、
    // 　サーバーで、'connection'イベント
    // 　クライアントで、'connect'イベントが発生する
    this.socket.on('connect', () => {
      // console.log('connect : socket.id = %s', this.socket.id)
      // サーバーに'enter-the-game'を送信
      this.socket.emit('enter-the-game')
    })

    // サーバーからの状態通知に対する処理
    // ・サーバー側の周期的処理の「io.sockets.emit( 'update', ・・・ );」に対する処理
    this.socket.on(
      'update',
      (
        aTank: Array<Tank>,
        aWall: Array<Wall>,
        aBullet: Array<Bullet>,
        iProcessingTimeNanoSec
      ) => {
        this.aTank = aTank
        this.aWall = aWall
        this.aBullet = aBullet
        this.iProcessingTimeNanoSec = iProcessingTimeNanoSec
      }
    )
  }

  // アニメーション（無限ループ処理）
  animate(iTimeCurrent: number) {
    requestAnimationFrame((iTimeCurrent) => {
      this.animate(iTimeCurrent)
    })
    this.render(iTimeCurrent)
  }

  // 描画。animateから無限に呼び出される
  render(iTimeCurrent: number) {
    // console.log('render')

    // キャンバスのクリア
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // キャンバスの塗りつぶし
    this.renderField()

    // タンクの描画
    if (null !== this.aTank) {
      const fTimeCurrentSec = iTimeCurrent * 0.001 // iTimeCurrentは、ミリ秒。秒に変換。
      const iIndexFrame = Math.floor((fTimeCurrentSec / 0.2) % 2) // フレーム番号
      this.aTank.forEach((tank) => {
        this.renderTank(tank, iIndexFrame)
      })
    }

    // 壁の描画
    if (null !== this.aWall) {
      this.aWall.forEach((wall) => {
        this.renderWall(wall)
      })
    }

    // 弾丸の描画
    if (null !== this.aBullet) {
      this.aBullet.forEach((bullet) => {
        this.renderBullet(bullet)
      })
    }

    // キャンバスの枠の描画
    this.context.save()
    this.context.strokeStyle = RenderingSettings.FIELD_LINECOLOR
    this.context.lineWidth = RenderingSettings.FIELD_LINEWIDTH
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.restore()

    // 画面右上にサーバー処理時間表示
    this.context.save()
    this.context.font = RenderingSettings.PROCESSINGTIME_FONT
    this.context.fillStyle = RenderingSettings.PROCESSINGTIME_COLOR
    this.context.fillText(
      (this.iProcessingTimeNanoSec * 1e-9).toFixed(9) + ' [s]',
      this.canvas.width - 30 * 10,
      40
    )
    this.context.restore()
  }

  renderField() {
    this.context.save()

    let iCountX = SharedSettings.FIELD_WIDTH / RenderingSettings.FIELDTILE_WIDTH

    let iCountY =
      SharedSettings.FIELD_HEIGHT / RenderingSettings.FIELDTILE_HEIGHT

    for (let iIndexY = 0; iIndexY < iCountY; iIndexY++) {
      for (let iIndexX = 0; iIndexX < iCountX; iIndexX++) {
        this.context.drawImage(
          this.assets.imageField,
          this.assets.rectFieldInFieldImage.sx,
          this.assets.rectFieldInFieldImage.sy, // 描画元画像の右上座標
          this.assets.rectFieldInFieldImage.sw,
          this.assets.rectFieldInFieldImage.sh, // 描画元画像の大きさ
          iIndexX * RenderingSettings.FIELDTILE_WIDTH, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
          iIndexY * RenderingSettings.FIELDTILE_HEIGHT, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
          RenderingSettings.FIELDTILE_WIDTH, // 描画先領域の大きさ
          RenderingSettings.FIELDTILE_HEIGHT
        ) // 描画先領域の大きさ
      }
    }

    this.context.restore()
  }

  renderTank(tank: Tank, iIndexFrame: number) {
    this.context.save()

    // タンクの座標値に移動
    this.context.translate(tank.fX, tank.fY)

    // 画像描画
    this.context.save()

    this.context.rotate(tank.fAngle)

    this.context.drawImage(
      this.assets.imageItems,
      this.assets.arectTankInItemsImage[iIndexFrame].sx,
      this.assets.arectTankInItemsImage[iIndexFrame].sy, // 描画元画像の右上座標
      this.assets.arectTankInItemsImage[iIndexFrame].sw,
      this.assets.arectTankInItemsImage[iIndexFrame].sh, // 描画元画像の大きさ
      -SharedSettings.TANK_WIDTH * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      -SharedSettings.TANK_HEIGHT * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      SharedSettings.TANK_WIDTH, // 描画先領域の大きさ
      SharedSettings.TANK_HEIGHT
    ) // 描画先領域の大きさ
    this.context.restore()

    this.context.restore()
  }

  renderWall(wall: Wall) {
    // 画像描画
    this.context.drawImage(
      this.assets.imageItems,
      this.assets.rectWallInItemsImage.sx,
      this.assets.rectWallInItemsImage.sy, // 描画元画像の右上座標
      this.assets.rectWallInItemsImage.sw,
      this.assets.rectWallInItemsImage.sh, // 描画元画像の大きさ
      wall.fX - SharedSettings.WALL_WIDTH * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      wall.fY - SharedSettings.WALL_HEIGHT * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      SharedSettings.WALL_WIDTH, // 描画先領域の大きさ
      SharedSettings.WALL_HEIGHT
    ) // 描画先領域の大きさ
  }
  renderBullet(bullet: Bullet) {
    this.context.save()

    // 弾丸の座標値に移動
    this.context.translate(bullet.fX, bullet.fY)

    // 画像描画
    this.context.rotate(bullet.fAngle)
    this.context.drawImage(
      this.assets.imageItems,
      this.assets.rectBulletInItemsImage.sx,
      this.assets.rectBulletInItemsImage.sy, // 描画元画像の右上座標
      this.assets.rectBulletInItemsImage.sw,
      this.assets.rectBulletInItemsImage.sh, // 描画元画像の大きさ
      -SharedSettings.BULLET_WIDTH * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      -SharedSettings.BULLET_HEIGHT * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      SharedSettings.BULLET_WIDTH, // 描画先領域の大きさ
      SharedSettings.BULLET_HEIGHT
    ) // 描画先領域の大きさ

    this.context.restore()
  }
}
