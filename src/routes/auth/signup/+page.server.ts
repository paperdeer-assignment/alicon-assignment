import { PrismaClient } from '@prisma/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const actions = {
	default: async ({ request, url, cookies }) => {
		const redirectUrl = url.searchParams.get('redirectUrl') || '/chat';

		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const position = formData.get('position')?.toString();

		if (!name || !email || !password || !position) {
			return fail(400, {
				name,
				email,
				password,
				error: '모든 필드를 입력해주세요.'
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (user) {
			return fail(400, {
				email,
				error: '이미 존재하는 이메일입니다.'
			});
		}

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password,
				profileImage: '',
				position
			}
		});

		cookies.set('userId', newUser.id.toString(), {
			path: '/'
		});

		if (newUser) redirect(302, redirectUrl);
	}
} satisfies Actions;
