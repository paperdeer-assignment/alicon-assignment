## 프로젝트 개요

### 요구사항 구현 리스트

- ✅ 1:1 대화를 주고 받는 웹 어플리케이션을 작성해주시길 바랍니다.
- ✅ 대화 상대별로 대화방이 나뉘어 있으며, 각 대화방끼리 이동할 수 있어야 합니다.
- ✅ 메시지를 전송하고 서로 이 내용을 확인할 수 있어야 합니다.
- ✅ 대화는 서버에 저장되어 언제든 확인할 수 있어야 합니다.
- ✅ SvelteKit으로 작성 바랍니다.

### Optional

- ~~Responsive를 지원합니다.~~
- ✅ 로그인, 로그아웃을 할 수 있습니다.
- ✅ 비 로그인 사용자 접속 시 로그인을 유도 합니다.
- ✅ 새 메시지 버튼 클릭 후 새 대화방 생성 시 대화 상대 검색이 가능합니다.
- ✅ 대화에 URL이 있는 경우 Clickable하게(실제로 동작) 출력합니다.
- ✅ 읽지 않은 메시지가 있는 경우 화면상 표기를 다르게 합니다.
- ✅ 대화를 검색할 수 있습니다.
- ✅ Production 환경을 구축하여 동작 가능한 임의의 URL로 접속 할 수 있습니다.
  - 배포 URL : https://alicon-assignment-production.up.railway.app/
  - 다만, 저렴한 요금제를 사용하고 호스팅 지역이 싱가포르로 선택되어 있어서 속도가 매우 느립니다. 참고 부탁드리겠습니다. 페이지 이동/채팅 전송 등의 이벤트가 발생한 이후, 수초간의 딜레이가 발생할 수 있습니다.
  - sveltekit + websocket 서버는 로컬에서 실행, 배포되어있는 데이테베이스 연결하는 방식을 권장드립니다.
  - 추가적인 배포 관련한 고민/설명은 아래 작성해두었습니다.

### 기술 스택

- sveltekit
- typescript
  - 정적 타이핑을 통해 코드의 안정성과 유지보수성을 높이기 위해 사용하였습니다.
- prisma
  - 타입 안전성과 자동 완성 기능을 제공해주는 ORM으로, typescript와 호환이 잘되어 사용하였습니다.
- ws
  - 실시간 채팅을 구현하기 위해 사용하였습니다.
- prettier
  - 코드 스타일의 일관성 유지를 위해 사용하였습니다.
- eslint
  - 일관된 코드 스타일과 잠재적인 오류를 사전에 감지하기 위해 사용하였습니다.

### 배포

