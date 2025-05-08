<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<section>
	{@render children()}
</section>
