<script lang="ts">
	import type { Field, Position } from '../routes/+page.svelte'
	import BlackPutMarker from './BlackPutMarker.svelte'
	import BlackStone from './BlackStone.svelte'
	import WhitePutMarker from './WhitePutMarker.svelte'
	import WhiteStone from './WhiteStone.svelte'

	export let fields: Field[][]
	export let onClickField: (y: number, x: number) => void
	export let putAbleFields: Position[]
	export let currentColor: '白' | '黒'
</script>

<div class="border-black rounded-md bg-green-500 border-8 mt-8">
	{#each fields as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
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
			{/each}
		</div>
	{/each}
</div>
