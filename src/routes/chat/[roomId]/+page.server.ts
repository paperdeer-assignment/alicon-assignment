import type { ChattingRoomDetail } from '$lib/types/chat';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params, cookies }) => {
	const roomId = params.roomId;
	const userId = cookies.get('userId');

	const myId = Number(userId);

	const chatRoom = await prisma.chattingRoom.findUnique({
		where: {
			id: roomId
		},
		include: {
			chattingRoomUsers: {
				include: {
					user: true
				}
			}
		}
	});

	if (!chatRoom?.chattingRoomUsers.some((chattingRoomUser) => chattingRoomUser.userId === myId)) {
		throw redirect(302, '/chat');
	}

	const chatList = await prisma.message.findMany({
		where: {
			roomId: roomId
		},
		include: {
			sender: true
		}
	});

	const conversationPartner = chatRoom?.chattingRoomUsers.filter((user) => user.userId !== myId)[0]
		.user;

	const messageHistory: ChattingRoomDetail = {
		id: roomId,
		userName: conversationPartner?.name || '',
		userPosition: conversationPartner?.position || '',
		profileImage: conversationPartner?.profileImage || '',
		messages: chatList
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			.map((message) => ({
				id: message.id,
				content: message.content,
				postedAt: message.createdAt,
				userId: message.senderId,
				userName: message.sender.name,
				isMine: message.senderId === myId
			})),
		lastReadMessageId: 1,
		unreadMessageCount: 1,
		tag: '친구'
	};

	return { room: messageHistory };
};
