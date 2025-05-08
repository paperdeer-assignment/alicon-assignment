<script lang="ts">
	import ChatInput from '$lib/components/chat/detail/ChatInput.svelte';
	import InviteUser from '$lib/components/chat/create/InviteUser.svelte';
	import type { User } from '@prisma/client';
	import { useCreateChattingRoom } from '$lib/hooks/useCreateChattingRoom';

	let selectedUser = $state<User | null>(null);
	const { createChattingRoom } = useCreateChattingRoom();

	const onSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (!selectedUser) {
			alert('대화 상대를 선택해주세요');
			return;
		}

		const form = event.target as HTMLFormElement;
		const chatInput = form.elements.namedItem('chat-input') as HTMLTextAreaElement;
		createChattingRoom(selectedUser.id, chatInput.value);
	};

	const onSelectUser = (user: User) => {
		selectedUser = user;
	};
</script>

<main>
	<h1>대화 상대 선택</h1>
	{#if !selectedUser}
		<InviteUser {onSelectUser} />
	{:else}
		<div class="selected-user">
			<p>{selectedUser.name}</p>
			<p>{selectedUser.email}</p>
			<button class="delete-button" type="button" onclick={() => (selectedUser = null)}>삭제</button
			>
		</div>
	{/if}
	<ChatInput {onSubmit} />
</main>

<style>
	main {
		flex: 1 1 0%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		padding: 20px;
	}

	.selected-user {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
	}

	.delete-button {
		background-color: transparent;
		border: none;
	}
</style>
