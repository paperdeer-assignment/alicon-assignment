import { PrismaClient } from '@prisma/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const redirectUrl = url.searchParams.get('redirectUrl') || '/chat';

		if (!email || !password) {
			return fail(400, {
				email,
				password,
				error: '이메일과 비밀번호를 입력해주세요'
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email,
				password: password
			}
		});

		if (!user) {
			return fail(400, {
				email,
				password,
				error: '이메일 또는 비밀번호가 일치하지 않습니다.'
			});
		}

		cookies.set('userId', user.id.toString(), {
			path: '/'
		});
		redirect(302, redirectUrl);
	}
} satisfies Actions;
