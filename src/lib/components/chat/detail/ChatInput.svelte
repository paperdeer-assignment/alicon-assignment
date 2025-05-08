<script lang="ts">
	let { onSubmit }: { onSubmit: (event: SubmitEvent) => void } = $props();
</script>

<form onsubmit={onSubmit}>
	<textarea name="chat-input" placeholder="내용 작성해 주세요."></textarea>
	<div class="chat-input-container">
		<button type="submit">보내기</button>
	</div>
</form>

<style>
	form {
		width: 100%;
		margin-top: auto;
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
	}
	textarea {
		width: 100%;
		height: 100px;
		resize: none;
		display: inline-block;
		padding: 12px;
	}
	.chat-input-container {
		display: flex;
		padding: 8px;
		background-color: #f0f0f0;
		border-top: 1px solid #ccc;
	}
	button {
		margin-left: auto;
		padding: 8px 12px;
		border-radius: 20px;
		background-color: blue;
		color: white;
	}
</style>
