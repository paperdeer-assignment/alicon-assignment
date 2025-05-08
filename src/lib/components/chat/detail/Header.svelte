<script lang="ts">
	import type { ChattingRoomDetail } from '$lib/types/chat';

	let { room }: { room: ChattingRoomDetail } = $props();
</script>

<header>
	<div class="user-info">
		<p class="user-name">{room.userName}</p>
		<p class="tag">{room.tag}</p>
	</div>
	<p class="user-position">{room.userPosition}</p>
</header>

<style>
	header {
		width: 100%;
		padding: 20px 32px;
	}
	.user-info {
		display: flex;
		align-items: center;
	}
	.user-name {
		font-size: 24px;
	}
	.tag {
		height: fit-content;
		font-size: 10px;
		padding: 4px 12px;
		border-radius: 20px;
		background-color: #8bcead;
		color: white;
		margin-left: 8px;
	}
	.user-position {
		font-size: 12px;
		color: #2e2ef0;
		margin-top: 4px;
	}
</style>
