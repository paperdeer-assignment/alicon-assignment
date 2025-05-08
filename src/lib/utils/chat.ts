import type { Message, MessageGroup, MessagePostedDate } from '$lib/types/chat';

const getIsEqualDate = (date1: Date, date2: Date): boolean => {
	return date1.toDateString() === date2.toDateString();
};

type MessageGroupByDay = Record<MessagePostedDate, MessageGroup[]>;

const mergeConsecutiveMessages = (messages: Message[]) => {
	const mergedMessages: MessageGroupByDay = {};

	let tempMessages: Message[] = [];

	for (let i = 0; i < messages.length; i++) {
		const currentMessage = messages[i];
		const nextMessage = messages[i + 1];

		tempMessages.push(currentMessage);
		if (!nextMessage) break;

		const toDayString = currentMessage.postedAt.toDateString();

		const isSameDay = getIsEqualDate(currentMessage.postedAt, nextMessage.postedAt);

		if (!isSameDay) {
			mergedMessages[toDayString] = mergedMessages[toDayString] || [];
			mergedMessages[toDayString].push({
				userName: currentMessage.userName,
				userId: currentMessage.userId,
				profileImage: currentMessage.profileImage,
				messages: tempMessages,
				lastMessagePostedAt: currentMessage.postedAt
			});

			tempMessages = [];
			continue;
		}

		if (currentMessage.userId === nextMessage.userId) {
			continue;
		}

		mergedMessages[toDayString] = mergedMessages[toDayString] || [];
		mergedMessages[toDayString].push({
			userName: currentMessage.userName,
			userId: currentMessage.userId,
			profileImage: currentMessage.profileImage,
			messages: tempMessages,
			lastMessagePostedAt: currentMessage.postedAt
		});

		tempMessages = [];
	}

	if (tempMessages.length > 0) {
		const toDayString = tempMessages[0].postedAt.toDateString();
		mergedMessages[toDayString] = mergedMessages[toDayString] || [];
		mergedMessages[toDayString].push({
			userName: tempMessages[0].userName,
			userId: tempMessages[0].userId,
			profileImage: tempMessages[0].profileImage,
			messages: tempMessages,
			lastMessagePostedAt: tempMessages[tempMessages.length - 1].postedAt
		});
		tempMessages = [];
	}

	return mergedMessages;
};

export const getGroupedMessages = (
	messages: Message[]
): {
	messagesGroupByDate: {
		date: string;
		messages: MessageGroup[];
	}[];
	lastMessageId: number;
} => {
	const allMessages = [...messages];
	const groupedMessage = mergeConsecutiveMessages(allMessages);

	const groupedByDate = Object.entries(groupedMessage).map(
		([key, value]) =>
			[
				{
					date: key,
					messages: value
				}
			][0]
	);

	return {
		messagesGroupByDate: groupedByDate,
		lastMessageId: allMessages[allMessages.length - 1].id
	};
};

export const linkify = (text: string) => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(
		urlRegex,
		(url) =>
			`<a style="color: blue; text-decoration: underline; display: inline-block;" href="${url}" target="_blank">${url}</a>`
	);
};
