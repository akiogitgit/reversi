<script lang="ts">
	// ルール
	// 8 * 8
	// 中央のマスに黒、白を2個置く。右上、左下が黒
	// 選考を黒で交互に打つ。
	// どこも挟めないならパスする
	// 盤上全て埋まるか、どちらも挟めないなら終了
	// 石の多い方の勝利。引き分けもある。

	import BlackStone from '../components/BlackStone.svelte'
	import WhiteStone from '../components/WhiteStone.svelte'

	// 考えること
	// 1. 盤上を表示
	// 2. 順番に押す
	// 3. 押せる場所を挟める場所のみに
	// 3. (押せる場所を一覧で表示する？ or 押したときに挟めるか判定)
	// 4. 挟んだらひっくり返す
	// 5. 勝敗

	type Position = { y: number; x: number }
	type Field = null | '黒' | '白'
	let fields: Field[][] = [
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, '白', '黒', null, null, null],
		[null, null, null, '黒', '白', null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null]
	]

	let currentColor: '黒' | '白' = '黒'

	// プレイヤーを交互に
	const changePlayer = () => {
		currentColor = currentColor === '白' ? '黒' : '白'
	}

	// 受けとった位置の石をひっくり返す
	const reverseFields = (targetFields: Position[]) => {
		// TODO: console.log('受け取ったよ', targetFields)
		for (let i = 0; i < targetFields.length; i++) {
			const { x, y } = targetFields[i]
			fields[y][x] = currentColor
		}
	}

	// 挟めるか判定じゃなくて、挟む関数でいい
	const checkSandwichAbility = (y: number, x: number): false | Position[] => {
		let ableToPut = false // ひっくり返せる石があるか
		const targetFields: Position[] = [] // ひっくり返す予定のフィールド

		// 上　(上をひっくり返せる位置に置いた)
		if (y > 1) {
			const nextColor = fields[y - 1][x]
			if (nextColor === currentColor) return false // 隣が同じ色

			// forでcurrentColorと同じ色が出るまで、座標を配列に格納する
			for (let i = y - 1; i >= 0; i--) {
				const field = fields[i][x]
				if (!field) break // 置かれていない

				// 同じ色が出たら、trueにしてループを抜ける
				if (field === currentColor) {
					ableToPut = true
					break
				}
				targetFields.push({ x, y: i })
			}
		}

		// ひっくり返せるなら、対象の座標を返す
		return ableToPut && targetFields
	}

	// フィールドを押す
	// 挟めたかチェックして、置きたい
	// 挟む関数で挟めたかを返すのはキモイ
	const onClickField = (y: number, x: number) => {
		if (fields[y][x]) return // 既に置かれている

		const targetFields = checkSandwichAbility(y, x)
		if (!targetFields) return // ひっくり返せない

		fields[y][x] = currentColor
		// ひっくり返す関数(targetFields)
		reverseFields(targetFields)
		changePlayer()
	}
</script>

<section>
	<h1 class="font-bold text-center text-40px">リバーシ</h1>

	<div class="border-black rounded-md bg-green-500 border-8 mt-8">
		{#each fields as field1, y (y)}
			<div class="flex">
				{#each field1 as field, x (x)}
					<button
						class="border border-black h-11vw max-h-60.5px grid w-11vw place-items-center sm:(h-60.5px w-60.5px)"
						on:click={() => onClickField(y, x)}
					>
						{#if field === '白'}
							<WhiteStone />
						{:else if field === '黒'}
							<BlackStone />
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	<p class="mt-8 text-center text-xl">{currentColor === '白' ? '白' : '黒'}の番です</p>
</section>
