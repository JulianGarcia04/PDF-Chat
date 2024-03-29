import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "./env";
import { findAllFiles } from "../services/storage";

const AZURE_STORAGE_CONNECTION_STRING = env.AZURE_STORAGE_CONNECTION_STRING;

export const blobServiceClient = BlobServiceClient.fromConnectionString(
	AZURE_STORAGE_CONNECTION_STRING
);

export const containerClient = blobServiceClient.getContainerClient(`pdfs`);

containerClient
	.create()
	.then((res) => {
		console.log(
			`Container was created successfully.\n\trequestId:${res.requestId}\n\tURL: ${containerClient.url}`
		);
	})
	.catch(() => {
		console.log("Container already exists");
		// code only in development
		findAllFiles()
			.then((files) => {
				files.forEach((file) => {
					file
						.delete()
						.then(() => {
							console.info(`Deleted file`);
						})
						.catch((err) => {
							console.error(err);
						});
				});
			})
			.catch((err) => {
				console.error("Error geting all files", err);
			});
	});
