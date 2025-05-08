<h1>로그인</h1>

<form method="post">
	<input type="email" name="email" placeholder="이메일을 입력해주세요" />
	<input type="password" name="password" placeholder="비밀번호를 입력해주세요" />
	<button type="submit">로그인</button>
	<a href="/auth/signup">회원가입</a>
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
	a {
		display: block;
		margin: 0 auto;
	}
</style>
