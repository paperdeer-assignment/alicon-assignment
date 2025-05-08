import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';
import type { GetUserListResponse } from './type';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url, cookies }) => {
	const email = url.searchParams.get('email');
	const userId = cookies.get('userId');

	const users: GetUserListResponse = await prisma.user.findMany({
		where: {
			email: {
				contains: email as string
			}
		}
	});

	return json(users.filter((user) => user.id !== Number(userId)));
};
