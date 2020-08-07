import {Pool} from 'pg';
const pool = new Pool();

export const query = (query: string, args: any[]) => {
	return pool.query(query, args);
}