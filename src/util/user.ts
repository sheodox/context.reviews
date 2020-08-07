import db from './db';
import {Profile} from "passport-google-oauth";

export interface UserProfile {
	display_name: string,
	profile_image: string,
	oauth_provider: string,
	oauth_id: string,
	raw: string
}

export class User {
    user_id: string;
    profile: UserProfile

	constructor(profile: Profile) {
		this.profile = {
			display_name: profile.displayName,
			profile_image: profile.photos[0].value,
			oauth_provider: 'google',
			//an externally unique ID to match this user to a row
			oauth_id: `google-${profile.id}`,
			raw: JSON.stringify(profile)
		}
	}
	async save() {
		const columns: (keyof UserProfile)[] = [
			'oauth_id',
			'display_name',
			'profile_image',
			'oauth_provider',
			'raw'
		];
		//insert or update the user (so we always have fresh information each log in), then get the user_id
		const [{user_id}] = (await db.query(
			`INSERT INTO users(${columns.join(', ')}) VALUES (${columns.map((c, i) => `$${i + 1}`).join(', ')})
			ON CONFLICT (oauth_id) DO UPDATE
				SET ${columns.map(c => `${c} = EXCLUDED.${c}`).join(', ')} RETURNING user_id`,
			columns.map(columnName => this.profile[columnName])
		)).rows;

		this.user_id = user_id;
	}
	getId() {
		return this.user_id;
	}
}