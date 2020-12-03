import {createPersistentToast} from 'sheodox-ui';

/**
 * Creates a toast with support information pre-filled out.
 * @param message - an error message relevant to what was going on
 * @param response - a fetch response object to try and get error/requestId.
 * @returns {Promise<void>}
 */
export async function createHttpErrorToast(message, response) {
	let error, requestId;
	try {
		const errorResponse = await response.json();
		error = errorResponse.error;
		requestId = errorResponse.requestId;
	} catch(e) {
		//if we don't get an error response something really bad probably happened
	}

	if (error && requestId) {
		createPersistentToast({
			title: 'Error',
			message: `${message} If you want to provide details of what happened you can email help@context.reviews along with this request ID.`,
			technicalDetails: error ? `${error}\nRequest ID: ${requestId}` : '',
			variant: 'error'
		});
	}
	else {
		createPersistentToast({
			title: 'Error',
			message: `${message}`,
			technicalDetails: `Error code ${response.status}`,
			variant: 'error'
		});
	}
}
