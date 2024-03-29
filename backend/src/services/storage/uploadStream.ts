import { Metadata } from "@azure/storage-blob";
import { containerClient } from "../../config/storage-blob";

const uploadStream = async (
	stream: ArrayBuffer | Uint8Array,
	blobName: string,
	blobSize: number,
	blobContentType: string,
	metadata: Metadata
) => {
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	const uploadBlobResponse = await blockBlobClient.upload(stream, blobSize, {
		blobHTTPHeaders: {
			blobContentType: blobContentType,
		},
		metadata,
	});

	if (uploadBlobResponse._response.status !== 201) {
		throw new Error(
			`Error uploading blob. Status: ${uploadBlobResponse._response.status}`
		);
	}

	return {
		client: blockBlobClient,
		response: uploadBlobResponse,
	};
};

export default uploadStream;
