import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../chat/$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const redirectUrl = url.searchParams.get('redirectUrl') || '/chat';
	const userId = cookies.get('userId');

	if (!userId) {
		return;
	}

	const userInfo = await prisma.user.findUnique({
		where: {
			id: parseInt(userId)
		}
	});

	if (userInfo) {
		redirect(302, redirectUrl);
	}
};
