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
	// 4. 挟んだらひっくり返す
	// 5. 勝敗

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

	let nextPlayer: '黒' | '白' = '黒'

	// プレイヤーを交互に
	const changePlayer = () => {
		nextPlayer = nextPlayer === '白' ? '黒' : '白'
	}

	// フィールドを押す
	const onClickField = (y: number, x: number) => {
		if (fields[y][x]) return
		fields[y][x] = nextPlayer
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

	<p class="mt-8 text-center text-xl">{nextPlayer === '白' ? '黒' : '白'}の番です</p>
</section>
