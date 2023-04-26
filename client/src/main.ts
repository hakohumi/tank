import { connect } from 'socket.io-client'
import { Screen } from './Screen'
import { ObjMovementType } from '@Server/libs/Tanks'

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

// キーの入力（キーダウン、キーアップ）の処理
let objMovement: ObjMovementType = {} // 動作

let keyboadEventListener = (eventName: 'keydown' | 'keyup') => {
  document.addEventListener(eventName, (event: KeyboardEvent) => {
    let KeyToCommand = {
      ArrowUp: 'forward',
      ArrowDown: 'back',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    } as { [k in string ]: string }

    const command = KeyToCommand[event.key]

    if (command) {
      if (event.type === 'keydown') {
        objMovement[command] = true
      } // if( event.type === 'keyup' )
      else {
        objMovement[command] = false
      }
      // サーバーに イベント名'change-my-movement'と、objMovementオブジェクトを送信
      socket.emit('change-my-movement', objMovement)
    }
  })
}

keyboadEventListener('keydown')
keyboadEventListener('keyup')
