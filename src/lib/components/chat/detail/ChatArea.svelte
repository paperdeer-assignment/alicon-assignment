<script lang="ts">
	import type { Message } from '$lib/types/chat';
	import ChatContent from './ChatContent.svelte';
	import ChatInput from './ChatInput.svelte';
	import { getGroupedMessages } from '$lib/utils/chat';
	import { updateLastReadMessageId } from '$lib/utils/api';
	import { useChatWebSocket } from '$lib/hooks/useChatWebSocket';

	let { messages, roomId }: { messages: Message[]; roomId: string } = $props();

	let localMessages = $state<Message[]>([]);
	const { messagesGroupByDate, lastMessageId } = $derived(
		getGroupedMessages(messages.concat(localMessages))
	);

	let chatListRef: HTMLUListElement;

	const scrollToBottom = () => {
		chatListRef.scrollTop = chatListRef.scrollHeight;
	};

	$effect(() => {
		updateLastReadMessageId(roomId, lastMessageId);
		scrollToBottom();
	});

	// onSubmit 함수에서 roomId를 참조하고 있어, effect가 실행되는 것을 방지하기 위한 처리
	let chattingRoomId = $derived(roomId);
	$effect(() => {
		chattingRoomId;
		localMessages = [];
	});

	const { sendMessage, setRoomId } = useChatWebSocket({
		roomId,
		updateLocalMessages: (message) => localMessages.push(message)
	});

	$effect(() => {
		setRoomId(roomId);
	});

	const onSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const chatInput = form.elements.namedItem('chat-input') as HTMLTextAreaElement;
		sendMessage(chatInput.value);
		chatInput.value = '';
	};
</script>

<section>
	<ul bind:this={chatListRef}>
		{#if !messages.length}
			<li class="no-chat">
				<p>채팅 내용이 없습니다.</p>
			</li>
		{:else}
			{#each messagesGroupByDate as chatContent}
				<li class="date">
					<hr />
					<p class="date-text">{chatContent.date}</p>
					<hr />
				</li>
				{#each chatContent.messages as message}
					<ChatContent messages={message} />
				{/each}
			{/each}
		{/if}
	</ul>
	<ChatInput {onSubmit} />
</section>

<style>
	section {
		flex: 1 1 0%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		overflow-y: scroll;
		margin-bottom: 16px;
	}
	.date {
		display: flex;
		align-items: center;
	}
	.date hr {
		width: 100%;
		height: 1px;
		background-color: #e0e0e0;
	}
	.date-text {
		font-size: 12px;
		color: #666;
		margin: 0 10px;
		width: fit-content;
		white-space: nowrap;
	}
	.no-chat {
		margin: auto;
	}
</style>
