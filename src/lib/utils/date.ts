export const displayHourFormat = (date: Date) => {
	const hour = date.getHours();
	const minute = date.getMinutes();
	const minuteString = minute.toString().padStart(2, '0');

	const isAM = hour < 12;
	const displayHour = hour % 12 === 0 ? 12 : hour % 12;
	return `${isAM ? '오전' : '오후'} ${displayHour}:${minuteString}`;
};

/**
 * 채팅 메시지 표시 시간 포맷팅
 * @param date - 포맷팅할 날짜
 * @returns 오늘이면 '오전 nn:mm', 아니면 '2025.5.3' 형식으로 반환
 */
export function formatChatDisplayTime(date: Date): string {
	const now = new Date();
	const isToday = date.toDateString() === now.toDateString();

	if (isToday) {
		return displayHourFormat(date);
	} else {
		return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
	}
}
