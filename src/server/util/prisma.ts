import pma from '@prisma/client';
import { phrasesActive, phrasesTotal, usersTotal } from '../metrics.js';

export const prisma = new pma.PrismaClient();

async function seedMetrics() {
	phrasesActive.set(
		await prisma.phrase.count({
			where: {
				deleted: false,
			},
		})
	);
	phrasesTotal.inc(await prisma.phrase.count());
	usersTotal.inc(await prisma.user.count());
}
seedMetrics();
