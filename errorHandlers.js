import { TOKEN_KEY } from './authAPI';

export const ERRORCODE = {
	INCORRECT_PASSWORD: -3,
	USERNAME_NOT_FOUND: -1,
	CONNECTION: 1,
	OPERATION: 2,
	INVALID_JSON: 3,
	INVALID_PATH: 4,
	INVALID_REQUEST_BODY: 5,
	INVALID_URL_ENCODED_BODY: 6,
	MISSING_URI_PARAM: 7,
	MISSING_ELEMENT: 8,
	MISSING_REQUEST_BODY: 9,
	MISSING_RESPONSE_BODY: 10,
	MISSING_AUTH_HEADER: 11,
	MISSING_AUTH_CREDENTIALS: 12,
	UNSUPPORTED_AUTH_FORMAT: 13,
	TOKEN_UNAUTHORIZED: 14,
	INVALID_USERNAME: 15,
	INVALID_PASSWORD: 16,
	INVALID_CLIENT_ID: 17,
	INVALID_CLIENT_SECRET: 18,
	INVALID_API_KEY: 19,
	SERVER_UNAUTHORIZED: 20,
	START_FAILED: 21,
	INVALID_URL: 22,
	INVALID_SETTING: 23,
	NO_SERVERS_AVAILABLE: 24,
	USERNAME_EXISTS: 100,
	INVALID_CONFERENCE_ID: 200,
	INVALID_USER_ID: 201,
	CONFERENCE_DELETED: 202,
	USER_DELETED: 203,
	DUPLICATE_PASSWORDS: 204,
	STORAGE_ERROR: 300,
	INVALID_CONTENT_ID: 301,
	CONTENT_IN_USE: 302
}

// Checks for authorization errors.
// Redirects if unauthorized and displays error to console
const defaultAction = (type, code, message) => {
	if (code === ERRORCODE.TOKEN_UNAUTHORIZED) {
		message = "Session Timed Out: Please sign in";
		window.location.href="/SignIn?type=error&message="+message;
	}
	console.log(type,code,message);
};

// Displays error messages depending on where the error occurs
export const handleErrors = (error, callback) => {
	if (error.response) {
		var status = error.response.status;
		var code = error.response.data.error_code;
		var message = error.response.data.error_description;

		// If no callback is provided, perform default action
		if (callback === undefined) {
			callback = defaultAction;
			localStorage.removeItem(TOKEN_KEY);
		}

		callback("error", code, message);
	} else if (error.request && error.response) {
		console.log('Request Error: ',error.request);
	} else if (error.request) {
		console.log('Request Error: ',error.request);
	} else {
		console.log(error);
	}
	console.log('Config: ', error.config);
};

var Errors = {
	ERRORCODE: ERRORCODE,
	handleErrors: handleErrors
};

export default Errors;