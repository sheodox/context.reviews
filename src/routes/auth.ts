import passport from 'passport';
import {Router} from 'express';
import {OAuth2Strategy} from 'passport-google-oauth';
import {usersLoggedIn, usersNew, usersTotal} from "../metrics";
import {authLogger} from "../util/logger";
import {prisma} from "../util/prisma";
import {User} from '@prisma/client';
import {getSettingsDefaults} from "../util/settings";

const router = Router();

passport.use(new OAuth2Strategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK,
	},
	async (accessToken, refreshToken, profile, done) => {
		const oauthId = `google-${profile.id}`,
			userData = {
				//always update the user when they log in, just in case we end up using their name/profile picture
				//and they changed it on their account, we don't want to show an old name or picture.
				displayName: profile.displayName,
				profileImage: profile.photos[0].value,
				oauthProvider: 'google',
				//an externally unique ID to match this user to a row
                oauthId,
				raw: JSON.stringify(profile)
			};
		let user = await prisma.user.findFirst({
				where: {
					oauthId
				},
				include: {
					settings: true
				}
			});

		if (!user) {
			usersNew.inc();
			usersTotal.inc();
			authLogger.info(`New user "${oauthId}"`);
			user = await prisma.user.create({
				data: Object.assign(userData, {
					settings: {
						create: getSettingsDefaults()
					}
				}),
				include: {
					settings: true
				}
			});
		}
		else {
			await prisma.user.update({
				data: userData,
				where: {
					id: user.id
				}
			})
		}

		authLogger.info(`User logged in "${user.oauthId}"`);
		done(null, user);
	}
));

passport.serializeUser(function(user: User, done) {
	done(null, user.id);
});

passport.deserializeUser(async function(id: string, done) {
	const user = await prisma.user.findUnique({
		where: {
			id
		},
		include: {
			settings: true
		}
	});

	if (!user.settings) {
		user.settings = await prisma.settings.create({
			data: {
				userId: user.id,
				...getSettingsDefaults()
			}
		});
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
