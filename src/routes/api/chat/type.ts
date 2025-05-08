import type { ChattingRoomId } from '$lib/types/chat';
import type { Message } from '.prisma/client';

export interface CreateChattingRoomResponse {
	roomId: string;
	message: Message;
}

export interface GetChattingRoomListResponse {
	rooms: Array<{ id: ChattingRoomId }>;
}
