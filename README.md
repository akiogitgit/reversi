## リバーシ

- 動作プラットフォーム: Windows
- 開発プラットフォーム: Windows
- 開発言語: HTML/CSS, JavaScript(TypeScript)
- 利用ライブラリ(フレームワーク): Svelte, Windi CSS

## 変数・関数の説明

### 盤上(Board)で定義する変数・関数
変数
- fields
  - 盤上を FIELD_SIZE * FIELD_SIZE の二次元配列で定義。
  - 型
    - null, "白", "黒"
- currentColor
  - 現在のプレイヤーの色
  - 型
    - "白", "黒"
- putAbleFields
  - 現在置くことが出来るフィールドの座標を配列で格納
  - 処理
    - getPutAbleAllField関数で返される値を格納する

関数
- toggleTurn
  - ターンチェンジする
  - 処理
    - currentColorを交互にする
    - putAbleFieldsを更新
- reverseFields
  - 置いた時にひっくり返す処理を行う
  - 引数
    - ひっくり返すフィールドの座標を配列で受け取る
  - 処理
    - 引数でひっくり返すフィールドの座標を配列で受け取り、その値をcurrentColorに変える
- onClickField
  - フィールドを押したときの処理
  - 引数
    - フィールドの座標を受け取る
  - 処理
    - 既に置かれている時は終了
    - getReverseFields関数から、ひっくり返すフィールドを受け取る
    - ひっくり返すフィールドが無いなら終了
    - 押したフィールドを、currentColorにする
    - reverseFields関数でひっくり返す処理を実行
    - toggleTurnでターンチェンジする

### 盤上下のメッセージ(GameStatus)で定義する変数
変数
- isFinished
  - ゲームが終了するかをBooleanで保持
- isPassedPrev
  - 前回パスをしたかをBooleanで保持
- finishMessage
  - 終了した時表示するメッセージ
- winner
  - 勝者。nullだと引き分け
  - 型
    -  "黒" | "白" | null

### utils, reversi.tsで定義する関数
- checkAllElementsFill
  - 引数の配列でnullでない要素数が、マス数と同じかをBooleanで返す
  - 引数
    - 配列のサイズ、配列
  - 処理
    - 引数の配列をflatで一次元配列にして、nullでない要素のみにフィルターする
    - 上記の処理で作成した配列の長さが、引数のサイズの二乗と同じかを返す
- checkPutAbility
  - 引数の座標が置けるかをチェック
  - 上下左右斜め、どれか１個でもひっくり返せるならtrue、どの方向も返せないならfalseを返す
  - 引数
    - フィールドの座標、フィールド、現在の色
  - 処理
    - 上下左右斜め、どれか１個でもひっくり返せるならtrue、どの方向も返せないならfalseを返す
    - それぞれの判定（上の時）
      - まず置いた時に上をひっくり返せる位置かをチェック。y座標は1以上でないとそもそもひっくり返せない
      - 置く位置のy座標から、0までループする。
        - この時のフィールドは、fields [ループのindex] [置く位置のx座標] で取得できる
        - その時フィールドが置かれていないなら、この方向はひっくり返せないので終了
        - そのフィールドが、現在の色と同じならひっくり返すことが出来るので、trueを返す。
          - ただし、ループが一回目なら置く位置と連続して同じ色になるので、ひっくり返せず終了
     - これを上下左右斜めやっている
     - 上記で言っている終了というのは、その方向でひっくり返せないと言う意味。
     - 上下左右斜めでこの判定をして、どこもひっくり返せないなら falseを返す
- getPutAbleAllField
  - 全フィールドで置ける座標を配列で返す
  - 引数
    - フィールド、現在の色
  - 処理
    - 座標を格納する空配列を定義
    - 二重ループでフィールドを回す
    - ループ中のx,y座標からfieldを取得
    - そのfieldが埋まっているなら、continue
    - そのx,yを置くことが出来るかを確かめるために、checkPutAbilityで確かめる
    - trueなら、上記の配列に座標を追加
    - ループが終わったら、座標の配列を返す
- getReverseFields
  - 置くときにひっくり返せる座標を配列で返す
  - 引数
    - a
  - 処理
    - a

### 流れ


## src下のファイルの説明
- components
  - BlackPutmarker
    - 置けるフィールドに表示する（黒い）マーカー
  - BlackStone
    - 黒い石を表示する
  - Board
    - 盤上を表示
  - EndGameMessage
    - 勝敗が付いた時に表示するメッセージ
  - GameStatus
    - プレイヤーのターン、パスするボタン、EndGameMessageを表示
  - WhitePutMarker
    - 置けるフィールドに表示する（黒い）マーカー
  - WhiteStone
    - 黒い石を表示する
- routes
  - +layout
    - +pageをラップする
    - meta情報、画面のレイアウト、CSSのimportをする
  - +page
    - ページファイル。
    - ページタイトル、Board、GameStatusを表示する
  - reversi.ts
    - リバーシの純粋関数のロジックを定義
    - getPutAbleAllField、checkPutAbility、getReverseFields を定義
  - utils.ts
    - ドメインを含まない純粋な関数を定義
    - checkAllElementsFill を定義
