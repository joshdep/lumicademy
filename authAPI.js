import { auth } from './apiDefinitions';
import { handleErrors } from './errorHandlers';

const storageKeys = {
	"staging": "_staging",
	"root": ""
};

const storageKeySuffix = storageKeys[process.env.REACT_APP_DOMAIN] || "";

export const TOKEN_KEY = `access_token${storageKeySuffix}`;
export const REFRESH_TOKEN = `refresh_token${storageKeySuffix}`;

// Runs a function provided by subscribers every time the token is updated
export var Updater = {
	subscribers: [],
	add: function(subscriber) {
		this.subscribers.push(subscriber);
	},
	remove: function(subscriber) {
		var index = this.subscribers.indexOf(subscriber);
		if (index !== -1) this.subscribers.splice(index, 1);
	},
	notify: function() {
		this.subscribers.forEach(subscriber => {
			subscriber();
		});
	}
};

// Refreshes the token before it expires
export var RefreshTimer = {
	timer: null,
	setupTimer: function(tokenInfo) {
		var expires = tokenInfo.expires_in;
		var almostExpired = expires - 60;

		this.timer = setTimeout(() => {
			console.log("Refreshing Token");
			renewToken();
		}, almostExpired * 1000);
	},
	start: function(tokenInfo) {
		if (this.timer) this.stop();
		if (tokenInfo === undefined) {
			getTokenInfo().then(tokenInfo => this.setupTimer(tokenInfo));
		} else {
			this.setupTimer(tokenInfo);
		}
	},
	stop: function() {
		clearTimeout(this.timer);
	}
};

/* AUTHENTICATION */

// Retrieves an authorized token using sign in credentials and runs appropriate action
export const signin = (data, action, error) => {
	auth.post("/auth/login", data)
		.then(response => {
			updateToken(response.data);
			if (action !== undefined) action();
		}).catch(e => handleErrors(e, error));
};

// Removes the current token and performs an action if provided
export const signout = action => {
	auth.delete("/auth/logout", getAuthHeader())
		.then(response => {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(REFRESH_TOKEN);
			if (action !== undefined) action();
		}).catch(handleErrors);
};

// Simple check for an existing token
export const isAuthenticated = () => {
	return localStorage.getItem(TOKEN_KEY) !== null ? true : false;
};

// Returns the necessary headers for accessing APIs with any additional options provided
export const getAuthHeader = addOptions => {
	const authHeader = {
		headers: {
			'Authorization': 'Bearer ' + localStorage.getItem(TOKEN_KEY)
		}
	};

	return addOptions ? {...authHeader, ...addOptions} : authHeader;
};

/* TOKENS */

// Retrieves all info about the current token in use
export const getTokenInfo = async () => {
	var options = {
		params: {
			'access_token': localStorage.getItem(TOKEN_KEY)
		}
	};

	try {
		const response = await auth.get("/auth/oauth2/tokenInfo", options);
		return response.data;
	} catch(e) {
		handleErrors(e);
		return null;
	}
};

let tokenNotifcationTimer = null;

// Updates the token and runs all update functions from the Updater helper
export const updateToken = tokenData => {
	localStorage.setItem(TOKEN_KEY, tokenData.access_token);
	localStorage.setItem(REFRESH_TOKEN, tokenData.refresh_token);
	RefreshTimer.start(tokenData);

	clearTimeout(tokenNotifcationTimer);
	tokenNotifcationTimer = setTimeout(() => {
		Updater.notify();
	}, 1);
};

// Renews the token using a refresh token
export const renewToken = callback => {
	const refreshData = {
		grant_type: 'refresh_token',
		refresh_token: refreshToken
	};

	auth.post("/auth/oauth2/token", refreshData, getAuthHeader())
		.then(response => {
			var tokenInfo = response.data;
			updateToken(tokenInfo);
			if (callback) callback(tokenInfo);
		}).catch(handleErrors);
};

var Auth = {
	TOKEN_KEY: TOKEN_KEY,
	REFRESH_TOKEN: REFRESH_TOKEN,
	Updater: Updater,
	RefreshTimer: RefreshTimer,
	isAuthenticated: isAuthenticated,
	getAuthHeader: getAuthHeader,
	getTokenInfo: getTokenInfo,
	updateToken: updateToken,
	renewToken: renewToken
};

export default Auth;
