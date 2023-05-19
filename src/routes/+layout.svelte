<script>
	import 'virtual:windi.css'
</script>

<svelte:head>
	<title>オセロ</title>
	<meta name="description" content="オセロ" />
</svelte:head>

<main class="mx-auto mt-8 max-w-500px w-90vw">
	<!-- +page.svelteを埋め込む -->
	<slot />
</main>
