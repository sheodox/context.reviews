import { createPersistentToast } from 'sheodox-ui';

export const statusMessageMap = new Map([
	[401, { message: `You aren't logged in!`, showTechnicalDetails: false }],
	[500, { message: `Context.Reviews experienced an unknown error.`, showTechnicalDetails: true }],
	[502, { message: `Context.Reviews is down, try again in a minute.`, showTechnicalDetails: true }],
	[504, { message: `Context.Reviews isn't responding, try again later.`, showTechnicalDetails: true }],
]);

export function getDefaultHttpErrorMessage(res: Response) {
	return (statusMessageMap.get(res.status) || { message: 'An unknown error occurred.' }).message;
}

/**
 * Creates a toast with support information pre-filled out.
 * @param message - an error message relevant to what was going on
 * @param response - a fetch response object to try and get error/requestId.
 * @param parsedBody - if the body of the response was already parsed, it can be
 * passed directly, as it'll no longer be available on the response object
 * @returns {Promise<void>}
 */
export async function createHttpErrorToast(message: string, response: Response, parsedBody?: Record<string, string>) {
	let error, requestId;
	try {
		const errorResponse = parsedBody || (await response.json());
		error = errorResponse.error;
		requestId = errorResponse.requestId;
	} catch (e) {
		//if we don't get an error response something really bad probably happened
	}

	const statusDefaults = statusMessageMap.get(response.status) || {
		message: `An unknown error occurred.`,
		showTechnicalDetails: true,
	};
	message = message || statusDefaults.message;

	if (statusDefaults.showTechnicalDetails && error && requestId) {
		createPersistentToast({
			title: 'Error',
			message: `${message} If you want to provide details of what happened you can email help@context.reviews along with this request ID.`,
			technicalDetails: error ? `${error}\nRequest ID: ${requestId}` : '',
			variant: 'error',
		});
	} else {
		createPersistentToast({
			title: 'Error',
			message: `${message}`,
			technicalDetails: `Error code ${response.status}`,
			variant: 'error',
		});
	}
}
