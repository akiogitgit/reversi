<script lang="ts">
	import { fly } from 'svelte/transition'
	import { FIELD_SIZE, type Color, type Field } from '../routes/+page.svelte'
	import BlackStone from './BlackStone.svelte'
	import EndGameMessage from './EndGameMessage.svelte'
	import WhiteStone from './WhiteStone.svelte'
	import { checkAllElementsFill } from '../routes/utils'

	export let fields: Field[][]
	export let currentColor: Color
	export let ableToPut: boolean
	export let onPass: () => void

	let isFinished = false
	let isPassedPrev = false // 前回パスした
	let finishMessage = '' // 〇対✕で...
	let winner: Field = null // 〇の勝ち

	// ここで終了か判定する
	// currentColorが変わる度実行する
	$: {
		const _ = currentColor // watchするためだけに置く

		let unableToPutBoth = false // どちらも置けない (命名おかしい)

		// 置ける場所が無く、前回パスした
		if (!ableToPut && isPassedPrev) unableToPutBoth = true
		isPassedPrev = !ableToPut // パスしたかを更新

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

<div class="flex text-xl gap-4 justify-center items-center">
	{#if isFinished}
		<EndGameMessage {finishMessage} {winner} />
	{:else}
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

		{#if !ableToPut}
			<button
				class="border border-black rounded-md py-2 px-4"
				on:click={onPass}
				in:fly={{ duration: 1000, y: 20 }}
			>
				パスする
			</button>
		{/if}
	{/if}
</div>
