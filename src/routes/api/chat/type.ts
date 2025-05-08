import type { ChattingRoomId } from '$lib/types/chat';

export interface GetChattingRoomListResponse {
	rooms: Array<{ id: ChattingRoomId }>;
}
