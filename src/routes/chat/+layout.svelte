<script lang="ts">
	import type { LayoutProps } from './$types';
	import ChattingRoomSidebar from '$lib/components/chat/roomList/Sidebar.svelte';
	import { userStore } from '$lib/store/user';

	let { children, data }: LayoutProps = $props();

	const rooms = $derived(data.rooms);

	if (data.userInfo) {
		userStore.set({
			id: data.userInfo.id,
			name: data.userInfo.name,
			profileImage: data.userInfo.profileImage
		});
	}
</script>

<section>
	<ChattingRoomSidebar {rooms} currentRoomId={data.roomId} />
	{@render children()}
</section>

<style>
	section {
		display: flex;
	}
</style>
