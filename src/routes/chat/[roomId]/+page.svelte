<script lang="ts">
	import type { PageProps } from './$types';
	import Header from '$lib/components/chat/detail/Header.svelte';
	import ChatArea from '$lib/components/chat/detail/ChatArea.svelte';

	let { data }: PageProps = $props();

	let messages = $state(data.room.messages);

	$effect(() => {
		messages = data.room.messages;
	});
</script>

<main>
	<Header room={data.room} />
	<hr />
	<ChatArea {messages} roomId={data.room.id} />
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
	}
</style>
