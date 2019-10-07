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

/* API URL CONFIGURATIONS */

export const api = axios.create({
	baseURL: 'https://api.lumicademy.com/',
	headers: headers
});

export const upload = axios.create({
	baseURL: 'https://api.lumicademy.com/'
});

export const auth = axios.create({
	baseURL: 'https://auth.lumicademy.com/',
	headers: headers
});