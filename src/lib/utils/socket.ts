const getWebSocketUrl = () => {
	// 브라우저에서 실행 중일 때
	if (typeof window !== 'undefined') {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const host = window.location.host; // 도메인:포트

		if (import.meta.env.DEV) {
			return 'ws://localhost:8080';
		}

		return `${protocol}//${host}`;
	}

	// 서버사이드에서 실행 중일 때
	return '';
};

export function connectWebSocket() {
	const ws = new WebSocket(getWebSocketUrl());
	return ws;
}
