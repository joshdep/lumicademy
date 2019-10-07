import axios from 'axios';

/* HEADERS */

const headers = {
	'accept': 'application/json',
	'Content-Type': 'application/json'
};

const allDetails = {
	params: {
		'details': 'all'
	}
};

/* API URL CONFIGURATIONS */

const api = axios.create({
	baseURL: 'https://api.lumicademy.com/',
	headers: headers
});

const upload = axios.create({
	baseURL: 'https://api.lumicademy.com/'
});

const auth = axios.create({
	baseURL: 'https://auth.lumicademy.com/',
	headers: headers
});

var Definitions = {
	headers: headers,
	allDetails: allDetails,
	api: api,
	upload: upload,
	auth: auth
};

module.exports = Definitions;
module.exports.default = Definitions;