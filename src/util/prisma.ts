import {PrismaClient} from '@prisma/client';
import {phrasesActive, phrasesTotal, usersTotal} from "../metrics";

export const prisma = new PrismaClient();

async function seedMetrics() {
    phrasesActive.set(await prisma.phrase.count({
        where: {
            deleted: false
        }
    }));
    phrasesTotal.inc(await prisma.phrase.count());
    usersTotal.inc(await prisma.user.count());
}
seedMetrics();