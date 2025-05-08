import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url, cookies }) => {
	const email = url.searchParams.get('email');
	const userId = cookies.get('userId');

	const users = await prisma.user.findMany({
		where: {
			email: {
				contains: email as string
			}
		}
	});

	return new Response(JSON.stringify(users.filter((user) => user.id !== Number(userId))));
};
