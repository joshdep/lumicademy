import * as fileDownload from 'js-file-download';
import { api, upload } from './apiDefinitions';
import { TOKEN_KEY, getAuthHeader } from './authAPI';
import { handleErrors } from './errorHandlers';

// Sets up authorization headers and adds a progress updater if provided
export const generateFileOptions = updateProgress => {
	return {
		headers: { 'Authorization': 'Bearer ' + localStorage.getItem(TOKEN_KEY) },
		onUploadProgress: updateProgress ? updateProgress : null
	};
};

// Retrieves all contents under storage id
export const getContents = callback => {
	api.get("/contents", getAuthHeader())
		.then(response => {
			var contents = response.data.items;
			callback(contents);
		}).catch(handleErrors);
};

// Downloads selected content
export const getContent = (content, updateProgress) => {
	var options = {
		responseType: 'blob',
		onDownloadProgress: updateProgress ? updateProgress : null
	};

	api.get("/content/"+content.contentId, getAuthHeader(options))
		.then(response => {
			fileDownload(response.data, content.fileName);
		}).catch(handleErrors);
};

// Uploads a file to the storage id
export const addContent = (data, callback, updateProgress) => {
	var options = generateFileOptions(updateProgress);
	upload.post("/content", data, options)
		.then(response => {
			getContents(callback);
		}).catch(handleErrors);
};

// Updates content info
export const updateContent = (contentId, data, callback, updateProgress) => {
	var options = generateFileOptions(updateProgress);
	upload.put("/content/"+contentId, data, options)
		.then(response => {
			getContents(callback);
		}).catch(handleErrors);
};

// Removes content if not in use in a conference. There is also an option to bypass and delete anyway
export const deleteContent = (contentId, callback, forceDelete, errorHandler) => {
	var options = {
		params: {
			'force': forceDelete ? forceDelete : false
		}
	};

	api.delete("/content/"+contentId, getAuthHeader(options))
		.then(response => {
			getContents(callback);
		}).catch(errorHandler ? errorHandler : handleErrors);
};