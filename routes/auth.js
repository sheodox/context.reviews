const passport = require('passport'),
	router = require('express').Router(),
	User = require('../util/user'),
	OAuth2Strategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new OAuth2Strategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET
	},
	async (accessToken, refreshToken, profile, done) => {
		const user = new User(profile);
		await user.save();
		done(null, user);
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

router.get('/google', (req, res, next) => {
	passport.authenticate('google', {
		callbackURL: process.env.GOOGLE_CALLBACK,
		scope: ['https://www.googleapis.com/auth/plus.login']
	})(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
	passport.authenticate('google', {
		callbackURL: process.env.GOOGLE_CALLBACK,
		successRedirect: '/',
		failureRedirect: '/'
	})(req, res, next);
});
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;

