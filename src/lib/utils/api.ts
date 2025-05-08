export const updateLastReadMessageId = async (roomId: string, messageId: number) => {
	await fetch(`/api/chat/last-read-message`, {
		method: 'POST',
		body: JSON.stringify({
			roomId,
			lastReadMessageId: messageId
		})
	});
};
