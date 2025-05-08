<script lang="ts">
	import type { ChattingRoom } from '$lib/types/chat';
	import { formatChatDisplayTime } from '$lib/utils/date';

	let { room }: { room: ChattingRoom } = $props();
	const isUnread = $derived(room.unreadMessageCount > 0);
</script>

<a href={`/chat/${room.id}`} class="room-item" class:unread={isUnread}>
	<img
		width="50"
		height="50"
		src={room.profileImage}
		alt={room.userName}
		class="room-profile-image"
	/>
	<div class="room-info-container">
		<div class="room-info">
			<p class="room-title">
				{room.userName}
				{#if isUnread}
					<span class="unread-message-count">({room.unreadMessageCount})</span>
				{/if}
			</p>
			{#if room.lastMessage}
				<p class="room-last-message-time gray">
					{formatChatDisplayTime(room.lastMessage.postedAt)}
				</p>
			{/if}
		</div>
		{#if room.lastMessage}
			<p class="room-last-message gray">{room.lastMessage.content}</p>
		{/if}
	</div>
</a>

<style>
	.unread {
		background-color: white;
	}
	.room-item {
		display: flex;
		gap: 4px;
		align-items: center;
		padding: 12px 20px;
		overflow: hidden;
	}
	.room-profile-image {
		border-radius: 50%;
	}
	.room-info-container {
		margin-left: 4px;
	}
	.room-info {
		display: flex;
		gap: 4px;
	}
	.room-last-message-time {
		&::before {
			content: '·';
			margin-right: 4px;
		}
	}

	.gray {
		color: gray;
	}
</style>
