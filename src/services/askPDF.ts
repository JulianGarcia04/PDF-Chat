import { askPDFResponseSchema } from "../schemas";
import { server } from "./config";

async function uploadPDF(message: string, pdfTitle: string) {
	const request = await server.post(
		"/askPDF",
		{ message, pdfTitle },
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	if (request.status !== 200) {
		throw new Error(request.data);
	}

	const response = askPDFResponseSchema.parse(request.data);

	return response;
}

export default uploadPDF;
