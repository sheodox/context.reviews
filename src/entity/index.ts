import "reflect-metadata";
import {Connection, createConnection} from "typeorm/index";
import {User} from "./User";
import {Phrase} from "./Phrase";
import {phrasesTotal, usersTotal} from "../metrics";
import {databaseLogger} from "../util/logger";

const entities = [
    User,
    Phrase
];

export const connection: Promise<Connection> = new Promise((resolve, reject) => {
    createConnection({
        type: 'postgres',
        name: 'context.reviews',
        host: process.env.PGHOST,
        port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        logging: process.env.NODE_ENV === 'development' ?
            ['query', 'error'] : ['error'],
        entities
    }).then(async connection => {
        databaseLogger.info('Database connection established');
        const userRepository = connection.getRepository(User),
            phraseRepository = connection.getRepository(Phrase);

        //seed some metrics with database counts
        usersTotal.inc(await userRepository.count());
        phrasesTotal.inc(await phraseRepository.count());

        resolve(connection);
    }).catch(error => {
        databaseLogger.error('Error connecting to database!', {
            error
        });
        reject(error);
    });
});
