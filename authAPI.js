import { auth } from './apiDefinitions';
import { handleErrors } from './errorHandlers';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

var token = localStorage.getItem(TOKEN_KEY);
var refreshToken = localStorage.getItem(REFRESH_TOKEN);

// Runs a function provided by subscribers every time the token is updated
var Updater = {
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
var RefreshTimer = {
	timer: null,
	setupTimer: function(tokenInfo) {
		var expires = tokenInfo.expires_in;
		var almostExpired = expires - 60;

		this.timer = setTimeout(() => {
			console.log("Refreshing Token");
			renewToken(tokenInfo => this.start(tokenInfo));
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

// Simple check for an existing token
const isAuthenticated = () => {
	return token ? true : false;
};

// Returns the necessary headers for accessing APIs with any additional options provided
const getAuthHeader = addOptions => {
	const authHeader = {
		headers: {
			'Authorization': 'Bearer ' + localStorage.getItem(TOKEN_KEY)
		}
	};

	return addOptions ? {...authHeader, ...addOptions} : authHeader;
};

// Retrieves all info about the current token in use
const getTokenInfo = async () => {
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

// Updates the token and runs all update functions from the Updater helper
const updateToken = tokenData => {
	token = tokenData.access_token;
	localStorage.setItem(TOKEN_KEY, tokenData.access_token);

	refreshToken = tokenData.refresh_token;
	localStorage.setItem(REFRESH_TOKEN, tokenData.refresh_token);

	Updater.notify();
	RefreshTimer.start(tokenData);
};

// Renews the token using a refresh token
const renewToken = callback => {
	const refreshData = {
		grant_type: 'refresh_token',
		refresh_token: refreshToken
	};

	auth.post("/auth/oauth2/token", refreshData, getAuthHeader())
		.then(response => {
			var tokenInfo = response.data;
			updateToken(tokenInfo);
			callback(tokenInfo);
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

module.exports = Auth;
module.exports.default = Auth;