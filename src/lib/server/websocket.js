import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';

const prisma = new PrismaClient();
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
	ws.on('message', async (data) => {
		const { type } = JSON.parse(data.toString());
		if (type === 'send-message') {
			const { roomId, senderId, content } = JSON.parse(data.toString());
			const message = await prisma.message.create({
				data: {
					roomId,
					senderId,
					content
				},
				include: { sender: true }
			});

			wss.clients.forEach((client) => {
				if (client.readyState === ws.OPEN) {
					client.send(
						JSON.stringify({
							type: 'new-message',
							message: { ...message, roomId }
						})
					);
				}
			});
		}

		if (type === 'sync-messages') {
			const { roomId, message } = JSON.parse(data.toString());

			wss.clients.forEach((client) => {
				if (client.readyState === ws.OPEN) {
					client.send(JSON.stringify({ type: 'new-message', message: { ...message, roomId } }));
				}
			});
		}
	});
});
