import { PDFDocument } from "pdf-lib";
import { extname } from "path";
import {
	app,
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from "@azure/functions";

import { uploadPDFResponseSchema } from "../schemas";
import { getTextFromFile } from "../services/vision";
import { uploadStream } from "../services/storage";
import { redisClient } from "../config/redis";

export async function uploadPDF(
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
		// --- start get and parse form data
		const formData = await request.formData();

		const data = Object.fromEntries(formData);

		// --- end get and parse form data

		// --- start validate and get pdf file

		const pdf = data.pdf as unknown as File;

		if (pdf.type !== "application/pdf") {
			throw new Error("Invalid file type. Only PDF files are allowed.");
		}

		const pdfArrayBuffer = await pdf.arrayBuffer();

		// --- end validate and get pdf file

		// --- start pdf props

		const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

		const pdfNroPages = pdfDoc.getPages().length;

		const pdfTitle = pdfDoc.getTitle() || pdf.name.split(".")[0];

		// --- end pdf props

		// --- upload pdf to storage
		const metadata = {
			nroPages: String(pdfNroPages),
			title: String(pdfTitle),
		};

		const processedFileTitle = `${pdfTitle
			.split(" ")
			.join("-")}-${crypto.randomUUID()}`;

		console.log("processedFileTitle", processedFileTitle);

		const { client, response } = await uploadStream(
			pdfArrayBuffer,
			`${processedFileTitle}${extname(pdf.name)}`,
			pdf.size,
			pdf.type,
			metadata
		);

		// --- end upload pdf to storage

		// --- start get text from pdf and save to redis

		const pdfText = await getTextFromFile(new Uint8Array(pdfArrayBuffer));

		await redisClient.set(`pdf-text-${processedFileTitle}`, pdfText);

		// --- end get text from pdf and save to redis

		const bodyResponse = uploadPDFResponseSchema.safeParse({
			url: client.url,
			requestId: response.requestId,
			clientRequestId: response.clientRequestId,
			pages: pdfNroPages,
			title: {
				raw: pdfTitle,
				processed: processedFileTitle,
			},
		});

		if (bodyResponse.success == false) {
			console.error("Error parsing response", bodyResponse.error.issues);
			throw new Error("Some is bad. Please check the logs");
		}

		return {
			status: 200,
			body: `Blob was uploaded successfully. requestId: ${response.requestId}`,
			jsonBody: bodyResponse.data,
		};
	} catch (error) {
		console.log("This is the error ", error);
		return {
			status: 400,
			body: error,
		};
	}
}

app.http("uploadPDF", {
	methods: ["POST"],
	authLevel: "anonymous",
	handler: uploadPDF,
});
