import { z } from "zod";

export const uploadPDFResponseSchema = z.object({
	pages: z.number(),
	title: z.object({
		raw: z.string(),
		processed: z.string(),
	}),
	url: z.string().url(),
	requestId: z.string(),
	clientRequestId: z.string(),
});

export type UploadPDFResponse = z.infer<typeof uploadPDFResponseSchema>;
