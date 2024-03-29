import { writable } from "svelte/store";

import { type UploadPDFResponse } from "./schemas";

export const APP_STATUS = {
	INIT: 0,
	LOADING: 1,
	CHAT_MODE: 2,
	ERROR: -1,
};

export const appStatus = writable(APP_STATUS.INIT);

export const chatModeStatusInfo = writable<UploadPDFResponse>();

export const setLoadingStatus = () => {
	appStatus.set(APP_STATUS.LOADING);
};

export const setErrorStatus = () => {
	appStatus.set(APP_STATUS.ERROR);
};

export const setChatModeStatus = (info: UploadPDFResponse) => {
	chatModeStatusInfo.set(info);
	appStatus.set(APP_STATUS.CHAT_MODE);
};
