module.exports = {
	getUserId: (req) => {
		return req.user ? req.user.user_id : null;
	},
	requireAuth: (req, res, next) => {
		//all endpoints must be auth'd
		if (!req.isAuthenticated()) {
			res.status(401);
			res.send(null);
		}
		else {
			next();
		}
	}
}