import {NextFunction, Request as ExpressRequest, Response} from 'express';
import {User} from '../util/user';


export interface Request extends ExpressRequest {
	user: User
}

export const getUserId = (req: Request) => {
	return req.user ? req.user.user_id : null;
};
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	//all endpoints must be auth'd
	if (!req.isAuthenticated()) {
		res.status(401);
		res.send(null);
	}
	else {
		next();
	}
}