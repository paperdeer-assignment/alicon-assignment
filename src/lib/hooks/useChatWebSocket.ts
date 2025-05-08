import { invalidate } from '$app/navigation';
import { userStore } from '$lib/store/user';
import type { Message } from '$lib/types/chat';
import { connectWebSocket } from '$lib/utils/socket';
import { onMount } from 'svelte';
import { get, writable } from 'svelte/store';

interface UseChatWebSocketProps {
	roomId: string;
	updateLocalMessages: (message: Message) => void;
}

export const useChatWebSocket = ({ roomId, updateLocalMessages }: UseChatWebSocketProps) => {
	let ws: WebSocket;
	const user = get(userStore);
	const roomIdStoreRef = writable(roomId);

	onMount(() => {
		ws = connectWebSocket();

		ws.onmessage = async (event) => {
			const { message, type } = JSON.parse(event.data);
			if (type !== 'new-message') return;

			await invalidate('chatting:room-list');
			if (message.roomId !== get(roomIdStoreRef)) return;
			updateLocalMessages?.({
				id: message.id,
				userName: message.sender.name,
				userId: message.sender.id,
				content: message.content,
				postedAt: new Date(message.createdAt),
				isMine: message.sender.id === user.id
			});
		};

		return () => ws.close();
	});

	const sendMessage = (content: string) => {
		ws.send(
			JSON.stringify({
				type: 'send-message',
				roomId: get(roomIdStoreRef),
				senderId: user.id,
				content
			})
		);
	};

	const setRoomId = (id: string) => {
		roomIdStoreRef.set(id);
	};

	return { sendMessage, setRoomId };
};
