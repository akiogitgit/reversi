<script lang="ts">
	// ルール
	// 8 * 8
	// 中央のマスに黒、白を2個置く。右上、左下が黒
	// 選考を黒で交互に打つ。
	// どこも挟めないならパスする
	// 盤上全て埋まるか、どちらも挟めないなら終了
	// 石の多い方の勝利。引き分けもある。

	import BlackPutMarker from '../components/BlackPutMarker.svelte'
	import BlackStone from '../components/BlackStone.svelte'
	import WhitePutMarker from '../components/WhitePutMarker.svelte'
	import WhiteStone from '../components/WhiteStone.svelte'
	import { fly } from 'svelte/transition'

	// やること
	// 1. 盤上を表示
	// 2. 順番に押す
	// 3. 押せる場所を挟める場所のみに
	// 3. (押せる場所を一覧で表示する？ or 押したときに挟めるか判定)
	// 4. 挟んだらひっくり返す
	// 5. 現状で押せる位置を配列に格納
	// 6. 置ける位置にマーカー
	//    (押せる位置のみtabIndex付ける)
	// 7. 置ける位置がない時、パスボタン表示
	// 8. 勝敗
	//    盤上が全部埋まったら終了
	//    白・黒を数えて多い方が勝ちと表示。引き分けも
	//    両方押せない時も終了
	// 9. リファクタリング
	//    コンポーネント、カスタムフック？

	const FIELD_SIZE = 8

	type Position = { y: number; x: number }
	type Field = null | '黒' | '白'

	let fields: Field[][] =
		// [
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', null, '白', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['白', '白', '白', '白', '白', '白', '白', '白'],
		// 	['白', '白', '白', '白', '白', '白', '白', '白'],
		// 	['白', '白', '白', '白', '白', '白', '白', '白'],
		// 	['白', '白', '白', '白', '白', '白', '白', '白']
		// ]
		// 両方パスで終了
		// [
		// 	['黒', '黒', '黒', '黒', '黒', '黒', null, '黒'],
		// 	['黒', null, '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '白', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	['黒', '黒', '黒', '黒', '黒', '黒', '黒', '黒'],
		// 	[null, '黒', '黒', '黒', '黒', '黒', '黒', '黒']
		// ]
		[
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
	let putAbleFields: Position[] = [] // 置くことが出来る位置

	let isPassedPrev = false // 前回パスした
	let isFinished = false
	let finishMessage = '30対20で' // 〇対✕で...
	let winner: Field = null // 〇の勝ち

	// 座標が押せるかをチェック
	const checkPutAbility = (y: number, x: number): boolean => {
		// 上 をひっくり返せるかチェック
		if (y > 1) {
			// forでcurrentColorと同じ色が出るまで、座標を配列に格納する
			for (let i = y - 1; i >= 0; i--) {
				const field = fields[i][x]
				if (!field) break // 置かれていない

				// 同じ色が出たら、trueにしてループを抜ける
				if (field === currentColor) {
					if (i === y - 1) break // 隣(1つ上)が同じ色ならひっくり返せない
					return true
				}
			}
		}

		// 下 をひっくり返せるかチェック
		if (y < FIELD_SIZE - 2) {
			for (let i = y + 1; i < FIELD_SIZE; i++) {
				const field = fields[i][x]
				if (!field) break

				if (field === currentColor) {
					if (i === y + 1) break
					return true
				}
			}
		}

		// 左 をひっくり返せるかチェック
		if (x > 1) {
			for (let i = x - 1; i >= 0; i--) {
				const field = fields[y][i]
				if (!field) break

				if (field === currentColor) {
					if (i === x - 1) break
					return true
				}
			}
		}

		// 右 をひっくり返せるかチェック
		if (x < FIELD_SIZE - 2) {
			for (let i = x + 1; i < FIELD_SIZE; i++) {
				const field = fields[y][i]
				if (!field) break

				if (field === currentColor) {
					if (i === x + 1) break
					return true
				}
			}
		}

		// 左上 をひっくり返せるかチェック
		if (x > 1 && y > 1) {
			for (let ix = x - 1, iy = y - 1; ix >= 0 && iy >= 0; ix--, iy--) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					if (ix === x - 1) break
					return true
				}
			}
		}

		// 右下 をひっくり返せるかチェック
		if (x < FIELD_SIZE - 2 && y < FIELD_SIZE - 2) {
			for (
				let ix = x + 1, iy = y + 1;
				ix < FIELD_SIZE && iy < FIELD_SIZE;
				ix++, iy++
			) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					if (ix === x + 1) break
					return true
				}
			}
		}

		// 右上 をひっくり返せるかチェック
		if (x < FIELD_SIZE - 2 && y > 1) {
			for (let ix = x + 1, iy = y - 1; ix < FIELD_SIZE && iy >= 0; ix++, iy--) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					if (ix === x + 1) break
					return true
				}
			}
		}

		// 左下 をひっくり返せるかチェック
		if (x > 1 && y < FIELD_SIZE - 2) {
			for (let ix = x - 1, iy = y + 1; ix >= 0 && iy < FIELD_SIZE; ix--, iy++) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					if (ix === x - 1) break
					return true
				}
			}
		}

		return false
	}

	// TODO: 分かりにくいから関数にする
	$: {
		const _ = currentColor // 石が変わる度に実行するために設置

		// 全フィールドで置けるか確認
		putAbleFields = []
		for (let y = 0; y < FIELD_SIZE; y++) {
			for (let x = 0; x < FIELD_SIZE; x++) {
				if (fields[y][x]) continue // 石が置かれている位置は除く

				const ableToPut = checkPutAbility(y, x)
				if (ableToPut) putAbleFields = [...putAbleFields, { x, y }]
			}
		}

		// 終了か判定
		let unableToPutBoth = false // どちらも置けない (文法的におかしい)
		// 置ける場所が無く、前回パスした
		if (!putAbleFields.length && isPassedPrev) unableToPutBoth = true
		isPassedPrev = !putAbleFields.length

		// 引数の配列でnullでない要素数が、マス数と同じ
		const checkAllElementsFill = (fieldSize: number, array: readonly any[]) => {
			// 配列を1次元配列にして、nullの要素を弾く
			const fillElements = array.flat().filter(Boolean)
			return fillElements.length === fieldSize * fieldSize
		}

		// 全部埋まったか、どちらも押せないなら終了
		if (checkAllElementsFill(FIELD_SIZE, fields) || unableToPutBoth) {
			isFinished = true
			const whiteCount = fields.flat().filter(v => v === '白').length
			const blackCount = fields.flat().filter(v => v === '黒').length

			finishMessage = `${whiteCount}対${blackCount}で`
			if (whiteCount > blackCount) winner = '白'
			if (blackCount > whiteCount) winner = '黒'
		}
	}

	// プレイヤーを交互に
	const changePlayer = () => {
		currentColor = currentColor === '白' ? '黒' : '白'
	}

	// 受けとった位置の石をひっくり返す
	const reverseFields = (targetFields: Position[]) => {
		for (let i = 0; i < targetFields.length; i++) {
			const { x, y } = targetFields[i]
			fields[y][x] = currentColor
		}
	}

	// TODO: 隣ならbreakはいらないかも？

	const getReverseFields = (y: number, x: number): Position[] => {
		const targetFields: Position[] = [] // ひっくり返すフィールド

		// 上 をひっくり返せる位置に置いた
		if (y > 1) {
			let ableToPut = false // ひっくり返せる石があるか
			const otherColorFields: Position[] = [] // 連続する違う色の座標

			// forでcurrentColorと同じ色が出るまで、座標を配列に格納する
			for (let i = y - 1; i >= 0; i--) {
				const field = fields[i][x]
				if (!field) break // 置かれていない

				// 同じ色が出たら、trueにしてループを抜ける
				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x, y: i }) // 座標を追加
			}

			// 上向きにひっくり返せるなら、targetFieldsに追加
			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 下 をひっくり返せる位置に置いた
		if (y < FIELD_SIZE - 2) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (let i = y + 1; i < FIELD_SIZE; i++) {
				const field = fields[i][x]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x, y: i })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 左 をひっくり返せる位置に置いた
		if (x > 1) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (let i = x - 1; i >= 0; i--) {
				const field = fields[y][i]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x: i, y })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 右 をひっくり返せる位置に置いた
		if (x < FIELD_SIZE - 2) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (let i = x + 1; i < FIELD_SIZE; i++) {
				const field = fields[y][i]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x: i, y })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 左上 をひっくり返せる位置に置いた
		if (x > 1 && y > 1) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (let ix = x - 1, iy = y - 1; ix >= 0 && iy >= 0; ix--, iy--) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x: ix, y: iy })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 右下 をひっくり返せる位置に置いた
		if (x < FIELD_SIZE - 2 && y < FIELD_SIZE - 2) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (
				let ix = x + 1, iy = y + 1;
				ix < FIELD_SIZE && iy < FIELD_SIZE;
				ix++, iy++
			) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x: ix, y: iy })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 右上 をひっくり返せる位置に置いた
		if (x < FIELD_SIZE - 2 && y > 1) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (let ix = x + 1, iy = y - 1; ix < FIELD_SIZE && iy >= 0; ix++, iy--) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x: ix, y: iy })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		// 左下 をひっくり返せる位置に置いた
		if (x > 1 && y < FIELD_SIZE - 2) {
			let ableToPut = false
			const otherColorFields: Position[] = []

			for (let ix = x - 1, iy = y + 1; ix >= 0 && iy < FIELD_SIZE; ix--, iy++) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					ableToPut = true
					break
				}
				otherColorFields.push({ x: ix, y: iy })
			}

			if (ableToPut) targetFields.push(...otherColorFields)
		}

		return targetFields
	}

	// フィールドを押す
	const onClickField = (y: number, x: number) => {
		if (fields[y][x]) return // 既に置かれている

		const targetFields = getReverseFields(y, x)
		if (!targetFields.length) return // ひっくり返せない

		fields[y][x] = currentColor // 石を置く
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
					<div>
						<button
							class="border border-black h-11vw max-w-60.5px max-h-60.5px grid w-11vw place-items-center"
							on:click={() => onClickField(y, x)}
						>
							{#if field === '白'}
								<WhiteStone />
							{:else if field === '黒'}
								<BlackStone />
							{:else if putAbleFields.find(pos => pos.x === x && pos.y === y)}
								{#if currentColor === '白'}
									<WhitePutMarker />
								{:else}
									<BlackPutMarker />
								{/if}
							{/if}
						</button>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="flex mt-8 text-xl gap-4 justify-center items-center">
		{#if !isFinished}
			<div class="flex items-center justify-center">
				<div
					class="h-11vw max-h-60.5px max-w-60.5px grid w-11vw place-items-center sm:(h-60.5px w-60.5px) "
				>
					{#if currentColor === '白'}
						<WhiteStone />
					{:else if currentColor === '黒'}
						<BlackStone />
					{/if}
				</div>
				の番です
			</div>

			{#if !putAbleFields.length}
				<button
					class="border border-black rounded-md py-2 px-4"
					on:click={changePlayer}
					in:fly={{ duration: 1000, y: 20 }}
				>
					パスする
				</button>
			{/if}
		{:else}
			<p in:fly={{ duration: 1000, y: 20, delay: 500 }}>{finishMessage}</p>
			<div
				class="flex gap-2 items-center justify-center"
				in:fly={{ duration: 1000, y: 20, delay: 2000 }}
			>
				{#if winner}
					<div
						class="h-11vw max-h-60.5px max-w-60.5px grid w-11vw place-items-center sm:(h-60.5px w-60.5px) "
					>
						{#if winner === '白'}
							<WhiteStone />
						{:else if winner === '黒'}
							<BlackStone />
						{/if}
					</div>
					の勝ち
				{:else}
					引き分け
				{/if}
			</div>
		{/if}
	</div>
</section>
