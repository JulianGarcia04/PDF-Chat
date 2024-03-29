import { app, InvocationContext } from "@azure/functions";

import { ollamaClient } from "../config/ollama";
import { redisClient } from "../config/redis";

export async function getTextFromPDF(
	blob: Buffer,
	context: InvocationContext
): Promise<void> {
	try {
		console.log(context.triggerMetadata);

		const pdfTitle = context.triggerMetadata.name;

		const pdfText = await redisClient.get(`pdf-text-${pdfTitle}`);

		await ollamaClient.embeddings({
			model: "llama2",
			prompt: `Te voy a pasar un texto que fue extraído de un PDF. Utiliza este conocimiento para las futuras preguntas y requerimientos. Este es el texto ${pdfText}`,
		});

		context.log(
			`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`
		);
	} catch (error) {
		context.error("Error in getTextFromPDF", error);
	}
}

app.storageBlob("getTextFromPDF", {
	path: "pdfs/{name}.pdf",
	connection: "AzureWebJobsStorage",
	handler: getTextFromPDF,
});
