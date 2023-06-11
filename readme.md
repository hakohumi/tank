# readme

tsの勉強です。

[hiramine.com オンライン対戦ゲームを作る ( Node.js + Socket.io )](https://www.hiramine.com/programming/onlinebattletanks_nodejs_socketio/index.html)

このサイトを参考にさせていただいております。

## todo

- 開発環境の構築
  - Volta + Node.js + Vite + TypeScript
    - `npm create vite@latest`
    - バックエンド
      - vite-node
        - <https://scrapbox.io/dojineko/vite-node>
    - フロントエンド (./client)
      - <https://ja.vitejs.dev/guide/>
      - `npm create vite@latest`
      -

- [x] 01．ゲームの骨格を作る
- [x] 02. プレーヤの操作で移動するタンクの追加
- [x] 03．タンクの移動を妨げる壁の追加
- [x] 04. プレーヤーの操作でタンクから発射される弾丸の追加
- [x] 05. 弾丸を当てられたタンクはライフが減り、当てたタンクは得点を得る
- [ ] 06．ニックネームを入力するスタート画面の追加

## NOTE

- vite-plugin-node
  - viteでnodeをビルドさせるために必要
    - これがないとビルドができなかった
