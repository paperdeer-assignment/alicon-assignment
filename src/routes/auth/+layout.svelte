<script>
	const { children } = $props();
</script>

<section>
	<main>
		{@render children()}
	</main>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	main {
		width: 100%;
		max-width: 400px;
		padding: 16px;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
</style>
