## リバーシ

このURLから遊べます

https://reversi-fawn.vercel.app

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
    - ひっくり返すフィールドの座標を配列で受け取る（x:number, y:number）
  - 処理
    - 引数でひっくり返すフィールドの座標を配列で受け取り、その値をcurrentColorに変える
- onClickField
  - フィールドを押したときの処理
  - 引数
    - フィールドの座標を受け取る（x:number, y:number）
  - 処理
    - 既に置かれている時は終了
    - getReverseFields関数から、ひっくり返すフィールドを受け取る
    - ひっくり返すフィールドが一つも無いなら終了
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
    - 配列のサイズ、配列（fieldSize:number, array: readonly any[]）
  - 処理
    - 引数の配列をflatで一次元配列にして、nullでない要素のみにフィルターする
    - 上記の処理で作成した配列の長さが、引数のサイズの二乗と同じかを返す
- checkPutAbility
  - 引数の座標が置けるかをチェック
  - 上下左右斜め、どれか１個でもひっくり返せるならtrue、どの方向も返せないならfalseを返す
  - 引数
    - 置くフィールドの座標、フィールド、現在の色（y: number,x: number,fields: Field[][],currentColor: Color）
  - 処理
    - 上下左右斜め、どれか１個でもひっくり返せるならtrue、どの方向も返せないならfalseを返す
    - それぞれ以下の判定を行う（例　上方向をひっくり返せるかを判定する時）
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
    - フィールド、現在の色（fields: Field[][], currentColor: Color）
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
    - 置くフィールドの座標、フィールド、現在の色（y: number, x: number, fields: Field[][], currentColor: Color）
  - 処理
    - checkPutAbility と同じような処理でひっくり返せる座標を見つけたら配列に入れて、まとめて返すような処理。
    - 以下の判定に入る前に、ひっくり返す座標を配列で保持する定数を定義する。（targetFields）
    - それぞれ以下の判定を行う（例　上方向をひっくり返せるかを判定する時）
      - まず置いた時に上をひっくり返せる位置かをチェック。y座標は1以上でないとそもそもひっくり返せない
      - ひっくり返せる石があるかを持つ、変数を定義（ableToPut）
      - 置く石と連続して隣り合う違う色の石の座標の配列を、定数で定義（otherColorFields）
      - 置く位置のy座標から、0までループする。
        - この時のフィールドは、fields [ループのindex] [置く位置のx座標] で取得できる
        - その時フィールドが置かれていないなら、この方向はひっくり返せないので終了
        - そのフィールドが、現在の色と同じならひっくり返すことが出来るので、abbleToPutをtrueにしてループを抜ける
          - （ここでループが一回目なら置く位置と隣り合って同じ色なのでひっくり返せないが、ableToPutはtrueにしても良い。なぜならtargetFieldsに空の配列(otherColorFields)を展開して追加しても変わらないから）
       - ループの後、ableToPutがtrueならotherColorFieldsを展開して、targetFieldsに追加する
     - これを上下左右斜めやっている
     - 一つの方向でひっくり返せる座標があれば、targetFieldsに追加して、無ければ追加しないで次の方向に行く。
     - 全ての方向の判定が終わったら、targetFieldsを返す。

### 流れ
初期状態
- fields を 8 * 8 のフィールドで、真ん中2つずつ白、黒を置く
- currentColor は 黒
- putAbleFields に、getPutAbleAllFieldを使い置ける位置を座標の配列で格納
- Boardコンポーネントに、fields, putAbleFields, onClickField, currentColorを引数で渡す。それを元に盤面を表示、置ける位置をマークし、フィールドをクリック出来るようにする。
- GameStatusコンポーネントに、fields, currentColor, ableToPut(putAbleFieldsがあるかをBooleanで渡す), onPassにtoggleTurn をProps渡し、ゲームの状態を表示する。

フィールドをクリックする
- onClickFieldが走る
- もしクリックしたフィールドが置けない位置なら何も変化しない。
- 置ける位置なら、クリックしたfieldsの座標にcurrentColorを代入する
- 挟める石をまとめてひっくり返す
- プレイヤーが交代され、置ける位置が再計算され、画面上に再度マークされる

どこも置けなくなった時
- ゲームを進めると置けるフィールドがない時がある。
- その時は、GameStatusがableToPutがfalseの時、「パスする」というボタンを表示する。
- このボタンを押すとtoggleTurnが実行されて、プレイヤーが後退され、置ける位置が再計算され、画面上に再度マークされる

終了判定
- この判定はプレイヤーが交代される度チェックされる。
- 終了条件は以下の2通りある
  - 今のフィールドが全て石で埋まっている時
  - 2回連続でパスをした時
- 終了の処理
  - isFinishedがtrueになり、白石と黒石を数える。
  - 白石と黒石を比べてwinnerとメッセージを代入する。
- isFinishedがtrueになると、EndGameMessageが表示される。
  - EndGameMessageに finishMessage, winnerをProps渡す
  - EndGameMessageは、「白石数 対 黒石数 で、 〇石 の勝ち」 と表示する。
    - 例） 20対44で、白石 の勝ち

## src下のファイルの説明
- components
  - BlackPutmarker
    - 置けるフィールドに表示する（黒い）マーカー
  - BlackStone
    - 黒い石を表示する
  - Board
    - 盤上を表示
    - 引数
      - fields、onClickField、putAbleFields、currentColor
  - EndGameMessage
    - 勝敗が付いた時に表示するメッセージ
    - 引数
      - finishMessage、winner
  - GameStatus
    - プレイヤーのターン、パスするボタン、EndGameMessageを表示
    - 引数
      - fields、currentColor、ableToPut、onPass
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
