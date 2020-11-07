import passport from 'passport';
import {Router} from 'express';
import {User} from '../entity/User';
import {OAuth2Strategy} from 'passport-google-oauth';
import {connection} from '../entity';
import {usersLoggedIn, usersNew, usersTotal} from "../metrics";
import {authLogger} from "../util/logger";
import {getSettingsDefaults} from "../entity/Settings";
const router = Router();

async function getUserRepository() {
	return (await connection).getRepository(User);
}

async function getUser(oauthId: string, displayName: string) {
	const userRepository = await getUserRepository(),
		existingUser = (await userRepository.findOne({
			oauthId
		}));

	if (!existingUser) {
		usersNew.inc();
		usersTotal.inc();
		authLogger.info(`New user "${displayName}"`);
		return new User();
	}
	return existingUser;
}

passport.use(new OAuth2Strategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK,
	},
	async (accessToken, refreshToken, profile, done) => {
		const userRepository = await getUserRepository();
		const oauthId = `google-${profile.id}`,
			user = await getUser(oauthId, profile.displayName);

		//always update the user when they log in, just in case we end up using their name/profile picture
		//and they changed it on their account, we don't want to show an old name or picture.
		user.displayName = profile.displayName;
		user.profileImage = profile.photos[0].value;
		user.oauthProvider = 'google';
		//an externally unique ID to match this user to a row
		user.oauthId = oauthId;
		user.raw = JSON.stringify(profile)

		authLogger.info(`User logged in "${user.displayName}"`);
		await userRepository.save(user);
		done(null, user);
	}
));

passport.serializeUser(function(user: User, done) {
	done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
	const userRepository = await getUserRepository();
	const user = await userRepository.findOne(id, {
		relations: ['settings']
	});

	if (!user.settings) {
		user.settings = getSettingsDefaults();
		user.settings.user = user;
	}

	user ? done(null, user) : done(new Error('user not found'));
});

router.get('/google', (req, res, next) => {
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login']
	})(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
	usersLoggedIn.inc();
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
