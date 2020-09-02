import axios from 'axios';

/* HEADERS */

export const headers = {
	'accept': 'application/json',
	'Content-Type': 'application/json'
};

export const allDetails = {
	params: {
		'details': 'all'
	}
};

const apiDomains = {
	"staging": "-staging",
	"root": ""
};

const apiDomain = apiDomains[window.env.ENVIRONMENT] ?? "";

/* API URL CONFIGURATIONS */

export const api = axios.create({
	baseURL: `https://api${apiDomain}.lumicademy.com/`,
	headers: headers
});

export const upload = axios.create({
	baseURL: `https://api${apiDomain}.lumicademy.com/`
});

export const auth = axios.create({
	baseURL: `https://auth${apiDomain}.lumicademy.com/`,
	headers: headers
});

var Definitions = {
	headers: headers,
	allDetails: allDetails,
	api: api,
	upload: upload,
	auth: auth
};

export default Definitions;
