import { connect } from 'socket.io-client'
import { Screen } from './Screen'

// オブジェクト
const socket = connect() // クライアントからサーバーへの接続要求

// キャンバス
const canvas: HTMLCanvasElement = document.querySelector(
  '#canvas-2d'
) as HTMLCanvasElement

if (canvas == null) {
  console.error('canvas not found')
} else {
  // キャンバスオブジェクト
  const screen = new Screen(socket, canvas)

  // キャンバスの描画開始
  screen.animate(0)

  // ページがunloadされる時（閉じる時、再読み込み時、別ページへ移動時）は、通信を切断する
  window.addEventListener('beforeunload', (_event) => {
    socket.disconnect()
  })
}
