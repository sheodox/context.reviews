import "reflect-metadata";
import {Connection, createConnection} from "typeorm/index";
import {User} from "./User";
import {Phrase} from "./Phrase";

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
        console.log('Database connection established');
        resolve(connection);
    }).catch(error => {
        console.log(error)
        reject(error);
    });
});
