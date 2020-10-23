import {NextFunction, Response} from 'express';
import {AppRequest} from "../app";

export const getUserId = (req: AppRequest) => {
	return req.user ? req.user.id : null;
};
export const requireAuth = (req: AppRequest, res: Response, next: NextFunction) => {
	//all endpoints must be auth'd
	if (!req.isAuthenticated()) {
		next({
			status: 401
		})
	}
	else {
		next();
	}
}