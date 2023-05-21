<script>
	import 'virtual:windi.css'
</script>

<svelte:head>
	<title>リバーシ</title>
	<meta name="description" content="リバーシ" />
	<link rel="icon" href="/reversi.webp" />
	<meta name="keywords" content="オセロ, リバーシ, オセロゲーム" />
	<meta property="og:image" content="/reversi.webp" />
	<meta property="og:site_name" content="リバーシ" />
	<meta property="og:locale" content="ja_JP" />
</svelte:head>

<main class="mx-auto mt-8 max-w-500px w-90vw">
	<!-- +page.svelteを埋め込む -->
	<slot />
</main>
