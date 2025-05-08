import type { PageServerLoad } from './auth/login/$types';
import { redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ cookies }) => {
	const userId = cookies.get('userId');

	if (!userId) {
		throw redirect(302, '/auth/login');
	}

	const user = await prisma.user.findUnique({
		where: {
			id: Number(userId)
		}
	});

	if (!user) {
		throw redirect(302, '/auth/login');
	}

	throw redirect(302, '/chat');
};
