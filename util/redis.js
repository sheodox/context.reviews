const {promisify} = require('util'),
	redisModule = require('redis'),
	redisClient = redisModule.createClient({
		host: 'redis'
	}),
	redis = {};

//node-redis doesn't natively support a promise API
['get', 'set'].forEach(method => redis[method] = promisify(redisClient[method]).bind(redisClient));

module.exports = {
	//should use this for async/await
	redis,
	//used for connect-redis for session storage
	redisClient
};
