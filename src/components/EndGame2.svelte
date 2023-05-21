<script lang="ts">
	import { fly } from 'svelte/transition'
	import BlackStone from './BlackStone.svelte'
	import WhiteStone from './WhiteStone.svelte'
	import { FIELD_SIZE, type Field, type Position } from '../routes/+page.svelte'
	import { checkAllElementsFill } from '../routes/utils'

	// isFinishedは受け取るけど、判定して上に投げる
	// いや、イベントを投げよう
	export let fields: Field[][]
	export let putAbleFields: Position[]
	// export let currentColor: Field
	export let isFinished: boolean

	let isPassedPrev = false // 前回パスした
	// let isFinished = false
	let finishMessage = '' // 〇対✕で...
	let winner: Field = null // 〇の勝ち

	console.log('再レンダリングされますか？')

	// putAbleFields変わる度に発火する
	// 終了か判定
	$: {
		console.log('実行される？')
		let unableToPutBoth = false // どちらも置けない (文法的におかしい)
		// 置ける場所が無く、前回パスした
		if (!putAbleFields.length && isPassedPrev) unableToPutBoth = true
		isPassedPrev = !putAbleFields.length

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
</script>

{#if isFinished}
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
