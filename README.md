# lumicademy ![npm version](https://img.shields.io/badge/dynamic/json?label=npm&prefix=v&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fjoshdep%2Flumicademy%2Fmaster%2Fpackage.json) ![install size](https://packagephobia.now.sh/badge?p=lumicademy)

A library of functions for connecting to the Lumicademy APIs.

## Install

```
$ npm install lumicademy
```

## Usage

To use this library, you can import the entire library, a specific API from the library, or a specific function from any library.

```js
// Imports the entire lumicademy library
@import Lumi from 'lumicademy';

Lumi.getConferences(conferences => {
	// Do something with conferences
});

// EX: Import the Core API
@import * as Core from 'lumicademy/coreAPI';

Core.getConferences(conferences => {
	// Do something with conferences
});

// EX: Import 'getConferences' from Core API
@import { getConferences } from 'lumicademy/coreAPI';

getConferences(conferences => {
	// Do something with conferences
});
```

The examples below will breakdown usage declarations for each function with the respective libraries.

### Auth API

```js
// Import the library
@import * as Auth from 'lumicademy/authAPI';


// Updater is a subscription object that runs a callback function each time the authorization token is updated
Auth.Updater

// Add a function to subscription
Auth.Updater.add(YOUR_FUNCTION_HERE);

// Remove a function from subscription
Auth.Updater.remove(YOUR_FUNCTION_HERE);


// Manage token refreshing automatically
Auth.RefreshTimer.start();


// Check for authentication
Auth.isAuthenticated(); // => true/false


// Creates a header for all other API requests that takes optional parameters
Auth.getAuthHeader(); // => Returns Auth header object
Auth.getAuthHeader(MORE_OPTIONS); // => Returns Auth header with additional options

// Retreive token information from the currently authorized token
// NOTE: This function is asynchronous and will return a Promise
Auth.getTokenInfo().then(tokenInfo => {
	// Do something with token info
});

// Updates the token on local storage, runs the Updater notifier, and resets the RefreshTimer
Auth.updateToken(TOKEN_DATA);

// Function to renew the token and update the token information
Auth.renewToken(tokenInfo => {
	// Do something with new token info
})
````

### Core API

```js
// Import the library
@import * as Core from 'lumicademy/coreAPI';

/* OBJECTS AND VARIABLES */

// Objects defining states and methods used in the Core API
Core.confState[1]; // => "Upcoming"

Core.startMethod[2]; // => "Automatically started when the first user joins"

Core.userKind[1]; // => "Guest"

// Enumerations for user state
Core.userState.CREATED; // => 1
Core.userState.DELETED; // => 2

// Enumerations for content relations
Core.relateContentAs.DOCSHARE; // => 1
Core.relateContentAs.FILESHARE; // => 2


/* CONFERENCES */

// Returns a list of conferences
Core.getConferences(conferences => {
	// Do something with conferences
});

// Returns a specific conference
Core.getConference(CONF_ID_HERE, conference => {
	// Do something with the conference
});

// Adds a new conference and returns the newly added conference
Core.addConference({DATA_OBJ}, conference => {
	// Do something with new conference
});

// Updates the conference and returns the updated conference
Core.updateConference(CONF_ID_HERE, {DATA_OBJ}, conference => {
	// Do something with updated conference
});

// Marks the conference as deleted and runs a callback
Core.deleteConference(CONF_ID_HERE, () => {
	// Do something after delete is complete
});


/* CONFERENCES - USERS */

// Returns a list of users associated with a given conference
Core.getUsers(CONF_ID_HERE, users => {
	// Do something with users
});

// Returns a specific user from a given conference
Core.getUser(CONF_ID_HERE, USER_ID_HERE, user => {
	// Do something with user
});

// Adds a new user and returns updated list of all users
Core.addUser(CONF_ID_HERE, {DATA_OBJ}, users => {
	// Do something with new list of users
});

// Updates the user and returns updated list of all users
Core.updateUser(CONF_ID_HERE, USER_ID_HERE, {DATA_OBJ}, users => {
	// Do something with new list of users
});

// Deletes a user and returns updated list of all users
Core.deleteUser(CONF_ID_HERE, USER_ID_HERE, users => {
	// Do something with new list of users
});


/* CONFERENCES - CONTENT */

// Returns an array of all linked content for a specific conference
Core.getLinkedContent(CONF_ID_HERE, contents => {
	// Do something with list of content
});

// Links a specific content object to the specified conference
Core.linkContent(CONF_ID_HERE, CONTENT_ID_HERE, RELATION, contents => {
	// Do something with updated list of content
});

// Removes a link to specific content object from the specified conference
Core.unlinkContent(CONF_ID_HERE, CONTENT_ID_HERE, contents => {
	// Do something with updated list of content
});
```

### Content API

```js
// Import the library
@import * as ContentAPI from 'lumicademy/contentAPI';

// Defines an object for delete methods
ContentAPI.deleteMethod.NEVER; // => 1
ContentAPI.deleteMethod.AUTO; // => 2 (Delete when linked conference is deleted)


/* CONTENT CLASS */
var content = new ContentAPI.Content();

// Sets content value from another content object
content.set(ANOTHER_CONTENT_OBJ);

// Returns the form data needed to upload new content to servers
var formData = content.getData();
// => {
//       'request': { contentType, displayName, fileName, deleteMethod },
//       'content': CONTENT_FROM_FILE	
//    }

// Use the static method convertToFile to convert file from HTML form to Content object
ContentAPI.Content.convertFile(FILE_HERE); // => Content()


/* CONTENTS */

// Returns a list of all content from authorized account
ContentAPI.getContents(contents => {
	// Do something with list of content
});

// Downloads the specified file from server
ContentAPI.getContent({CONTENT_OBJ}, progress => {
	// Do something with current progress of download
});

// Uploads content to the server and sends progress updates via callback
ContentAPI.addContent(FORM_DATA_HERE, contents => {
	// Do something with new list of content
}, progress => {
	// Do something with current progress of upload
});

// Updates content data or file from provided form data and sends updates 
ContentAPI.updateContent(CONTENT_ID_HERE, FORM_DATA_HERE, contents => {
	// Do something with new list of content
}, progress => {
	// Do something with current progress of upload
});

// Deletes content from server unless content is in use within a conference
// If FORCE_DELETE is set to true, the content will be deleted even when in use within any conferences
// A custom error handler may be provided. If none is provided, the default error handler will be used 
ContentAPI.deleteContent(CONTENT_ID_HERE, contents => {
	// Do something with new list of content
}, FORCE_DELETE = false, error => {
	// Do something if error occurred during deletion
});
```

## Troubleshooting

There is a default error handler built into this library that will output any error to the console with the code and message.

You may wish to create custom error handlers to test and debug your code. You may do so by passing a callback to the default handler or by changing the handler entirely.

There is a ERRORCODE enumeration within the errorHandler.js file that will come in handy if you choose to create custom handlers.

Below is an example of how to pass a callback to the error handler:
```js
// errorHandler.js

// Default error call
handleErrors(error); // => console.log(type, code, message)

// Custom error call with added callback
handleErrors(error, (type, code, message) => {
	switch(code) {
		case ERRORCODE.TOKEN_UNAUTHORIZED:
			// Do something
			break;
		default:
			// Do something else
	}
});
```