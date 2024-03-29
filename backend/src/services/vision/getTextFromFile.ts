import {
	ReadInStreamResponse,
	GetReadResultResponse,
} from "@azure/cognitiveservices-computervision/esm/models";
import { promisify } from "util";

import { computerVisionClient } from "../../config/azure-vision";

const sleep = promisify(setTimeout);

const getTextFromFile = async (
	buffer: Buffer | Uint8Array
): Promise<string> => {
	let response: ReadInStreamResponse = await computerVisionClient.readInStream(
		buffer
	);

	let operation = response.operationLocation.split("/").slice(-1)[0];

	let result: GetReadResultResponse;

	while (response._response.status !== 200) {
		await sleep(1000);
		result = await computerVisionClient.getReadResult(operation);

		if (result._response.status === 200 && result.status === "succeeded") {
			break;
		}
	}

	const text = result.analyzeResult.readResults
		.map((result) => {
			return result.lines.map((line) => line.text).join(" ");
		})
		.join(" ");

	return text;
};

export default getTextFromFile;
