<script lang="ts">
	import type { MessageGroup } from '$lib/types/chat';
	import { linkify } from '$lib/utils/chat';
	import { displayHourFormat } from '$lib/utils/date';

	let { messages }: { messages: MessageGroup } = $props();
</script>

<li class="chat-content-container">
	<img width="25" height="25" src={messages.profileImage} alt="" />
	<div>
		<p class="user-name">
			{messages.userName}
			{#if messages.messages[0].isMine}
				<span class="self-message">(나)</span>
			{/if}
		</p>

		{#each messages.messages as message}
			<pre class="content">{@html linkify(message.content)}</pre>
		{/each}

		<span class="posted-at">- {displayHourFormat(messages.lastMessagePostedAt)}</span>
	</div>
</li>

<style>
	.chat-content-container {
		display: flex;
		gap: 10px;
	}
	.content {
		font-size: 14px;
		&:first-of-type {
			margin-top: 10px;
		}

		&:last-of-type {
			display: inline-block;
			margin-right: 12px;
		}
	}

	.user-name {
		font-size: 20px;
		color: #888;
	}

	.posted-at {
		font-size: 12px;
		color: #888;
	}
</style>
