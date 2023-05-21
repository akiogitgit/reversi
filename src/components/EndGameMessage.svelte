<script lang="ts">
	import { fly } from 'svelte/transition'
	import BlackStone from './BlackStone.svelte'
	import WhiteStone from './WhiteStone.svelte'
	import type { Field } from '../routes/+page.svelte'

	export let finishMessage: string // 〇対✕で...
	export let winner: Field // 〇の勝ち
</script>

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
