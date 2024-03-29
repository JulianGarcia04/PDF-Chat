import { uploadPDFResponseSchema, type UploadPDFResponse } from "../schemas";
import { server } from "./config";

const uploadPDF = async (pdf: File): Promise<UploadPDFResponse> => {
	const formData = new FormData();
	formData.append("pdf", pdf);
	const response = await server.post("/uploadPDF", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	if (response.status !== 200) {
		throw new Error(response.data);
	}

	const pdfInfo = uploadPDFResponseSchema.parse(response.data);

	return pdfInfo;
};

export default uploadPDF;
