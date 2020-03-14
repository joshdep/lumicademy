import { api, allDetails } from './apiDefinitions';
import { getAuthHeader } from './authAPI';
import { handleErrors } from './errorHandlers';

/* RESPONSES */

export const confState = { 1: "Waiting to start",
						   2: "Live",
						   3: "Ended",
						   4: "Deleted" };

export const startMethod = { 1: "Manually waiting to be started",
					  		 2: "Automatically started when the first user joins",
					  		 3: "Waiting, but started when the owner joins" };

export const userState = { CREATED: 1, DELETED: 2 };

export const userKind = { 1: "Guest",
				   		  2: "Attendee",
				   		  3: "Owner" };

export const relateContentAs = { DOCSHARE: 1, FILESHARE: 2 };

/* CONFERENCES */

// Returns a list of conferences
export const getConferences = callback => {
	api.get("/conferences", getAuthHeader(allDetails))
		.then(response => {
			var conferences = response.data.items;
			callback(conferences);
		}).catch(handleErrors);
};

// Retrieves info about conference
export const getConference = (confId, callback) => {
	api.get("/conference/"+confId, getAuthHeader(allDetails))
		.then(response => {
			var conference = response.data;
			callback(conference);
		}).catch(handleErrors);
};

// Adds a new conference
export const addConference = (data, callback) => {
	api.post("/conference", data, getAuthHeader())
		.then(response => {
			var conference = response.data;
			callback(conference);
		}).catch(handleErrors);
};

// Updates conference details
export const updateConference = (confId, data, callback) => {
	api.put("/conference/"+confId, data, getAuthHeader())
		.then(response => {
			var conference = response.data;
			callback(conference);
		}).catch(handleErrors);
};

// Marks conference as deleted
export const deleteConference = (confId, callback, error) => {
	api.delete("/conference/"+confId, getAuthHeader())
		.then(response => {
			callback();
		}).catch(e => handleErrors(e, error));
};

/* USERS */

// Returns a list of users associated with a conference
export const getUsers = (confId, callback) => {
	api.get("/conference/"+confId+"/users", getAuthHeader(allDetails))
		.then(response => {
			var users = response.data.items;
			callback(users)
		}).catch(handleErrors);
};

// Gets details of user within a conference
export const getUser = (confId, userId, callback) => {
	api.get("/conference/"+confId+"/user/"+userId, getAuthHeader(allDetails))
		.then(response => {
			var user = response.data;
			callback(user)
		}).catch(handleErrors);
};

// Adds a new user to a conference
export const addUser = (confId, data, callback) => {
	api.post("/conference/"+confId+"/user", data, getAuthHeader())
		.then(response => {
			getUsers(confId, callback);
		}).catch(handleErrors);
};

// Updates user details / privileges
export const updateUser = (confId, userId, data, callback) => {
	api.put("/conference/"+confId+"/user/"+userId, data, getAuthHeader())
		.then(response => {
			getUsers(confId, callback);
		}).catch(handleErrors);
};

// Deletes a user from a conference
export const deleteUser = (confId, userId, callback) => {
	api.delete("/conference/"+confId+"/user/"+userId, getAuthHeader())
		.then(response => {
			getUsers(confId, callback);
		}).catch(handleErrors);
};

/* CONTENT */

// Returns a list of all content linked to a conference
export const getLinkedContent = (confId, callback) => {
	api.get("/conference/"+confId+"/contents", getAuthHeader(allDetails))
		.then(response => {
			var contents = response.data.items;
			callback(contents);
		}).catch(handleErrors);
};

// Links an exist content file to a conference
export const linkContent = (confId, contentId, relation, callback) => {
	var data = {
		relatedAs: relation
	};

	api.post("/conference/"+confId+"/content/"+contentId, data, getAuthHeader())
		.then(response => {
			getLinkedContent(confId, callback);
		}).catch(handleErrors);
};

// Removes a link between content and a conference
export const unlinkContent = (confId, contentId, callback) => {
	api.delete("/conference/"+confId+"/content/"+contentId, getAuthHeader())
		.then(response => {
			getLinkedContent(confId, callback);
		}).catch(handleErrors);
};

var Core = {
	confState: confState,
	startMethod: startMethod,
	userState: userState,
	userKind: userKind,
	relateContentAs: relateContentAs,
	getConferences: getConferences,
	getConference: getConference,
	addConference: addConference,
	updateConference: updateConference,
	deleteConference: deleteConference,
	getUsers: getUsers,
	getUser: getUser,
	addUser: addUser,
	updateUser: updateUser,
	deleteUser: deleteUser,
	getLinkedContent: getLinkedContent,
	linkContent: linkContent,
	unlinkContent: unlinkContent
};

export default Core;