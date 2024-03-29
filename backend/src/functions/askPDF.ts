import {
	app,
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from "@azure/functions";

import {
	askPDFBodyRequestSchema,
	askPDFBodyResponseSchema,
} from "../schemas/askPDF";
import { ollamaClient } from "./../config/ollama";
import { redisClient } from "../config/redis";

export async function askPDF(
	request: HttpRequest,
	context: InvocationContext
): Promise<HttpResponseInit> {
	if (request.method !== "POST") {
		return {
			status: 405,
			body: "Method Not Allowed",
		};
	}

	try {
		const body = await request.json();

		const checkBodyRequest = askPDFBodyRequestSchema.safeParse(body);

		if (checkBodyRequest.success === false) {
			return {
				status: 400,
				body: `Bad Request. Error ${checkBodyRequest.error}`,
			};
		}

		const { pdfTitle, message } = checkBodyRequest.data;

		console.log("message", message);

		const pdfText = await redisClient.get(`pdf-text-${pdfTitle}`);

		console.log("PDF Text from redis", pdfText);

		const callLLM = await ollamaClient.chat({
			model: "llama2",
			messages: [
				{
					role: "system",
					content:
						'Eres un investigador español experimentado, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar únicamente información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No intentes inventar una respuesta. Cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario.',
				},
				{
					role: "user",
					content: `<context>${pdfText}</context><question>${message}</question>`,
				},
			],
		});

		console.log("LLM Response", callLLM);

		const response = askPDFBodyResponseSchema.parse({
			message: callLLM.message.content,
			created_at: {
				raw: callLLM.created_at,
				formatted: callLLM.created_at.toLocaleString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
					timeZone: "America/Bogota",
				}),
			},
		});

		return {
			status: 200,
			jsonBody: response,
		};
	} catch (error) {
		console.error("Error asking for PDF", error);
	}
}

app.http("askPDF", {
	methods: ["POST"],
	authLevel: "anonymous",
	handler: askPDF,
});
