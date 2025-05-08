<script lang="ts">
	import type { User } from '@prisma/client';
	import type { GetUserListResponse } from '../../../../routes/api/user/type';

	let { onSelectUser }: { onSelectUser: (user: User) => void } = $props();

	let users = $state<GetUserListResponse>([]);

	const onSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const userEmail = (event.target as HTMLFormElement).userEmail.value;

		const res = await fetch('/api/user?email=' + userEmail);
		const data: GetUserListResponse = await res.json();

		users = data;
	};
</script>

<section>
	<form class="input-container" onsubmit={onSubmit}>
		<input type="text" placeholder="대화할 사용자 이메일을 입력하세요" name="userEmail" />
		<button type="submit">검색</button>
	</form>

	<ul>
		{#each users as user}
			<li>
				<label class="user-item">
					<p>
						{user.name}
					</p>
					<p>{user.email}</p>
					<button type="button" onclick={() => onSelectUser(user)}>선택</button>
				</label>
			</li>
		{/each}
	</ul>
</section>

<style>
	section {
		width: 400px;
	}

	.input-container {
		height: 40px;
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
	}

	input {
		flex: 1;
		height: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	button {
		height: 100%;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 0 12px;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 10px;
	}

	.user-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		height: 40px;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 0 12px;
		background-color: white;
	}

	.user-item button {
		margin-left: auto;
		background-color: transparent;
		border: none;
		padding: 0;
	}
</style>
