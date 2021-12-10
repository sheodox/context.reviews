import { promisify } from 'util';
import { createClient } from 'redis';

export const redisClient = createClient({
	host: 'redis',
});

//node-redis doesn't use a promise API, for this app's usages we want one
export const redis = {
	get: promisify(redisClient.get).bind(redisClient),
	set: promisify(redisClient.set).bind(redisClient),
	expire: promisify(redisClient.expire).bind(redisClient),
};
