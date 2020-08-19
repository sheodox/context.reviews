import fs from 'fs';
import {promisify} from "util";
import {Router} from 'express';
import {connection as getConnection} from "../entity";
import {Phrase} from '../entity/Phrase';
import {User} from '../entity/User';

const router = Router(),
    mkdir = promisify(fs.mkdir),
    writeFile = promisify(fs.writeFile);

async function getUsageStats() {
    const connection = await getConnection,
        phraseRepository = connection.getRepository(Phrase),
        userRepository = connection.getRepository(User)

    return {
        time: Date.now(),
        phrases: {
            total: await phraseRepository.count(),
            active: await phraseRepository.count({deleted: false})
        },
        users: {
            total: await userRepository.count()
        }
    }
}

//only allow usage stats to be reported in dev, the queries aren't very efficient and is meant to be run on a cron in prod
if (process.env.NODE_ENV === 'development') {
    router.get('/usage', async (req, res) => {
        res.json(
            await getUsageStats()
        );
    });
}

const DAY_MS = 24 * 60 * 60 * 1000;
function msUntilTomorrow() {
    const d = new Date(
        Date.now() + DAY_MS
    );
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d.getTime() - Date.now();
}

//schedule collection of stats every day at midnight
function scheduleStatsExport() {
    setTimeout(async () => {
        await makeExportDirectories();
        const stats = await getUsageStats(),
            filePath = `./stats/usage/${stats.time}.json`

        await writeFile(
            filePath,
            JSON.stringify(stats)
        );

        scheduleStatsExport();
    }, msUntilTomorrow());
}
scheduleStatsExport();

async function makeExportDirectories() {
    const directories = ['./stats', './stats/usage'];
    for (const dir of directories) {
        try {
            await mkdir(dir);
        }
        catch(e) {
            //ignore errors, they'll most likely just happen because the directories already exist, that's intended
        }
    }
}

export default router;