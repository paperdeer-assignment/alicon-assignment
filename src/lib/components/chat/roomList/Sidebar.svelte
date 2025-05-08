<script lang="ts">
	import type { ChattingRoom, ChattingRoomId } from '$lib/types/chat';
	import type { GetChattingRoomListResponse } from '../../../../routes/api/chat/type';
	import ChattingRoomItem from './ChattingRoomItem.svelte';

	let {
		rooms,
		currentRoomId
	}: {
		rooms: ChattingRoom[];
		currentRoomId: ChattingRoomId | null;
	} = $props();

	let searchRoomIds = $state<ChattingRoomId[]>(rooms.map((room) => room.id));

	$effect(() => {
		searchRoomIds = rooms.map((room) => room.id);
	});

	const searchRooms = $derived(rooms.filter((room) => searchRoomIds.includes(room.id)));

	let unreadChattingRoomCount = $derived(
		searchRooms.filter((room) => room.unreadMessageCount > 0).length
	);

	const onSearchChatting = async (event: SubmitEvent) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const searchInput = form.elements.namedItem('search-input') as HTMLInputElement;
		const searchQuery = searchInput.value;

		const res = await fetch(`/api/chat?searchQuery=${searchQuery}`, {
			method: 'GET'
		});

		const { rooms }: GetChattingRoomListResponse = await res.json();
		searchRoomIds = rooms.map((room) => room.id);
	};
</script>

<aside class="sidebar">
	<div class="header">
		<p>안 읽은 대화방({unreadChattingRoomCount})</p>
		<a href="/chat" class="new-message-button">새로운 메세지</a>
	</div>
	<hr />
	<form class="search-input-container" onsubmit={onSearchChatting}>
		<input class="search-input" type="text" placeholder="대화 검색하기" name="search-input" />
	</form>
	<ul>
		{#each searchRooms as room}
			<li class:selected={room.id === currentRoomId}>
				<ChattingRoomItem {room} />
			</li>
		{/each}
	</ul>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		width: 300px;
		min-width: 300px;
		background: #f7f7f7;
		border-right: 1px solid #eee;
		height: 100vh;
		padding: 16px 0;
	}
	.header {
		display: flex;
		padding: 16px;
	}
	.new-message-button {
		margin-left: auto;
	}
	.search-input-container {
		padding: 16px;
	}
	.search-input {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #ddd;
		border-radius: 12px;
	}

	ul {
		padding: 4px;
		overflow-y: scroll;
		flex: 1;
	}
	li {
		transition: background 0.2s;
		border-left: 4px solid transparent;
	}
	li.selected {
		border-left: 4px solid blue;
	}
</style>