- postgresql 배포와 sveltekiut 프로젝트 배포를 지원하는 호스팅 서비스 [railway](https://railway.com/)를 사용하였습니다.
- 다른 호스팅 서비스도 있었지만, websocket 서버를 배포하기 위해서는 serverless가 아닌 호스팅 서비스를 선택해야해서 railway를 선택하였습니다.
- 저렴한 요금제를 사용하고, 호스팅 지역이 싱가포르(한국 지원 X)로 설정되어있어 서비스 속도가 느립니다.
- 실제 사용자에게 서비스를 제공해야한다면 railway가 아닌 다른 호스팅 서비스를 사용해야할 것 같습니다.
  - 한국 내에서 cdn 서비스를 제공하는 호스팅 서비스(ex. aws, vercel)

## 프로젝트 실행

### 1. 패키지 설치

```
yarn install
```

### 2. 데이터베이스 생성 & 연결

sveltekit 프로젝트 로컬로 실행 + 배포된 데이터베이스 사용을 원하신다면, .env 파일에 해당 주소를 입력해주시기 바라겠습니다.

```
postgresql://postgres:ZPDQjGJqbvVRidufIUWypXldKPkWNnqS@switchback.proxy.rlwy.net:33338/railway
```

2-1 postgresql 설치

2-2 postgresql 실행

2-3 DB 생성

```
createdb -U {사용자명} {db명}
```

2-4 DB 경로 .env 파일에 추가

```
DATABASE_URL=생성한 DB 경로
```

2-5 prisma 스키마에 맞추어 테이블 생성

```
yarn prisma db push
```

2-6 prisma 스키마 기반 타입, prisma client 생성

```
yarn prisma generate
```

### 3. 프로젝트 실행

3-1 web socket 서버 실행

```
yarn start:ws
```

3-2 프로젝트 실행

```
yarn dev
```

3-3 (선택) prisma studio 실행 (데이터 조작을 위해)

```
yarn prisma studio
```

### 4. 구현 확인

4-1 회원가입/로그인 (최소 2개 계정 필요)

고민한 부분

- 회원가입/로그인 시, 로그인한 유저의 userId값을 cookie에 저장합니다. (서버에서도 접근할 수 있도록)
- 간단한 처리를 위해 로그인 유저 정보를 JWT 등의 방식으로 저장하기보다는 userId 값만을 저장하는 방식을 선택하였습니다.
- 로그인한 유저 정보는 routes/chat/+layout.server.ts 파일에서 인증을 완료한 후, routes/chat/+layout.svelte에서 유저 정보를 스토어에 등록하여 전역으로 관리합니다.

  ```ts
  const userStore = writable<{
  	id: number | null;
  	name: string;
  	profileImage: string;
  }>({
  	id: null,
  	name: '',
  	profileImage: ''
  });
  ```

4-2 채팅방 생성 (동일 유저와 여러개 채팅방 생성 가능)

시나리오

- /chat 경로로 접속
- 빈칸으로 검색 또는 이메일 검색
- 원하는 상대 선택
- 채팅 작성
- 보내기 버튼 클릭

고민한 부분

- 채팅방 생성 이후 상대방에게 새로운 채팅방이 생성되었음을 알리기 위한 소켓 메세지를 전송합니다.
  ```ts
  // lib/hooks/useCreateChattingRoom.ts
  ws.send(JSON.stringify({ type: 'sync-messages', roomId, createdMessage }));
  ```
- 기존 채팅방에서 채팅 전송시 사용하는 소켓 메세지의 경우, 새로운 메세지를 생성한다는 제약이 있어 새로운 타입을 추가하였습니다.

  ```ts
  // 기존 채팅방에서 사용하는 소켓 메세지 형태
  ws.send(
  	JSON.stringify({
  		type: 'send-message',
  		roomId: get(roomIdStoreRef),
  		senderId: user.id,
  		content
  	})
  );
  ```

- 채팅방 생성시 chattingRoom과 chattingRoomUsers만 생성한 이후, 기존 타입(send-message)를 활용하여 새로운 채팅방에 메세지를 전송하는 방식으로 우회할 수도 있지만
- 채팅방 생성이라는 행위 자체는 chattingRoom, chattingRoomUser 생성 후 해당 chattingRoom에 message를 추가하는 것까지가 하나의 묶음(트랜젝션)이라고 생각하여 새로운 타입을 추가하는 방향으로 진행하였습니다.

4-3 1:1 채팅

시나리오

- 채팅방 진입
- 채팅 인풋에 메세지 입력
- 보내기 버튼 클릭

고민한 부분

- 실시간 채팅을 지원하기 위해 웹소켓을 사용하여 구현하였습니다. (과제 기한이 1주일이었다면, polling 방식을 사용했을 것 같습니다.)
- 채팅 내용은 페이지 접속시 서버에서 받아오고, 이후 추가된 메세지의 경우 컴포넌트에서 클라이언트 상태로 관리합니다.
- 혹시 모를 서버 값 <-> 클라이언트 상태 값의 불일치를 처리하기 위해, 페이지 변경시마다 서버에서 값을 받아와 동기화합니다.
- 만약 추가적인 조치가 필요하다면 일정 주기로 값을 동기화하는 로직을 추가해야할 것 같습니다.

  ```ts
  let localMessages = $state<Message[]>([]);
  const { sendMessage, setRoomId } = useChatWebSocket({
  	roomId,
  	// 내가 전송한 메세지, 상대가 전송한 메세지를 localMessages에 추가하는 함수
  	updateLocalMessages: (message) => localMessages.push(message)
  });
  ```

- 다만, 채팅방 리스트의 경우 새로운 메세지가 추가될때마다 invalidate를 통해 서버에서 값을 받아오도록 처리하고 있습니다.
- 채팅방 리스트까지 클라이언트 상태로 관리할까 하였으나, 그렇게 되면 관리하기 너무 복잡해질것 같아 보류하였습니다.

4-4 대화에 URL이 있는 경우 Clickable하게 출력

- 채팅 인풋에 https://naver.com 등 작성 후 전송
- 채팅창에 푸른 글씨로 표시된 문자열 클릭
- 해당 url 창 오픈

- 구현 방식

  ```ts
  export const linkify = (text: string) => {
  	const urlRegex = /(https?:\/\/[^\s]+)/g;
  	return text.replace(
  		urlRegex,
  		(url) =>
  			`<a style="color: blue; text-decoration: underline; display: inline-block;" href="${url}" target="_blank">${url}</a>`
  	);
  };
  ```

  정규식을 사용하여 url을 a 태그로 감싸도록 변경하고, @html template syntax 사용하여 컴포넌트 내에 노출하도록 하였습니다.

4-5 읽지 않은 메시지가 있는 경우 화면상 표기를 다르게 처리

시나리오

- B 계정에서 A에게 메세지 전송
- A 계정으로 /chat 경로, 혹은 다른 채팅방으로 접속
- A가 보낸 채팅방 아이템의 배경색을 다르게 표시 + 읽지 않은 메세지 개수 표기

고민한 부분

- 각 채팅방에서 각 유저가 마지막으로 읽은 메세지를 쉽게 관리하기 위해, user 테이블과 chattingRoom 테이블의 중간 테이블인 chattingRoomUser 테이블을 두었습니다.
- chattingRoomUser 테이블은 연결된 유저, 연결된 채팅방, 마지막으로 읽은 메세지 Id 값을 포함하고 있습니다.
- 해당 중간 테이블으로 인해 추후 그룹 채팅을 구현할때도 큰 수정이 필요 없을 것으로 기대됩니다.

4-6 채팅 검색

시나리오

- 채팅방 리스트 사이드바 내 '대화 검색하기' 인풋에 키워드 입력 + 엔터

4-7 로그아웃

시나리오

- 채팅방 목록 하단 로그아웃 버튼 클릭
- cookie에 저장되어있던 userId 값 제거
- userStore에 저장해둔 값 제거
- 로그인 페이지로 이동
- invalidateAll을 통해 모든 값 최신화
