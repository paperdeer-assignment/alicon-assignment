<h1>회원가입</h1>

<form method="post">
	<input type="text" name="name" placeholder="이름을 입력해주세요" />
	<input type="text" name="position" placeholder="직무를 입력해주세요" />
	<input type="email" name="email" placeholder="이메일을 입력해주세요" />
	<input type="password" name="password" placeholder="비밀번호를 입력해주세요" />
	<button type="submit">회원가입</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 16px;
	}
	input {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #000;
		color: #fff;
	}
</style>
