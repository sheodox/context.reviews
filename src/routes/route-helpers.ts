import {NextFunction, Request as ExpressRequest, Response} from 'express';
import {User} from '../entity/User';
import {logHttpError} from "../util/logger";


export interface Request extends ExpressRequest {
	user: User
}

export const getUserId = (req: Request) => {
	return req.user ? req.user.id : null;
};
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	//all endpoints must be auth'd
	if (!req.isAuthenticated()) {
		res.status(401);
		res.send(null);
		logHttpError({
			status: 401,
			req
		});
	}
	else {
		next();
	}
}