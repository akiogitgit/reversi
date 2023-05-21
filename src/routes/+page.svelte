<script lang="ts" context="module">
	export const FIELD_SIZE = 8

	export type Position = { y: number; x: number }
	export type Field = null | '黒' | '白'
	export type Color = '黒' | '白'
</script>

<script lang="ts">
	import Board from '../components/Board.svelte'
	import { getPutAbleAllField, getReverseFields } from './reversi'
	import GameStatus from '../components/GameStatus.svelte'

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
	let currentColor: Color = '黒'
	let putAbleFields: Position[] = getPutAbleAllField(fields, currentColor) // 置くことが出来る位置

	// プレイヤーを交互に
	const toggleTurn = () => {
		currentColor = currentColor === '白' ? '黒' : '白'
		// 置くことが出来る座標を更新
		putAbleFields = getPutAbleAllField(fields, currentColor)
	}

	// 受けとった位置の石をひっくり返す
	const reverseFields = (targetFields: Position[]) => {
		for (let i = 0; i < targetFields.length; i++) {
			const { x, y } = targetFields[i]
			fields[y][x] = currentColor
		}
	}

	// フィールドを押す
	const onClickField = (y: number, x: number) => {
		if (fields[y][x]) return // 既に置かれている

		// ひっくり返すフィールドの座標
		const targetFields = getReverseFields(y, x, fields, currentColor)
		if (!targetFields.length) return // ひっくり返せない

		fields[y][x] = currentColor // 石を置く
		reverseFields(targetFields) // ひっくり返す
		toggleTurn()
		putAbleFields = getPutAbleAllField(fields, currentColor)
	}
</script>

<section>
	<h1 class="font-bold text-center text-40px">リバーシ</h1>

	<Board {fields} {putAbleFields} {onClickField} {currentColor} />

	<div class="mt-8">
		<GameStatus
			{fields}
			{currentColor}
			ableToPut={!!putAbleFields.length}
			onPass={toggleTurn}
		/>
	</div>
</section>
