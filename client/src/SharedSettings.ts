// サーバースクリプトとクライアントで共通の設定クラス

export class SharedSettings {
  // フィールドサイズ
  // ※背景タイル画像のトリム処理未実装のため、
  // 　「FIELD_WIDTHは、FIELDTILE_WIDTHの定数倍」「FIELD_HEIGHTは、FIELDTILE_HEIGHTの定数倍」にする必要あり。
  static get FIELD_WIDTH() {
    return 1024.0
  }
  static get FIELD_HEIGHT() {
    return 1024.0
  }

  // タンク
  static get TANK_WIDTH() {
    return 80.0
  }
  static get TANK_HEIGHT() {
    return 80.0
  }

  // 壁サイズ
  static get WALL_WIDTH() {
    return 250.0
  }
  static get WALL_HEIGHT() {
    return 50.0
  }

  // 弾丸
  static get BULLET_WIDTH() {
    return 15.0
  }
  static get BULLET_HEIGHT() {
    return 15.0
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // サーバー処理（Node.js処理）用の記述
  module.exports = SharedSettings
}
