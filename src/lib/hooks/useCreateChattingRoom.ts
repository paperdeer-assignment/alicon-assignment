import { goto, invalidate } from '$app/navigation';
import { connectWebSocket } from '$lib/utils/socket';
import { onMount } from 'svelte';

export const useCreateChattingRoom = () => {
	let ws: WebSocket;

	onMount(() => {
		ws = connectWebSocket();
	});

	const createChattingRoom = async (otherUserId: number, message: string) => {
		const data = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({
				otherUserId,
				message
			})
		});

		const { roomId, message: createdMessage } = await data.json();

		await invalidate('chatting:room-list');
		await goto(`/chat/${roomId}`);
		ws.send(JSON.stringify({ type: 'sync-messages', roomId, createdMessage }));
	};

	return { createChattingRoom };
};
