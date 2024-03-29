import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";

import { env } from "./env";

export const computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({
		inHeader: {
			"Ocp-Apim-Subscription-Key": env.VISION_KEY,
		},
	}),
	env.VISION_ENDPOINT
);
