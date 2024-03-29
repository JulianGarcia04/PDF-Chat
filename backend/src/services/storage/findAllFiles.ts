import { containerClient } from "../../config/storage-blob";
import { BlockBlobClient } from "@azure/storage-blob";

const findAllFiles = async () => {
	const blobList: BlockBlobClient[] = [];

	for await (const blob of containerClient.listBlobsFlat()) {
		// Get Blob Client from name, to get the URL
		const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);

		const existsBlob = await tempBlockBlobClient.exists();

		if (existsBlob) {
			blobList.push(tempBlockBlobClient);
		}
	}

	return blobList;
};

export default findAllFiles;
