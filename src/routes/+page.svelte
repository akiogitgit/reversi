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

	const FIELD_SIZE = 8

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
		for (let i = 0; i < targetFields.length; i++) {
			const { x, y } = targetFields[i]
			fields[y][x] = currentColor
		}
	}

	// TODO: 隣ならbreakはいらないかも？

	// 挟めるか判定じゃなくて、挟む関数でいい
	const checkSandwichAbility = (y: number, x: number): Position[] => {
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
					if (i === y - 1) break // 隣(1つ上)が同じ色ならひっくり返せない
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
					if (i === y + 1) break
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
					if (i === x - 1) break
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
					if (i === x + 1) break
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
					if (ix === x - 1) break
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

			for (let ix = x + 1, iy = y + 1; ix < FIELD_SIZE && iy < FIELD_SIZE; ix++, iy++) {
				const field = fields[iy][ix]
				if (!field) break

				if (field === currentColor) {
					if (ix === x + 1) break
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
					if (ix === x + 1) break
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
					if (ix === x + 1) break
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

		const targetFields = checkSandwichAbility(y, x)
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

	<!-- <p class="mt-8 text-center text-xl">{currentColor === '白' ? '白' : '黒'}の番です</p> -->
	<div class="flex mt-8 text-center text-xl items-center justify-center">
		<div
			class="h-11vw max-h-60.5px max-w-60.5px grid w-11vw place-items-center sm:(h-60.5px w-60.5px)"
		>
			{#if currentColor === '白'}
				<WhiteStone />
			{:else if currentColor === '黒'}
				<BlackStone />
			{/if}
		</div>
		の番です
	</div>
</section>
