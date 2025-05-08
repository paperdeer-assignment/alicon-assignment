import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const myId = cookies.get('userId');
	const { roomId, lastReadMessageId } = body;

	await prisma.chattingRoomUser.update({
		where: {
			userId_roomId: { userId: Number(myId), roomId }
		},
		data: { lastReadMessageId: Number(lastReadMessageId) }
	});

	return json({ success: true });
};
