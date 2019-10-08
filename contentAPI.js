import * as fileDownload from 'js-file-download';
import { api, upload } from './apiDefinitions';
import { TOKEN_KEY, getAuthHeader } from './authAPI';
import { handleErrors } from './errorHandlers';

// Enumeration for type of delete method
export const deleteMethod = { NEVER: 1, AUTO: 2 };

// Custom class for Lumicademy Content
export class Content {
	constructor() {
		this.contentId = undefined;
		this.content = "";
		this.contentType = "*/*";
		this.displayName = "";
		this.fileName = "";
		this.created = undefined;
		this.downloading = 0;
		this.deleteMethod = deleteMethod.NEVER;

		this.set = this.set.bind(this);
		this.getData = this.getData.bind(this);
	}

	set(file) {
		this.contentId = file.contentId;
		this.content = file.content;
		this.contentType = file.contentType;
		this.displayName = file.displayName;
		this.fileName = file.fileName;
		this.created = file.created;
		this.deleteMethod = file.deleteMethod;
	}

	static convertFile(file) {
		var content = new this();
		content.contentType = file.type;
		content.content = file;
		content.displayName = file.name;
		content.fileName = file.name;
		return content;
	}

	getData() {
		var request = {
			contentType: this.contentType,
			displayName: this.displayName,
			fileName: this.fileName,
			deleteMethod: this.deleteMethod
		};

		const json = JSON.stringify(request);
		const requestBlob = new Blob([json], { type: 'application/json' });

		var data = new FormData();
		data.append('request', requestBlob);
		data.append('content', this.content);
		return data;
	}
}

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

var ContentAPI = {
	deleteMethod: deleteMethod,
	convertFileToContent: convertFileToContent,
	Content: Content,
	generateFileOptions: generateFileOptions,
	getContents: getContents,
	getContent: getContent,
	addContent: addContent,
	updateContent: updateContent,
	deleteContent: deleteContent
};

export default ContentAPI;