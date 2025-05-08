import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { GetChattingRoomListResponse } from './type';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, cookies }) => {
	const userId = cookies.get('userId');

	const body = await request.json();
	const { otherUserId, message } = body;

	const { roomId, createdMessage } = await prisma.$transaction(async (tx) => {
		// 새로운 채팅방 생성
		const chattingRoom = await tx.chattingRoom.create({
			data: {}
		});

		// 채팅방 유저 생성
		const chattingRoomUser1 = await tx.chattingRoomUser.create({
			data: {
				userId: Number(userId),
				roomId: chattingRoom.id
			}
		});
		const chattingRoomUser2 = await tx.chattingRoomUser.create({
			data: {
				userId: Number(otherUserId),
				roomId: chattingRoom.id
			}
		});

		// 채팅방 <-> 채팅방 유저 연결
		await tx.chattingRoom.update({
			where: { id: chattingRoom.id },
			data: {
				chattingRoomUsers: {
					connect: [
						{
							id: chattingRoomUser1.id
						},
						{ id: chattingRoomUser2.id }
					]
				}
			}
		});

		// 채팅방 메시지 생성
		const createdMessage = await tx.message.create({
			data: {
				content: message as string,
				senderId: Number(userId),
				roomId: chattingRoom.id
			}
		});

		return { roomId: chattingRoom.id, createdMessage };
	});

	return json({ success: true, roomId, message: createdMessage });
};

export const GET: RequestHandler = async ({ url, cookies }) => {
	const userId = cookies.get('userId');

	const searchQuery = url.searchParams.get('searchQuery');

	const rooms = await prisma.chattingRoom.findMany({
		where: {
			chattingRoomUsers: {
				some: {
					userId: Number(userId)
				}
			},
			messages: {
				some: {
					content: {
						contains: searchQuery as string
					}
				}
			}
		}
	});

	const response: GetChattingRoomListResponse = {
		rooms
	};

	return json(response);
};
