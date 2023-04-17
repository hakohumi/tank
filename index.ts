// モジュール
import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import { Game } from 'lib/Game.ts'

// オブジェクト
const app = express()
const server = http.createServer(app)
const io = new socketIO.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server)

const port = 3000

app.get('/', (_, res) => {
  res.send('Hello World!')
})

// ゲームの作成と開始
const game = new Game()
game.start(io)

console.log(`__dirname: ${__dirname}`)

// ファイルを静的に配置する
// https://teno-hira.com/media/?p=1621
app.use(express.static(__dirname + '/public'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
