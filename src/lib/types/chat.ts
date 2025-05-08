export type ChattingRoomId = string;

export type MessageId = number;

export type UserId = number;

export type ChattingRoom = {
	id: ChattingRoomId;
	userName: string;
	profileImage?: string;
	lastMessage: Message | null;
	unreadMessageCount: number;
};

export type ChattingRoomDetail = Omit<ChattingRoom, 'lastMessage'> & {
	tag: string;
	userPosition: string;
	messages: Message[];
	lastReadMessageId: MessageId;
};

export type Message = {
	id: MessageId;
	userName: string;
	userId: UserId;
	profileImage?: string;
	content: string;
	postedAt: Date;
	isMine: boolean;
};

export type MessagePostedDate = string;

export type MessageGroup = {
	userName: string;
	userId: UserId;
	profileImage?: string;
	messages: Message[];
	lastMessagePostedAt: Date;
};
