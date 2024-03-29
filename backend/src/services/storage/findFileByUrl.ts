import { BlockBlobClient } from "@azure/storage-blob";
import findAllFiles from "./findAllFiles";

const findFileByUrl = async (url: string): Promise<BlockBlobClient | null> => {
	const blobList: BlockBlobClient[] = await findAllFiles();

	const findFile = blobList.find((blob) => blob.url === url);

	if (!findFile) {
		return null;
	}

	return findFile;
};

export default findFileByUrl;
