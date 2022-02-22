import { Response, NextFunction } from 'express';
import { AppRequest } from '../app.js';
import { httpLogger } from '../util/logger.js';

interface HttpError {
	status: number;
}

export const httpStatusDescriptions = new Map([
	[400, 'Bad Request'],
	[401, 'Not Authorized'],
	[403, 'Forbidden'],
	[404, 'Not Found'],
	[500, 'Internal Server Error'],
]);

// statuses that we don't need to log
const uninterestingStatusCodes = [401, 404];

export const getHttpStatusDescription = (statusCode: number) => {
	return httpStatusDescriptions.get(statusCode) ?? `HTTP Status ${statusCode}`;
};

export const errorHandler =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(internal: boolean) => (error: Error | HttpError, req: AppRequest, res: Response, next: NextFunction) => {
		const status = (error instanceof Error ? 500 : error.status) ?? 500,
			message = getHttpStatusDescription(status),
			level = internal || status === 500 ? 'error' : 'info';

		// always log errors on internal servers, but don't log for any random 404 error, not useful
		if (internal || !uninterestingStatusCodes.includes(status)) {
			httpLogger[level](`${message}: "${req.url}"`, {
				status,
				error: error instanceof Error ? error : undefined,
				internal,
				path: req.url,
				userId: req.user?.id,
				requestId: req.requestId,
				userAgent: req.get('User-Agent'),
			});
		}

		res.status(status);
		res.send({
			requestId: req.requestId,
			error: getHttpStatusDescription(status),
		});
	};

//Express doesn't catch errors in async functions, wrap them all in this so
//throwing in an handler will respond with a 500 error if it throws
export const safeAsyncRoute = (routeHandler: (req: AppRequest, res: Response, next?: NextFunction) => any) => {
	return async (req: AppRequest, res: Response, next: NextFunction) => {
		try {
			await routeHandler(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};
