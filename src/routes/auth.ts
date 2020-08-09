import passport from 'passport';
import {Router} from 'express';
import {User} from '../entity/User';
import {OAuth2Strategy} from 'passport-google-oauth';
import {connection} from '../entity';
const router = Router();

async function getUserRepository() {
	return (await connection).getRepository(User);
}

passport.use(new OAuth2Strategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK,
	},
	async (accessToken, refreshToken, profile, done) => {
		const userRepository = await getUserRepository();
		const oauthId = `google-${profile.id}`,
			user = (await userRepository.findOne({
				oauthId
			})) || new User();

		console.log('logged in user: ', user);

		//always update the user when they log in, just in case we end up using their name/profile picture
		//and they changed it on their account, we don't want to show an old name or picture.
		user.displayName = profile.displayName;
		user.profileImage = profile.photos[0].value;
		user.oauthProvider = 'google';
		//an externally unique ID to match this user to a row
		user.oauthId = oauthId;
		user.raw = JSON.stringify(profile)

		await userRepository.save(user);
		done(null, user);
	}
));

passport.serializeUser(function(user: User, done) {
	done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
	const userRepository = await getUserRepository();
	const user = await userRepository.findOne(id);
	user ? done(null, user) : done(new Error('user not found'));
});

router.get('/google', (req, res, next) => {
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login']
	})(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/'
	})(req, res, next);
});
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

export default router;
