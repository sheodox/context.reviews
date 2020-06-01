const {Pool} = require('pg'),
	pool = new Pool();

module.exports = {
	query(...args) {
		return pool.query(...args);
	}
}
