import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { handler } from '../../../build/handler.js';
import express from 'express';

const prisma = new PrismaClient();

const app = express();
app.use(handler);

const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;

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

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
