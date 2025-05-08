import type { ChattingRoom } from '$lib/types/chat';
import { PrismaClient } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: LayoutServerLoad = async ({ params, depends, cookies, url }) => {
	depends('chatting:room-list');
	const userId = cookies.get('userId');
	const roomId = params.roomId ?? null;

	if (!userId) throw redirect(302, `/auth/login?redirectUrl=${url.pathname}`);

	const userInfo = await prisma.user.findUnique({
		where: {
			id: parseInt(userId)
		}
	});

	if (!userInfo) throw redirect(302, `/auth/login?redirectUrl=${url.pathname}`);

	const roomList = await prisma.chattingRoom.findMany({
		where: {
			chattingRoomUsers: {
				some: {
					userId: userInfo.id
				}
			}
		},
		include: {
			chattingRoomUsers: {
				include: {
					user: true
				}
			},
			messages: {
				include: {
					sender: true
				}
			}
		}
	});

	const rooms: ChattingRoom[] = roomList
		.map((room) => {
			const otherUsers = room.chattingRoomUsers.filter((user) => user.userId !== userInfo.id);
			const lastReadMessageId =
				room.chattingRoomUsers.find((user) => user.userId === userInfo.id)?.lastReadMessageId || 0;

			const lastMessage = room.messages[room.messages.length - 1];
			const isMine = lastMessage?.senderId === userInfo.id;

			const isCurrentRoom = room.id === roomId;

			const unreadMessageCount = room.messages.filter(
				(message) => message.id > lastReadMessageId && message.senderId !== userInfo.id
			).length;

			return {
				id: room.id,
				userName: otherUsers[0].user.name,
				profileImage: otherUsers[0].user.profileImage,
				lastMessage: lastMessage
					? {
							id: lastMessage.id,
							content: lastMessage.content,
							postedAt: lastMessage.createdAt,
							userName: isMine ? '나' : lastMessage.sender.name,
							userId: lastMessage.senderId,
							isMine
						}
					: null,
				unreadMessageCount: isCurrentRoom ? 0 : unreadMessageCount
			};
		})
		.sort(
			(a, b) => (b.lastMessage?.postedAt.getTime() ?? 0) - (a.lastMessage?.postedAt.getTime() ?? 0)
		);

	return {
		roomId,
		rooms,
		userInfo
	};
};
